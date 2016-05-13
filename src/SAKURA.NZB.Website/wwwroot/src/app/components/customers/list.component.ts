/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Http} from 'angular2/http';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {CUSTOMERS_ENDPOINT} from "../api.service";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

export class Customer {
	id: number;
	name: string;
	pinyin: string;
	tel: string;
	address: string;
	index: string;
	selected = false;

	constructor(obj) {
		this.id = obj.id;
		this.name = obj.fullName;
		this.pinyin = obj.namePinYin;
		this.tel = obj.phone1;
		this.address = obj.address;
		this.index = this.pinyin ? this.pinyin.charAt(0).toUpperCase() : 'A';
	}
}

@Component({
    selector: "customers",
    templateUrl: "./src/app/components/customers/list.html",
	styleUrls: ["./src/app/components/customers/customers.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class CustomersComponent implements OnInit {
	icons = ['ambulance', 'car', 'bicycle', 'bus', 'taxi', 'fighter-jet', 'motorcycle', 'plane', 'rocket', 'ship', 'space-shuttle', 'subway', 'taxi', 'train', 'truck'];
    customerList: Customer[] = [];
	searchList: Customer[] = [];
	filterText = '';
	totalAmount = 0;
	isListViewMode = true;

	isLoading = true;
	private _filterText = '';

    constructor(private http: Http, private router: Router) { }

    ngOnInit() {
        this.get();
    }

    get() {
		var that = this;

		this.http.get(CUSTOMERS_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isLoading = false;
				if (!json) return;

				json.forEach(c => {
					that.customerList.push(new Customer(c));
				});

				that.totalAmount = that.customerList.length;
				that.searchList = that.customerList.ToList<Customer>()
					.OrderBy(x => x.pinyin.toUpperCase())
					.ToArray();;
			},
			error => {
				this.isLoading = false;
				console.log(error);
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

	onClickListItem(id: number) {
		this.customerList.forEach(x => {
			if (x.id == id) {
				x.selected = true;
				return;
			}

			x.selected = false;
		});
	}

	onEdit(cid: number) {
		this.customerList.forEach(x => {
			if (x.id == cid && (!this.isListViewMode || x.selected)) {
				this.router.navigate(['CEdit', {id: cid }]);
				return;
			}
		});
	}


	startsWith(str: string, searchString: string) {
		return str.substr(0, searchString.length) === searchString;
	};

	get amount() { return this.searchList.length; }
}