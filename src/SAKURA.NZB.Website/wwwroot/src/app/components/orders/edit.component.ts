/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';

import {ApiService} from "../api.service";

import {Dict, OrderModel, CustomerOrder, OrderProduct} from "./list.component";
import {SelectValidator, ValidationResult} from "../../validators/selectValidator";
import {CustomerInfo, CustomerKvp, OrderCustomersComponent} from "./orderCustomers.component";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';


@Component({
    selector: "order-edit",
    templateUrl: "./src/app/components/orders/edit.html",
	styleUrls: ["./src/app/components/orders/orders.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, OrderCustomersComponent]
})
export class OrderEditComponent implements OnInit {
	private editMode = false;
	orderId: string;
	order: OrderModel;

	orderStates = (new Dict()).orderStates;
	paymentStates = (new Dict()).paymentStates;

	customerOrders: CustomerOrder[] = [];
	customerInfo: CustomerInfo; 

	constructor(private service: ApiService, private router: Router, params: RouteParams) {
		this.orderId = params.get("id");
		if (this.orderId) {
			this.editMode = true;
		}

		this.order = new OrderModel(null, null, null, null, "Created", "Unpaid", null, null, null, null,
			null, null, null, null, null, this.orderStates, this.customerOrders);
		this.customerInfo = new CustomerInfo(null, null, null);
	}

	ngOnInit() {
		var that = this;
	}

	get title() { return this.editMode ? "编辑订单 " : "新建订单"; }
	get customerCount() { return this.customerInfo.customers.length; }
}