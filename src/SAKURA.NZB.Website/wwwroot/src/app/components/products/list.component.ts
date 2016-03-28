/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
import {Category, Brand, Supplier, Product, BaseType} from "./models";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';



@Component({
    selector: "products",
    templateUrl: "./src/app/components/products/list.html",
	styleUrls: ["./css/products.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class ProductsComponent implements OnInit {
    productList: Product[] = [];
	searchList: Product[] = [];
	filterText = '';
	totalAmount = 0;

	categoryAmount = 0;
	brandAmount = 0;
	supplierAmount = 0;

	private _filterText = '';

    constructor(private service: ApiService, private router: Router) { }

    ngOnInit() {
        this.get();
    }

    get() {
		var that = this;

        this.service.getProducts(json => {
            if (json) {
                json.forEach(c => {
					that.productList.push(new Product(c));
				});

				that.totalAmount = that.productList.length;
				that.searchList = that.productList.ToList<Product>()
					.ToArray();;
            }
        });

		this.service.getCategories(json => {
			if (json)
				that.categoryAmount = json.length;
		});
		this.service.getBrands(json => {
			if (json)
				that.brandAmount = json.length;
		});
		this.service.getSuppliers(json => {
			if (json)
				that.supplierAmount = json.length;
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
			this.searchList = this.productList.ToList<Product>()
				.Where(x => this.startsWith(x.name, this.filterText) ||
					this.startsWith(x.brand.name.toLowerCase(), this.filterText.toLowerCase()))
				.ToArray();
		}

		this._filterText = this.filterText;
	}

	onClickListItem(id: number) {
		this.productList.forEach(x => {
			x.selected = x.id == id;
		});
	}

	onEdit(cid: number) {
		this.productList.forEach(x => {
			if (x.id == cid && x.selected) {
				//this.router.navigate(['CEdit', { id: cid }]);
				return;
			}
		});
	}


	startsWith(str: string, searchString: string) {
		return str.substr(0, searchString.length) === searchString;
	};

	get amount() { return this.searchList.length; }
	get data() { return JSON.stringify(this.searchList); }
}