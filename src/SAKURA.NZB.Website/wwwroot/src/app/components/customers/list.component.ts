/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {ApiService} from "../api.service";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

export class Customer {
	id: number;
	name: string;
	pinyin: string;
	tel: string;
	address: string;

	constructor(obj) {
		this.id = obj.Id;
		this.name = obj.FullName;
		this.pinyin = obj.NamePinYin;
		this.tel = obj.Phone1;
		this.address = obj.Address;
	}
}


@Component({
    selector: "customers",
    templateUrl: "/src/app/components/customers/list.html",
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class CustomersComponent implements OnInit {
	icons = ['ambulance', 'car', 'bicycle', 'bus', 'taxi', 'fighter-jet', 'motorcycle', 'plane', 'rocket', 'ship', 'space-shuttle', 'subway', 'taxi', 'train', 'truck'];
    customerList: Customer[] = [];

    constructor(private service: ApiService) { }

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