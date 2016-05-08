import {Component, OnInit, AfterViewInit, Input} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";

import {ApiService} from "../api.service";
import {AlphaIndexerDirective, Element} from "../../directives/alphaIndexer.directive";
import {CustomerOrder, OrderProduct, OrderModel} from "./models";
import {Customer} from "../customers/edit.component";
import {NumberValidator, ValidationResult} from "../../validators/numberValidator";

import {TYPEAHEAD_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";

declare var moment: any;
declare var jQuery: any;

export class CustomerKvp {
	constructor(public id: number, public name: string) { }
}

@Component({
    selector: "order-customer",
    templateUrl: "./src/app/components/orders/orderCustomers.html",
	styleUrls: ["./src/app/components/orders/orderCustomers.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, AlphaIndexerDirective, TYPEAHEAD_DIRECTIVES]
})

export class OrderCustomersComponent implements OnInit, AfterViewInit {
	elementSource: Element[];
	selectedCustomer: Customer = null;

	selectedExCustomerName = '';
	allCustomers: CustomerKvp[] = [];
	recipientGroup: ControlGroup;
	expressGroup: ControlGroup;

	@Input() orderModel: OrderModel;
	@Input() viewMode: boolean;

	constructor(private service: ApiService) {
		var that = this;

		this.recipientGroup = new ControlGroup({
			recipient: new Control(null, Validators.required),
			phone: new Control(null, Validators.required),
			address: new Control(null, Validators.required)
		});

		this.recipientGroup.valueChanges.subscribe(data => {
			if (that.orderModel.isCustomersValid !== that.recipientGroup.valid)
				that.orderModel.isCustomersValid = that.recipientGroup.valid;
		});

		this.expressGroup = new ControlGroup({
			orderTime: new Control(null, Validators.required),
			waybill: new Control(null, Validators.required),
			weight: new Control(null, NumberValidator.unspecified),
			freight: new Control(null, NumberValidator.unspecified)
		});

		this.expressGroup.valueChanges.subscribe(data => {
			var valid = (that.orderModel.delivered) ? that.expressGroup.valid : that.isOrderDateValid;
			if (that.orderModel.isExpressValid !== valid)
				that.orderModel.isExpressValid = valid;
		});
	}

	ngOnInit() {
		this.getCustomers();
	}

	ngAfterViewInit() {
		this.initialiseDatePicker();
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

	onExpressModelChanged(newValue: any) {
		this.orderModel.waybillNumber = this.expressGroup.value.waybill;
		this.orderModel.weight = this.expressGroup.value.weight;
		this.orderModel.freight = this.expressGroup.value.freight;

		this.orderModel.updateSummary();
	}

	initialiseDatePicker() {
		var that = this;
		var today = moment().startOf('day');
		var lastYear = moment().add(-1, 'y').endOf('day');
		jQuery('#orderDate').datetimepicker({
			locale: 'en-nz',
			format: 'L',
			minDate: lastYear,
			maxDate: today,
			ignoreReadonly: true,
			allowInputToggle: true
		});
		jQuery('#orderDate').data("DateTimePicker").showTodayButton(true);
		jQuery('#orderDate').data("DateTimePicker").showClear(true);
		jQuery('#orderDate').data("DateTimePicker").showClose(true);
		jQuery('#orderDate').data("DateTimePicker").defaultDate(today);
		jQuery('#orderDate').on("dp.change", function (e) {
			if (!e.date) {
				(<any>that.expressGroup.controls['orderTime']).updateValue(null);
				that.orderModel.orderTime = null;
			} else {
				(<any>that.expressGroup.controls['orderTime']).updateValue(e.date.toDate());
				that.orderModel.orderTime = that.expressGroup.value.orderTime;
			}
		});

		if (this.viewMode) {
			jQuery('#orderDate').data("DateTimePicker").disable();
		}
	}

	getCustomer(id: string) {
		var that = this;

        this.service.getCustomer(id, json => {
            if (json) {
                that.selectedCustomer = new Customer(json);

				if (that.orderModel.id != 0 && that.orderModel.customerOrders.length
					&& that.orderModel.customerOrders[0].customerId.toString() == id) {
					(<any>that.recipientGroup.controls['recipient']).updateValue(that.orderModel.recipient);
					(<any>that.recipientGroup.controls['phone']).updateValue(that.orderModel.phone);
					(<any>that.recipientGroup.controls['address']).updateValue(that.orderModel.address);
				}
				else {
					(<any>that.recipientGroup.controls['recipient']).updateValue(that.selectedCustomer.fullName);
					(<any>that.recipientGroup.controls['phone']).updateValue(that.selectedCustomer.phone1);
					(<any>that.recipientGroup.controls['address']).updateValue(that.selectedCustomer.address);

					var co = new CustomerOrder(that.selectedCustomer.id, that.selectedCustomer.fullName, []);
					that.orderModel.customerOrders = [];
					that.orderModel.customerOrders.push(co);
					that.onModelChanged(co, true);
				}

				if (that.orderModel.orderTime) {
					jQuery('#orderDate').data("DateTimePicker").date(moment(that.orderModel.orderTime));
				} else {
					that.orderModel.orderTime = jQuery('#orderDate').data("DateTimePicker").date().toDate();
				}

				(<any>that.expressGroup.controls['orderTime']).updateValue(that.orderModel.orderTime);
				(<any>that.expressGroup.controls['waybill']).updateValue(that.orderModel.waybillNumber);
				(<any>that.expressGroup.controls['weight']).updateValue(that.orderModel.weight);
				(<any>that.expressGroup.controls['freight']).updateValue(that.orderModel.freight);
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

	get customerId() { return this.orderModel.customerOrders.length ? this.orderModel.customerOrders[0].customerId : ''; }
	get exCustomers() { return this.orderModel.customerOrders.length == 0 ? [] : this.orderModel.customerOrders.slice(1); }
	get isOrderDateValid() { return this.expressGroup.controls['orderTime'].valid; }
	get strOrderDate() { return moment(this.orderModel.orderTime).format('DD/MM/YYYY'); }
}