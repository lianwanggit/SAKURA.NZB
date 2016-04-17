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
	recipientGroup: ControlGroup;

	@Input() customerInfo: CustomerInfo;
	@Output() modelChange = new EventEmitter();

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
		this.customerInfo.phone = phone;
		this.onModelChanged(phone);
	}

	onSelectAddress(address: string) {
		this.customerInfo.address = address;
		this.onModelChanged(address)
	}

	onSelectExCustomer(e: any) {
		setTimeout(_ => this.selectedExCustomerName = '', 300);

		if (e.item.id == this.selectedCustomer.id)
			return;

		this.customerInfo.customers.push(e.item);
		this.onModelChanged(e.item);
	}

	onRemoveExCustomer(id: string) {
		for (var i = this.customerInfo.customers.length; i--;) {
			if (this.customerInfo.customers[i].id.toString() == id) {
				this.customerInfo.customers.splice(i, 1);
				this.onModelChanged(id);
				return;
			} 
		}
	}

	onModelChanged(newValue: any, updateRecipient = false) {
		if (updateRecipient) {
			this.customerInfo.recipient = this.recipientGroup.value.recipient;
			this.customerInfo.phone = this.recipientGroup.value.phone;
			this.customerInfo.address = this.recipientGroup.value.address;
		}
		
		this.modelChange.emit(newValue);
	}

	getCustomer(id: string) {
		var that = this;

        this.service.getCustomer(id, json => {
            if (json) {
                that.selectedCustomer = new Customer(json);

				(<any>that.recipientGroup.controls['recipient']).updateValue(that.selectedCustomer.fullName);
				(<any>that.recipientGroup.controls['phone']).updateValue(that.selectedCustomer.phone1);
				(<any>that.recipientGroup.controls['address']).updateValue(that.selectedCustomer.address);

				var kvp = new CustomerKvp(that.selectedCustomer.id, that.selectedCustomer.fullName);
				that.customerInfo.customers = [];
				that.customerInfo.customers.push(kvp);
				that.onModelChanged(that.customerInfo, true);
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