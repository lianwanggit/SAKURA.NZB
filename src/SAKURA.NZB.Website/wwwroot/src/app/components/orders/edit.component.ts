/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
import {AlphaIndexerDirective, Element} from "../../directives/alphaIndexer.directive";
import {Customer} from "../customers/edit.component";
import {SelectValidator, ValidationResult} from "../../validators/selectValidator";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

@Component({
    selector: "product-edit",
    templateUrl: "./src/app/components/orders/edit.html",
	styleUrls: ["./src/app/components/orders/orders.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, AlphaIndexerDirective]
})
export class OrderEditComponent implements OnInit {
	private editMode = false;
	orderId: string;

	elementSource: Element[];
	selectedCustomer: Customer = new Customer({
		"id": 0, "fullName": null, "namePinYin": null, "phone1": null, "phone2": null,
		"address": null, "address1": null, "email": null, "isIdentityUploaded": false, "level": null, "description": null
	});

	constructor(private service: ApiService, private router: Router, params: RouteParams) {
		this.orderId = params.get("id");
		if (this.orderId) {
			this.editMode = true;
		}
	}

	ngOnInit() {
		var that = this;
		this.getCustomers();
	}

	onElementSelected(id: string) {
		this.getCustomer(id);
	}

	getCustomer(id: string) {
		var that = this;

        this.service.getCustomer(id, json => {
            if (json) {
                that.selectedCustomer = new Customer(json);
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
				});

				that.elementSource = list.ToArray();
			}
		});
	}

	get title() { return this.editMode ? "编辑订单 " : "新建订单"; }
}