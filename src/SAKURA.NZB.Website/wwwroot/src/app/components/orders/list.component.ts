/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
import {ClipboardDirective} from '../../directives/clipboard.directive';
import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';
import moment from 'moment';

declare var $: any;

export class Dict {
	orderStates = {};
	paymentStates = {};

	constructor() {
		this.orderStates['Created'] = '已创建';
		this.orderStates['Confirmed'] = '已确认';
		this.orderStates['Delivered'] = '已发货';
		this.orderStates['Received'] = '已签收';
		this.orderStates['Completed'] = '完成';

		this.paymentStates['Unpaid'] = '未支付';
		this.paymentStates['Paid'] = '已支付';
	}
}

class YearGroup {
	constructor(public year: number, public monthGroups: MonthGroup[]) { }
}

class MonthGroup {
	totalCost: string;
	totalPrice: string;
	totalProfit: string

	constructor(public month: string, public models: OrderModel[]) {
		this.updateSummary();
	}

	updateSummary() {
		var list = this.models.ToList<OrderModel>();
		this.totalCost = (list.Sum(om => om.totalCost)).toFixed(2);
		this.totalPrice = (list.Sum(om => om.totalPrice)).toFixed(2);
		this.totalProfit = (list.Sum(om => om.totalProfit)).toFixed(2);
	}
}

export class OrderModel {
	totalCost: number;
	totalPrice: number;
	totalQty: number;
	totalProfit: number;
	strTotalProfit: string;
	statusRate: number;
	statusText: string;
	expressText: string;

	constructor(public id: number, public orderTime: any, public deliveryTime: Date, public receiveTime: Date,
		public orderState: string, public paymentState: string, public waybillNumber: string, public weight: number,
		public freight: number, public recipient: string, public phone: string, public address: string,
		public sender: string, public senderPhone: string, public exchangeRate: number, public orderStates: Object,
		public customerOrders: CustomerOrder[]) {

		this.updateSummary();
		this.updateStatus();

		var that = this;
		var products = '';
		this.customerOrders.forEach(co => {
			co.orderProducts.forEach(op => {
				products += ' ' + op.productBrand + ' ' + op.productName + ' x' + op.qty + '\n';
			});
		});

		this.expressText = '【寄件人】' + this.sender + '\n【寄件人電話】' + this.senderPhone + '\n【訂單內容】\n' + products + '【收件人】'
			+ this.recipient + '\n【收件地址】' + this.address + '\n【聯繫電話】' + this.phone;
	}

	get delivered() { return this.waybillNumber && this.weight && this.freight; }

	updateStatus() {
		var seed = this.paymentState == 'Paid' ? 20 : 0;
		this.statusText = this.orderStates[this.orderState];

		switch (this.orderState) {
			case 'Created':
				this.statusRate = 0 + seed;
				break;
			case 'Confirmed':
				this.statusRate = 30 + seed;
				break;
			case 'Delivered':
				this.statusRate = 50 + seed;
				break;
			case 'Received':
				this.statusRate = 75 + seed;
				break;
			case 'Completed':
				this.statusRate = 100;
				break;
			default:
				this.statusRate = 0;
				this.statusText = '未知';
		}
	}

	updateSummary() {
		var freightCost = 0;
		if (this.freight)
			freightCost = this.freight * this.exchangeRate;

		var list = this.customerOrders.ToList<CustomerOrder>();
		this.totalCost = list.Sum(co => co.totalCost);
		this.totalPrice = list.Sum(co => co.totalPrice);
		this.totalQty = list.Sum(co => co.totalQty);
		this.totalProfit = list.Sum(co => co.totalProfit) - freightCost;
		this.strTotalProfit = this.totalProfit.toFixed(2);
	}
}

export class CustomerOrder {
	totalCost: number;
	totalPrice: number;
	totalQty: number;
	totalProfit: number;
	strTotalProfit: string;

