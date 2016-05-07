/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
import {OrderModel, CustomerOrder, OrderProduct, ExpressTrack, ExpressTrackRecord, Dict, formatCurrency} from "./models";
import {ClipboardDirective} from '../../directives/clipboard.directive';
import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

declare var moment: any;

declare var $: any;

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

		var tp = list.Sum(om => om.totalProfit);
		this.totalProfit = formatCurrency(tp, tp.toFixed(2));
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
	expressTrackInfo: ExpressTrack = null;

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
	freightRate: number;


	private _filterText = '';
	colorSheet = ['bg-red', 'bg-pink', 'bg-purple', 'bg-deeppurple', 'bg-indigo', 'bg-blue', 'bg-teal', 'bg-green', 'bg-orange', 'bg-deeporange', 'bg-brown', 'bg-bluegrey'];

    constructor(private service: ApiService, private router: Router) {
		this.deliveryModel = new OrderDeliveryModel(null, '', null, null);
		this.expressTrackInfo = new ExpressTrack(null, null, null, null, null, null, null, []);

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
				that.freightRate = json.freightRate;

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

	onDeliverOpen(orderId: number) {
		this.deliveryModel = new OrderDeliveryModel(orderId, '100001', null, null);

		(<any>this.deliveryForm.controls['waybillNumber']).updateValue(this.deliveryModel.waybillNumber);
		(<any>this.deliveryForm.controls['weight']).updateValue(this.deliveryModel.weight);
		(<any>this.deliveryForm.controls['freight']).updateValue(this.deliveryModel.freight);

		$('#myModal').modal('show');
	}

	onInputWeight(weight: number) {
		(<any>this.deliveryForm.controls['freight']).updateValue((weight * this.freightRate).toFixed(2));
	}

	onDeliverySubmit() {
		$('#myModal').modal('hide');

		this.deliveryModel.waybillNumber = this.deliveryForm.value.waybillNumber;
		this.deliveryModel.weight = this.deliveryForm.value.weight;
		this.deliveryModel.freight = this.deliveryForm.value.freight;

		this.service.postDeliverOrder(JSON.stringify(this.deliveryModel), json => {
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
		this.service.postUpdateOrderStatus(JSON.stringify(model), json => {
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

	onOpenExpressTrack(waybillNumber) {
		var that = this;

		this.expressTrackInfo = new ExpressTrack(null, null, null, null, null, null, null, []);
		this.service.getExpressTrack(waybillNumber, json => {
			if (json) {
				that.expressTrackInfo.waybillNumber = json.waybillNumber;
				that.expressTrackInfo.from = json.from;
				that.expressTrackInfo.destination = json.destination;
				that.expressTrackInfo.itemCount = json.itemCount;
				that.expressTrackInfo.status = json.status;

				if (json.arrivedTime)
					that.expressTrackInfo.arrivedTime = json.arrivedTime;
				that.expressTrackInfo.recipient = json.recipient;

				json.details.forEach(d => {
					that.expressTrackInfo.details.push(new ExpressTrackRecord(moment(d.when).format('YYYY-MM-DD HH:mm'), d.where, d.content));
				});

				$('#expressTrackModal').modal('show');
			}
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
								op.price, op.qty, op.purchased, that.currentRate));
						});

						customers.Add(new CustomerOrder(co.customerId, co.customerName, products.ToArray()));
					});

					orders.Add(new OrderModel(om.id, moment(om.orderTime).format('DD/MM/YYYY'), om.deliveryTime, om.receiveTime,
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
}