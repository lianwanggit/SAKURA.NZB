/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
import {AlphaIndexerDirective, Element} from "../../directives/alphaIndexer.directive";
import {Customer} from "../customers/edit.component";
import {Dict, OrderModel, CustomerOrder, OrderProduct} from "./list.component";
import {SelectValidator, ValidationResult} from "../../validators/selectValidator";
import {TYPEAHEAD_DIRECTIVES} from 'ng2-bootstrap/ng2-bootstrap';
import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

class ExCustomer {
	constructor(public id: number, public name: string) { }
}

@Component({
    selector: "product-edit",
    templateUrl: "./src/app/components/orders/edit.html",
	styleUrls: ["./src/app/components/orders/orders.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, AlphaIndexerDirective, TYPEAHEAD_DIRECTIVES]
})
export class OrderEditComponent implements OnInit {
	private editMode = false;
	orderId: string;
	order: OrderModel;

	orderStates = (new Dict()).orderStates;
	paymentStates = (new Dict()).paymentStates;

	customerOrders: CustomerOrder[] = [];
	exCustomers: ExCustomer[] = [];
	allCustomers: Array<any> = [];

	elementSource: Element[];
	selectedCustomer: Customer = null;

	public selectedExCustomerName: string = '';
	selectedExCustomer: ExCustomer = null;

	constructor(private service: ApiService, private router: Router, params: RouteParams) {
		this.orderId = params.get("id");
		if (this.orderId) {
			this.editMode = true;
		}

		this.order = new OrderModel(null, null, null, null, "Created", "Unpaid", null, null, null, null,
			null, null, null, null, null, this.orderStates, this.customerOrders);
	}

	ngOnInit() {
		var that = this;
		this.getCustomers();
	}

	onElementSelected(id: string) {
		this.getCustomer(id);
		this.exCustomers = [];
	}

	onSelectPhone(phone: string) {
		this.order.phone = phone;
	}

	onSelectAddress(address: string) {
		this.order.address = address;
	}

	onSelectExCustomer(e: any) {
		this.selectedExCustomer = e.item;
	}

	onAddExCustomer() {
		if (this.selectedExCustomer) {
			this.exCustomers.push(new ExCustomer(this.selectedExCustomer.id, this.selectedExCustomer.name));
			this.selectedExCustomerName = '';
			this.selectedExCustomer = null;
		}
	}

	getCustomer(id: string) {
		var that = this;

        this.service.getCustomer(id, json => {
            if (json) {
                that.selectedCustomer = new Customer(json);
				that.order.recipient = that.selectedCustomer.fullName;
				that.order.phone = that.selectedCustomer.phone1;
				that.order.address = that.selectedCustomer.address;
            }
        });
	}

	getCustomers() {
		var that = this;

		this.service.getCustomers(json => {
			if (json) {
				var list = [].ToList<Element>();
				json.forEach(x => {
					var c = new Customer(x);
					list.Add(new Element(c.id, c.fullName, c.namePinYin));

					that.allCustomers.push(new ExCustomer(c.id, c.fullName));
				});

				that.elementSource = list.ToArray();
			}
		});
	}

	get title() { return this.editMode ? "编辑订单 " : "新建订单"; }
}