	constructor(public customerId: number, public customerName: string, public orderProducts: OrderProduct[]) {		
		this.updateSummary();
	}

	updateSummary() {
		var list = this.orderProducts.ToList<OrderProduct>();
		this.totalCost = list.Sum(op => op.cost * op.qty);
		this.totalPrice = list.Sum(op => op.price * op.qty);
		this.totalQty = list.Sum(op => op.qty);
		this.totalProfit = list.Sum(op => op.profit);
		this.strTotalProfit = this.totalProfit.toFixed(2);
	}
}

export class OrderProduct {
	profit: number;
	strProfit: string;

	constructor(public productId: number, public productBrand: string, public productName: string, public cost: number,
		public price: number, public qty: number, public exchangeRate: number) {
		this.profit = (this.price - this.cost * this.exchangeRate) * this.qty;
		this.strProfit = this.profit.toFixed(2);
	}
}

class OrderDeliveryModel {
	constructor(public orderId: number, public waybillNumber: string, public weight: number, public freight: number) { }
}

@Component({
    selector: "customers",
    templateUrl: "./src/app/components/orders/list.html",
	styleUrls: ["./src/app/components/orders/orders.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, ClipboardDirective]
})
export class OrdersComponent implements OnInit {
	data: YearGroup[] = [];
	deliveryModel: OrderDeliveryModel = null;
	deliveryForm: ControlGroup;

	filteredData: YearGroup[] = [];
	filterText = '';
	orderState = '';
	paymentState = '';
	orderStates = (new Dict()).orderStates;
	orderStateKeys: string[] = [];
	paymentStates = (new Dict()).paymentStates;
	paymentStateKeys: string[] = [];

	totalAmount = 0;
	amount = 0;
	thisYear = moment().year();

	fixedRateHigh: number;
	fixedRateLow: number;
	currentRate: number;

	private _filterText = '';
	colorSheet = ['bg-red', 'bg-pink', 'bg-purple', 'bg-deeppurple', 'bg-indigo', 'bg-blue', 'bg-teal', 'bg-green', 'bg-orange', 'bg-deeporange', 'bg-brown', 'bg-bluegrey'];

    constructor(private service: ApiService, private router: Router) {
		this.deliveryModel = new OrderDeliveryModel(null, '', null, null);
		this.deliveryForm = new ControlGroup({
			waybillNumber: new Control(this.deliveryModel.waybillNumber, Validators.required),
			weight: new Control(this.deliveryModel.weight, Validators.required),
			freight: new Control(this.deliveryModel.freight, Validators.required),
		});

		for (var key in this.orderStates) {
			this.orderStateKeys.push(key);
		}
		for (var key in this.paymentStates) {
			this.paymentStateKeys.push(key);
		}
	}

    ngOnInit() {
        this.get();
    }

	get() {
		var that = this;

		this.service.getLatestExchangeRates(json => {
			if (json) {
				that.fixedRateHigh = json.fixedRateHigh;
				that.fixedRateLow = json.fixedRateLow;
				that.currentRate = json.currentRate.toFixed(2);

				that.loadOrders();
			}
		});
	}

	loadOrders() {
		var that = this;

		this.service.getOrders(json => {
			if (json)
				that.map(json, that, true);
		});
	}

	onClearFilter() {
		this.onSearchByKeyword('');
	}

	onSearchByKeyword(value: string) {
		if (this.filterText !== value)
			this.filterText = value;

		if (this.filterText === this._filterText)
			return;


		if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText))
			this.onSearch(this.orderState, this.paymentState);

		this._filterText = this.filterText;
	}

	onSearch(orderState: string, paymentState: string) {
		var that = this;

		this.service.getSearchOrders(this.filterText, orderState, paymentState, json => {
			if (json)
				that.map(json, that, false);
		});
	}

	//onEdit(cid: number) {
	//	this.customerList.forEach(x => {
	//		if (x.id == cid && (!this.isListViewMode || x.selected)) {
	//			this.router.navigate(['CEdit', { id: cid }]);
	//			return;
	//		}
	//	});
	//}

	onDeliverOpen(orderId: number) {
		this.deliveryModel = new OrderDeliveryModel(orderId, '', null, null);

		(<any>this.deliveryForm.controls['waybillNumber']).updateValue(this.deliveryModel.waybillNumber);
		(<any>this.deliveryForm.controls['weight']).updateValue(this.deliveryModel.weight);
		(<any>this.deliveryForm.controls['freight']).updateValue(this.deliveryModel.freight);

		$('#myModal').modal('show');
	}

	onDeliverySubmit() {
		$('#myModal').modal('hide');

		this.deliveryModel.waybillNumber = this.deliveryForm.value.waybillNumber;
		this.deliveryModel.weight = this.deliveryForm.value.weight;
		this.deliveryModel.freight = this.deliveryForm.value.freight;

		this.service.PostDeliverOrder(JSON.stringify(this.deliveryModel), json => {
			if (json) {
				var id = json.orderId;
				var orderState = json.orderState;
				var waybillNumber = json.waybillNumber;
				var weight = json.weight;
				var freight = json.freight;

				this.data.forEach(yg => {
					yg.monthGroups.forEach(mg => {
						var found = false;
						mg.models.forEach(om => {
							if (om.id == id) {
								om.orderState = orderState;
								om.waybillNumber = waybillNumber;
								om.weight = weight;
								om.freight = freight;

								om.updateSummary();
								om.updateStatus();
								found = true;
							}
						});

						if (found) {
							mg.updateSummary();
							return;
						}
					});
				});
			};
		});
	}

	onOrderAction(orderId: string, action: string) {
		var model = { orderId: orderId, action: action };
		this.service.PostUpdateOrderStatus(JSON.stringify(model), json => {
			if (json) {
				var id = json.orderId;
				var orderState = json.orderState;
				var paymentState = json.paymentState;

				this.data.forEach(yg => {
					yg.monthGroups.forEach(mg => {
						mg.models.forEach(om => {
							if (om.id == id) {
								om.paymentState = paymentState;
								om.orderState = orderState;
								om.updateStatus();

								return;
							}
						});
					});
				});
			};
		});
	}

	map(json: any, that: OrdersComponent, initial: boolean) {
		var yearGroups = [].ToList<YearGroup>();
		var orderCount = 0;
		that.data = [];

		json.forEach(c => {
			var monthGroups = [].ToList<MonthGroup>();
			c.monthGroups.forEach(mg => {
				var orders = [].ToList<OrderModel>();
				mg.models.forEach(om => {
					var customers = [].ToList<CustomerOrder>();
					om.customerOrders.forEach(co => {
						var products = [].ToList<OrderProduct>();
						co.orderProducts.forEach(op => {
							products.Add(new OrderProduct(op.productId, op.productBrand, op.productName, op.cost,
								op.price, op.qty, that.currentRate));
						});

						customers.Add(new CustomerOrder(co.customerId, co.customerName, products.ToArray()));
					});

					orders.Add(new OrderModel(om.id, moment(om.orderTime).format('YYYY-MM-DD'), om.deliveryTime, om.receiveTime,
						om.orderState, om.paymentState, om.waybillNumber, om.weight, om.freight, om.recipient, om.phone, om.address,
						om.sender, om.senderPhone, that.currentRate, that.orderStates, customers.ToArray()));
					orderCount += 1;
				});

				
				monthGroups.Add(new MonthGroup(mg.month, orders.ToArray()));
			});

			yearGroups.Add(new YearGroup(c.year, monthGroups.ToArray()));
			that.data = yearGroups.ToArray();
		});

		if (initial)
			that.totalAmount = orderCount;

		that.amount = orderCount;
	}

	get diagnoise() { return JSON.stringify(this.filterText + this.orderState + this.paymentState); }
}