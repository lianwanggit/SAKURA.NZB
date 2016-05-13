/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Http, Headers} from 'angular2/http';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {CUSTOMERS_ENDPOINT} from "../api.service";
import {AlphaIndexerDirective, Element} from "../../directives/alphaIndexer.directive";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

export class Customer {
	id: number;
	fullName: string;
	namePinYin: string;
	phone1: string;
	phone2: string;
	address: string;
	address1: string;
	email: string;
	isIdentityUploaded: boolean;
	level: number;
	description: string;

	constructor(obj) {
		this.id = obj.id;
		this.fullName = obj.fullName;
		this.namePinYin = obj.namePinYin;
		this.phone1 = obj.phone1;
		this.phone2 = obj.phone2;
		this.address = obj.address;
		this.address1 = obj.address1;
		this.email = obj.email;
		this.isIdentityUploaded = obj.isIdentityUploaded;
		this.level = obj.level;
		this.description = obj.description;
	}
}

@Component({
    selector: "customer-edit",
    templateUrl: "./src/app/components/customers/edit.html",
	styleUrls: ["./src/app/components/customers/customers.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, AlphaIndexerDirective]
})
export class CustomerEditComponent implements OnInit {
    elementSource: Element[];

	model: Customer = new Customer({
		"id": 0, "fullName": null, "namePinYin": null, "phone1": null, "phone2": null,
		"address": null, "address1": null, "email": null, "isIdentityUploaded": false, "level": null, "description": null
	});

	editMode = false;
	isCustomerLoading = true;
	isListLoading = true;
	private customerId: string;

    constructor(private http: Http, private router: Router, params: RouteParams) {
		this.customerId = params.get("id");
		if (this.customerId) {
			this.editMode = true;
		} else {
			this.isCustomerLoading = false;
			this.isListLoading = false;
		}
	}

    ngOnInit() {
		if (this.editMode) {
			this.getCustomer(this.customerId);
			this.getCustomers();
		}
    }

	getCustomer(id: string) {
		var that = this;

		this.http.get(CUSTOMERS_ENDPOINT + id)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isCustomerLoading = false;
				if (!json) return;

				that.model = new Customer(json);
			},
			error => {
				this.isCustomerLoading = false;
				console.log(error);
			});
	}

	getCustomers() {
		var that = this;

		this.http.get(CUSTOMERS_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isListLoading = false;
				if (!json) return;

				var list = [].ToList<Element>();
				json.forEach(x => {
					var c = new Customer(x);
					list.Add(new Element(c.id, c.fullName, c.namePinYin));
				});

				that.elementSource = list.ToArray();
			},
			error => {
				this.isListLoading = false;
				console.log(error);
			});
	}

	onElementSelected(id: string) {
		this.getCustomer(id);
	}

	onSubmit() {
		var that = this;
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		if (!this.editMode)
			this.http
				.post(CUSTOMERS_ENDPOINT, JSON.stringify(this.model, this.emptyStringToNull), { headers: headers })
				.subscribe(
					response => this.router.navigate(['客户']),
					error => console.error(error));
		else
			this.http.put(CUSTOMERS_ENDPOINT + this.customerId, JSON.stringify(this.model, this.emptyStringToNull), { headers: headers })
				.subscribe(
					response => this.router.navigate(['客户']),
					error => console.error(error));
	}

	emptyStringToNull(key: string, value: string) {
		return value === "" ? null : value;
	}

	get data() { return JSON.stringify(this.model); }
	get title() { return (this.model && this.editMode) ? "编辑用户 - " + this.model.fullName : "新建用户"; }
	get isLoading() { return this.isCustomerLoading || this.isListLoading; }
}