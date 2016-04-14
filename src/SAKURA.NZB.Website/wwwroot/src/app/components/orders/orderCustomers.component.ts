import {Component, OnInit, EventEmitter, Input, Output} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";

import {ApiService} from "../api.service";
import {AlphaIndexerDirective, Element} from "../../directives/alphaIndexer.directive";
import {Customer} from "../customers/edit.component";

import {TYPEAHEAD_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";

export class CustomerKvp{
	constructor(public id: number, public name: string) { }
}

export class CustomerInfo {
	customers: CustomerKvp[] = [];
	constructor(public recipient: string, public phone: string, public address: string) { }

	get exCustomers() { return this.customers.length == 0 ? [] : this.customers.slice(1); }
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

	@Input() customerInfo: CustomerInfo;
	@Output() modelChange = new EventEmitter();

	constructor(private service: ApiService) { }

	ngOnInit() {
		var that = this;
		this.getCustomers();
	}

	onElementSelected(id: string) {
		this.getCustomer(id);
	}

	onSelectPhone(phone: string) {
		this.customerInfo.phone = phone;
	}

	onSelectAddress(address: string) {
		this.customerInfo.address = address;
	}

	onSelectExCustomer(e: any) {
		setTimeout(_ => this.selectedExCustomerName = '', 300);

		if (e.item.id == this.selectedCustomer.id)
			return;

		this.customerInfo.customers.push(e.item);
	}

	onRemoveExCustomer(id: string) {
		for (var i = this.customerInfo.customers.length - 1; i--;) {
			if (this.customerInfo.customers[i].id.toString() == id) {
				this.customerInfo.customers.splice(i, 1);
				return;
			} 
		}
	}

	getCustomer(id: string) {
		var that = this;

        this.service.getCustomer(id, json => {
            if (json) {
                that.selectedCustomer = new Customer(json);
				that.customerInfo.recipient = that.selectedCustomer.fullName;
				that.customerInfo.phone = that.selectedCustomer.phone1;
				that.customerInfo.address = that.selectedCustomer.address;

				var kvp = new CustomerKvp(that.selectedCustomer.id, that.selectedCustomer.fullName);
				this.customerInfo.customers = [];
				that.customerInfo.customers.push(kvp);
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
}