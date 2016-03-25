/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {RouteParams} from 'angular2/router';
import {ApiService} from "../api.service";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

export class Customer {
	id: number;
	name: string;
	pinyin: string;
	tel: string;
	address: string;
	index: string;

	constructor(obj) {
		this.id = obj.Id;
		this.name = obj.FullName;
		this.pinyin = obj.NamePinYin;
		this.tel = obj.Phone1;
		this.address = obj.Address;
		this.index = this.pinyin ? this.pinyin.charAt(0).toUpperCase() : 'A';
	}
}

@Component({
    selector: "customer-edit",
    templateUrl: "./src/app/components/customers/edit.html",
	styleUrls: ["./css/customers.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class CustomerEditComponent implements OnInit {
    customerList: Customer[] = [];


	editMode = false;
	private customerId: string;

    constructor(private service: ApiService, params: RouteParams) {
		this.customerId = params.get("id");
		if (this.customerId) {
			this.editMode = true;			
		}
	}

    ngOnInit() {
        this.get();
    }

    get() {
		var that = this;

        this.service.getCustomers(json => {
            if (json) {
                json.forEach(c => {
					that.customerList.push(new Customer(c));
				});
            }
        });
    }


}