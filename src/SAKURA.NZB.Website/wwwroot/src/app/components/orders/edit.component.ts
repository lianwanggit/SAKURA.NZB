/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

import {ApiService} from "../api.service";

import {Dict, OrderModel, CustomerOrder, OrderProduct, map} from "./models";
import {SelectValidator, ValidationResult} from "../../validators/selectValidator";
import {OrderCustomersComponent} from "./orderCustomers.component";
import {OrderProductsComponent} from "./orderProducts.component";
import {OrderInvoiceComponent} from "./orderInvoice.component";
import {OrderSummaryComponent} from "./orderSummary.component";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

@Component({
    selector: "order-edit",
    templateUrl: "./src/app/components/orders/edit.html",
	styleUrls: ["./src/app/components/orders/orders.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES,
		OrderCustomersComponent, OrderProductsComponent, OrderInvoiceComponent, OrderSummaryComponent]
})

export class OrderEditComponent implements OnInit {
	private editMode = false;
	orderId: string;
	order: OrderModel;

	orderStates = (new Dict()).orderStates;
	paymentStates = (new Dict()).paymentStates;

	fixedRateHigh: number;
	fixedRateLow: number;
	currentRate: number;

	constructor(private service: ApiService, private router: Router, params: RouteParams) {
		this.orderId = params.get("id");
		if (this.orderId) {
			this.editMode = true;
		}

		this.order = new OrderModel(0, null, null, null, "Created", "Unpaid", null, null, null, null,
			null, null, null, null, null, this.orderStates, []);
	}

	ngOnInit() {
		var that = this;

		if (!this.editMode) {
			this.service.getSenderInfo(json => {
				if (json) {
					that.order.sender = json.sender;
					that.order.senderPhone = json.senderPhone;
				}
			});

			this.service.getLatestExchangeRates(json => {
				if (json) {
					that.fixedRateHigh = json.fixedRateHigh;
					that.fixedRateLow = json.fixedRateLow;
					that.currentRate = json.currentRate.toFixed(2);

					that.order.exchangeRate = that.currentRate;
				}
			});
		}
	}

	onSave() {
		var data = map(this.order);
		if (!this.editMode) {
			this.service.postOrder(JSON.stringify(data, this.emptyStringToNull))
				.subscribe(response => {
					this.router.navigate(['订单']);
				});
		}
	}

	emptyStringToNull(key: string, value: string) {
		return value === "" ? null : value;
	}

	get title() { return this.editMode ? "编辑订单 " : "新建订单"; }
	get customerCount() { return this.order.customerOrders.length; }
	get productCount() {
		return this.order.customerOrders.ToList<CustomerOrder>()
			.Sum(co => co.orderProducts.ToList<OrderProduct>().Sum(op => op.qty));
	}

}