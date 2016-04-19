import {Component, OnInit, EventEmitter, Input} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";

import {ApiService} from "../api.service";
import {AlphaIndexerDirective, Element} from "../../directives/alphaIndexer.directive";
import {CustomerOrder, OrderProduct, OrderModel} from "./list.component";
import {Customer} from "../customers/edit.component";

import {TYPEAHEAD_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";

export class CustomerKvp{
	constructor(public id: number, public name: string) { }
}

@Component({
    selector: "order-customer",
    templateUrl: "./src/app/components/orders/orderCustomers.html",
	styleUrls: ["./src/app/components/orders/orderCustomers.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, AlphaIndexerDirective, TYPEAHEAD_DIRECTIVES]
})

export class OrderCustomersComponent implements OnInit {
	elementSource: Element[];
	selectedCustomer: Customer = null;

	selectedExCustomerName = '';
	allCustomers: CustomerKvp[] = [];
	recipientGroup: ControlGroup;

	@Input() orderModel: OrderModel;

	constructor(private service: ApiService) {
		this.recipientGroup = new ControlGroup({
			recipient: new Control(null, Validators.required),
			phone: new Control(null, Validators.required),
			address: new Control(null, Validators.required)
		});
	}

	ngOnInit() {
		this.getCustomers();
	}

	onElementSelected(id: string) {
		this.getCustomer(id);
	}

	onSelectPhone(phone: string) {
		this.orderModel.phone = phone;
		(<any>this.recipientGroup.controls['phone']).updateValue(phone);
		this.onModelChanged(phone);
	}

	onSelectAddress(address: string) {
		this.orderModel.address = address;
		(<any>this.recipientGroup.controls['address']).updateValue(address);
		this.onModelChanged(address)
	}

	onSelectExCustomer(e: any) {
		setTimeout(_ => this.selectedExCustomerName = '', 300);

		if (e.item.id == this.selectedCustomer.id)
			return;

		var co = new CustomerOrder(e.item.id, e.item.name, []);
		this.orderModel.customerOrders.push(co);
	}

	onRemoveExCustomer(id: string) {
		for (var i = this.orderModel.customerOrders.length; i--;) {
			if (this.orderModel.customerOrders[i].customerId.toString() == id) {
				this.orderModel.customerOrders.splice(i, 1);
				return;
			} 
		}
	}

	onModelChanged(newValue: any, updateRecipient = false) {
		if (updateRecipient) {
			this.orderModel.recipient = this.recipientGroup.value.recipient;
			this.orderModel.phone = this.recipientGroup.value.phone;
			this.orderModel.address = this.recipientGroup.value.address;
		}

		this.orderModel.updateExpressText();
	}

	getCustomer(id: string) {
		var that = this;

        this.service.getCustomer(id, json => {
            if (json) {
                that.selectedCustomer = new Customer(json);

				(<any>that.recipientGroup.controls['recipient']).updateValue(that.selectedCustomer.fullName);
				(<any>that.recipientGroup.controls['phone']).updateValue(that.selectedCustomer.phone1);
				(<any>that.recipientGroup.controls['address']).updateValue(that.selectedCustomer.address);
				
				var co = new CustomerOrder(that.selectedCustomer.id, that.selectedCustomer.fullName, []);
				that.orderModel.customerOrders = [];
				that.orderModel.customerOrders.push(co);
				that.onModelChanged(co, true);
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

					var kvp = new CustomerKvp(c.id, c.fullName);
					that.allCustomers.push(kvp);
				});

				that.elementSource = list.ToArray();
			}
		});
	}

	get exCustomers() { return this.orderModel.customerOrders.length == 0 ? [] : this.orderModel.customerOrders.slice(1); }
}