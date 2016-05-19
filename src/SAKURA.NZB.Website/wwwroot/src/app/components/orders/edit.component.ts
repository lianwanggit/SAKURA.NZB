/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit, ViewEncapsulation} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Http, Headers} from 'angular2/http';
import {Router, RouteParams, ROUTER_DIRECTIVES, RouteData} from 'angular2/router';

import {ORDERS_ENDPOINT} from "../api.service";

import {Dict, OrderModel, CustomerOrder, OrderProduct, map} from "./models";
import {SelectValidator, ValidationResult} from "../../validators/selectValidator";
import {OrderCustomersComponent} from "./orderCustomers.component";
import {OrderProductsComponent} from "./orderProducts.component";
import {OrderQuoteComponent} from "./orderQuote.component";
import {OrderInvoiceComponent} from "./orderInvoice.component";
import {OrderSummaryComponent} from "./orderSummary.component";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

@Component({
    selector: "order-edit",
    templateUrl: "./src/app/components/orders/edit.html",
	styleUrls: ["./src/app/components/orders/edit.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES,
		OrderCustomersComponent, OrderProductsComponent, OrderQuoteComponent, OrderInvoiceComponent, OrderSummaryComponent],
	encapsulation: ViewEncapsulation.None
})

export class OrderEditComponent implements OnInit {
	private editMode = false;
	private viewMode = false;
	private _headers: Headers = new Headers();

	orderId: string;
	order: OrderModel;

	orderStates = (new Dict()).orderStates;
	paymentStates = (new Dict()).paymentStates;

	constructor(private http: Http, private router: Router, params: RouteParams, data: RouteData) {
		this.orderId = params.get("id");
		this.viewMode = data.get("readonly") == true;

		if (this.orderId) {
			this.editMode = true;
		}

		this.order = new OrderModel(0, null, null, null, "Created", "Unpaid", null, null, null, null,
			null, null, null, this.orderStates, []);
		this._headers.append('Content-Type', 'application/json');
	}

	ngOnInit() {
		this.loadData();
	}

	onSave() {
		var data = map(this.order);
		if (!this.editMode) {
			this.http
				.post(ORDERS_ENDPOINT, JSON.stringify(data, this.emptyStringToNull), { headers: this._headers })
				.subscribe(
				json => {
					if (!json) return;

					this.router.navigate(['订单']);
				},
				error => console.error(error));
		}
		else {
			this.http
				.put(ORDERS_ENDPOINT + this.orderId, JSON.stringify(data, this.emptyStringToNull), { headers: this._headers })
				.subscribe(
				json => {
					if (!json) return;

					this.router.navigate(['订单']);
				},
				error => console.error(error));
		}
	}

	onDelete() {
		this.http
			.delete(ORDERS_ENDPOINT + this.orderId)
			.subscribe(
			json => {
				if (!json) return;

				this.router.navigate(['订单']);
			},
			error => console.error(error));
	}

	loadData() {
		var that = this;

		if (this.editMode) {
			this.http
				.get(ORDERS_ENDPOINT + this.orderId)
				.map(res => res.status === 404 ? null : res.json())
				.subscribe(
					json => {
						if (!json) return;

						that.order.id = json.id;
						that.order.orderTime = json.orderTime;
						that.order.deliveryTime = json.deliveryTime;
						that.order.receiveTime = json.receiveTime;
						that.order.orderState = json.orderState;
						that.order.paymentState = json.paymentState;
						that.order.waybillNumber = json.waybillNumber;
						that.order.weight = json.weight;
						that.order.freight = json.freight;
						that.order.recipient = json.recipient;
						that.order.phone = json.phone;
						that.order.address = json.address;

						json.customerOrders.forEach(co => {
							var c = new CustomerOrder(co.customerId, co.customerName, []);
							co.orderProducts.forEach(op => {
								var p = new OrderProduct(op.productId, op.productBrand, op.productName,
									op.cost, op.price, op.qty, op.purchased);

								p.calculateProfit();
								c.orderProducts.push(p);
							});

							c.updateSummary();
							that.order.customerOrders.push(c);
						});

						that.order.updateSummary();
						that.order.updateStatus();
						that.order.updateExpressText();
					},
					error => console.error(error));
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