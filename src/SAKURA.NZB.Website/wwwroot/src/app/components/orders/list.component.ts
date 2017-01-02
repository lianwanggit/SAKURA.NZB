/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Http, Headers} from 'angular2/http';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {ORDERS_SEARCH_ENDPOINT, ORDER_DELIVER_ENDPOINT, ORDER_UPDATE_STATUS_ENDPOINT, EXPRESS_TRACK_ENDPOINT} from "../api.service";
import {OrderModel, MonthSale, CustomerOrder, OrderProduct, ExpressTrack, ExpressTrackRecord, Dict, formatCurrency} from "./models";
import {NumberValidator, PositiveNumberValidator, ValidationResult} from "../../validators/numberValidator";
import {ClipboardDirective} from '../../directives/clipboard.directive';

import { PAGINATION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

declare var moment: any;
declare var $: any;

class OrderDeliveryModel {
	constructor(public orderId: number, public waybillNumber: string, public weight: number, public freight: number) { }
}

class LatestExpressInfo {
	constructor(public waybillNumber: string, public expressInfo: string) { };
}

class LatestExpressInfoList {
	public expressInfo: LatestExpressInfo[];

	constructor() {
		this.expressInfo = [];
	}

	getInfo(waybillNumber: string) {
		var info = this.expressInfo.ToList<LatestExpressInfo>()
						.FirstOrDefault(x => x.waybillNumber == waybillNumber);

		return info == null ? '' : info.expressInfo;
	}
}

@Component({
    selector: "customers",
    templateUrl: "./src/app/components/orders/list.html",
	styleUrls: ["./src/app/components/orders/orders.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, ClipboardDirective, PAGINATION_DIRECTIVES]
})
export class OrdersComponent implements OnInit {
	orderList = [].ToList<OrderModel>();
	deliveryModel: OrderDeliveryModel = null;
	expressTrackInfo: ExpressTrack = null;
	latestExpressInfoList: LatestExpressInfoList = new LatestExpressInfoList();

	deliveryForm: ControlGroup;

	searchList: OrderModel[] = [];
	filterText = '';
	orderState = '';
	paymentState = '';
	orderStates = (new Dict()).orderStates;
	orderStateKeys: string[] = [];
	paymentStates = (new Dict()).paymentStates;
	paymentStateKeys: string[] = [];

	totalAmount = 0;
	thisYear = moment().year();
	freightRate: number = (<any>window).nzb.express.freightRate;

	page = 1;
	prevItems = [].ToList<OrderModel>();
	nextItems = [].ToList<OrderModel>();
	itemsPerPage = 0;
	totalItemCount = 0;

	isLoading = true;
	colorSheet = ['bg-red', 'bg-pink', 'bg-purple', 'bg-deeppurple', 'bg-indigo', 'bg-blue', 'bg-teal', 'bg-green', 'bg-orange', 'bg-deeporange', 'bg-brown', 'bg-bluegrey'];

	private _filterText = '';
	private _isPrevItemsLoaded = false;
	private _isNextItemsLoaded = false;
	private _headers: Headers = new Headers();

    constructor(private http: Http, private router: Router, private routeParams: RouteParams) {
		this.deliveryModel = new OrderDeliveryModel(null, '', null, null);
		this.expressTrackInfo = new ExpressTrack(null, null, null, null, null, null, null, []);

		this.deliveryForm = new ControlGroup({
			waybillNumber: new Control(this.deliveryModel.waybillNumber, Validators.required),
			weight: new Control(this.deliveryModel.weight, NumberValidator.unspecified),
			freight: new Control(this.deliveryModel.freight, NumberValidator.unspecified)
		});

		for (var key in this.orderStates) {
			this.orderStateKeys.push(key);
		}

		for (var key in this.paymentStates) {
			this.paymentStateKeys.push(key);
		}

		this._headers.append('Content-Type', 'application/json');

		var pState = routeParams.get("paymentstate");
		if (pState)
			this.paymentState = pState;

		var oState = routeParams.get("orderstate");
		if (oState)
			this.orderState = oState;
	}

    ngOnInit() {
        this.get();
    }

	get(loadSearchList = true) {
		this._isPrevItemsLoaded = false;
		this._isNextItemsLoaded = false;

		var that = this;
		var url = ORDERS_SEARCH_ENDPOINT + '?page=' + this.page;
		if (this.filterText)
			url += '&keyword=' + this.filterText;
		if (this.orderState)
			url += '&state=' + this.orderState;
		if (this.paymentState)
			url += '&payment=' + this.paymentState;

		this.http.get(url)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isLoading = false;
				if (!json) return;

				that.orderList = [].ToList<OrderModel>();
				that.prevItems = [].ToList<OrderModel>();
				that.nextItems = [].ToList<OrderModel>();

				if (json.items) {
					json.items.forEach(c => {
						that.orderList.Add(that.map(c));
					});
				}

				if (json.prevItems) {
					json.prevItems.forEach(c => {
						that.prevItems.Add(that.map(c));
					});
					that._isPrevItemsLoaded = true;
				}

				if (json.nextItems) {
					json.nextItems.forEach(c => {
						that.nextItems.Add(that.map(c));
					});
					that._isNextItemsLoaded = true;
				}

				that.itemsPerPage = json.itemsPerPage;
				that.totalItemCount = json.totalItemCount;

				if (!that.orderState && !that.paymentState)
					that.totalAmount = that.totalItemCount;

				if (loadSearchList)
					that.addToSearchList(that.orderList);

				this.loadLatestExpressInfo(that.orderList.Select(o => o.waybillNumber).ToArray());
			},
			error => {
				this.isLoading = false;
				console.log(error);
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

		if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
			this.page = 1;
			this.get();
		}

		this._filterText = this.filterText;
	}

	onSearchByState(state: string) {
		if (state !== this.orderState)
			this.orderState = state;

		this.page = 1;
		this.get();
	}

	onSearchByPayment(payment: string) {
		if (payment !== this.paymentState)
			this.paymentState = payment;

		this.page = 1;
		this.get();
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

		this.http
			.post(ORDER_DELIVER_ENDPOINT, JSON.stringify(this.deliveryModel), { headers: this._headers })
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(
				json => {
					if (!json) return;

					this.get();
				},
				error =>  console.error(error));
	}

	onOrderAction(orderId: string, action: string) {
		var model = { orderId: orderId, action: action };

		this.http
			.post(ORDER_UPDATE_STATUS_ENDPOINT, JSON.stringify(model), { headers: this._headers })
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(
			json => {
				if (!json) return;

				this.get();
			},
			error => console.error(error));
	}

	onOpenExpressTrack(waybillNumber) {
		var that = this;

		this.expressTrackInfo = new ExpressTrack(waybillNumber, null, null, null, null, null, null, []);
		this.http.get(EXPRESS_TRACK_ENDPOINT + waybillNumber)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isLoading = false;
				if (!json) return;

				that.expressTrackInfo.waybillNumber = json.waybillNumber;
				that.expressTrackInfo.from = json.from;
				that.expressTrackInfo.destination = json.destination;
				that.expressTrackInfo.itemCount = json.itemCount;
				that.expressTrackInfo.status = json.status;
				that.expressTrackInfo.isEmpty = false;

				if (json.arrivedTime)
					that.expressTrackInfo.arrivedTime = json.arrivedTime;
				that.expressTrackInfo.recipient = json.recipient;

				json.details.forEach(d => {
					that.expressTrackInfo.details.push(new ExpressTrackRecord(moment(d.when).format('YYYY-MM-DD HH:mm'), d.where, d.content));
				});
			},
			error => console.log(error));

		$('#expressTrackModal').modal('show');
	}

	onPageChanged(event: any): void {
		var loadSearchList = true;
		this.searchList = [];

		if (this.page - 1 == event.page && this._isPrevItemsLoaded) {
			this.addToSearchList(this.prevItems);
			loadSearchList = false;
		}
		if (this.page + 1 == event.page && this._isNextItemsLoaded) {
			this.addToSearchList(this.nextItems);
			loadSearchList = false;
		}

		this.page = event.page;
		this.get(loadSearchList);
	};

	map(json: any) {
		var monthSale = new MonthSale(json.monthSale.year, json.monthSale.month, json.monthSale.count, json.monthSale.cost, json.monthSale.income, json.monthSale.profit);

		var customers = [].ToList<CustomerOrder>();
		json.customerOrders.forEach(co => {
			var products = [].ToList<OrderProduct>();
			co.orderProducts.forEach(op => {
				products.Add(new OrderProduct(op.productId, op.productBrand, op.productName, op.cost,
					op.price, op.qty, op.purchased));
			})

			customers.Add(new CustomerOrder(co.customerId, co.customerName, products.ToArray()));
		});

		return new OrderModel(json.id, moment(json.orderTime).format('DD/MM/YYYY'), json.deliveryTime, json.receiveTime,
			json.orderState, json.paymentState, json.waybillNumber, json.weight, json.freight, json.recipient, json.phone, json.address,
			monthSale, this.orderStates, customers.ToArray());
	}

	addToSearchList(orders: List<OrderModel>) {
		var list = [].ToList<OrderModel>();
		var month = '';
		var that = this;

		orders.ForEach(o => {
			if (o.monthSale.month != month) {
				var monthSaleItem = new OrderModel(null, null, null, null, null, null, null, null, null, null, null, null, o.monthSale, null, [], true);

				list.Add(monthSaleItem);
				month = o.monthSale.month;
			}

			list.Add(o);
		});

		this.searchList = list.ToArray();
	}

	loadLatestExpressInfo(waybillNumbers: string[]) {
		var that = this;
		var data = { WaybillNumbers: waybillNumbers };

		this.http
			.post(EXPRESS_TRACK_ENDPOINT + 'batchwaybillNumbers', JSON.stringify(data), { headers: this._headers })
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(
			json => {
				if (!json) return;

				this.latestExpressInfoList.expressInfo.length = 0;
				json.expressInfoList.forEach(x => {
					this.latestExpressInfoList.expressInfo.push(new LatestExpressInfo(x.waybillNumber, x.expressInfo));
				});
			},
			error => console.error(error));
	}
}