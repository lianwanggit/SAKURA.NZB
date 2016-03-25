﻿/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {ROUTER_DIRECTIVES} from 'angular2/router';
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
    selector: "customers",
    templateUrl: "./src/app/components/customers/list.html",
	styleUrls: ["./css/customers.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class CustomersComponent implements OnInit {
	icons = ['ambulance', 'car', 'bicycle', 'bus', 'taxi', 'fighter-jet', 'motorcycle', 'plane', 'rocket', 'ship', 'space-shuttle', 'subway', 'taxi', 'train', 'truck'];
    customerList: Customer[] = [];
	searchList: Customer[] = [];
	filterText = '';
	totalAmount = 0;
	isListViewMode = true;
	
	private _filterText = '';

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

				that.totalAmount = that.customerList.length;
				that.searchList = that.customerList.ToList<Customer>()
					.OrderBy(x => x.pinyin)
					.ToArray();;
            }
        });
    }

	onClearFilter() {
		this.onSearch('');
	}

	onSearch(value: string) {
		// Sync value for the special cases, for example,
		// select value from the historical inputs dropdown list
		if (this.filterText !== value)
			this.filterText = value;

		// Avoid multiple submissions
		if (this.filterText === this._filterText)
			return;

		this.searchList = [];
		if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
			this.searchList = this.customerList.ToList<Customer>()
				.Where(x => this.startsWith(x.name, this.filterText) ||
					this.startsWith(x.pinyin.toLowerCase(), this.filterText.toLowerCase()) ||
					this.startsWith(x.tel, this.filterText))
				.OrderBy(x => x.pinyin)
				.ToArray();
		}

		this._filterText = this.filterText;
	}

	onSwitchViewMode(list: boolean) {
		this.isListViewMode = list;
	}

	startsWith(str:string, searchString:string) {
		return str.substr(0, searchString.length) === searchString;
	};

	get amount() { return this.searchList.length; }
}