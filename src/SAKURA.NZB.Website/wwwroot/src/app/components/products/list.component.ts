/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Http} from 'angular2/http';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {PRODUCTS_ENDPOINT, CATEGORIES_ENDPOINT, SUPPLIERS_ENDPOINT} from "../api.service";
import {Category, Brand, Supplier, Product, BaseType} from "./models";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

class ProductListItem {
	constructor(public id: number, public name: string, public category: string, public brand: string,
		public price: string, public quotes: QuoteListItem[] = [],
		public isCategoryItem = false,
		public selected = false) {
	}
}

class QuoteListItem {
	constructor(public supplier: string, public price: string,
		public priceFixedRateHigh: string, public priceFixedRateLow: string) {
	}
}

class QuoteHeader {
	constructor(public supplier: string, public fixedRateHigh: number, public fixedRateLow: number) {
	};

	reset(supplier: string, fixedRateHigh: number, fixedRateLow: number) {
		this.supplier = supplier;
		this.fixedRateLow = fixedRateLow;
		this.fixedRateHigh = fixedRateHigh;
	}

	empty() {
		this.supplier = null;
		this.fixedRateHigh = null;
		this.fixedRateLow = null;
	}
}

@Component({
    selector: "products",
    templateUrl: "./src/app/components/products/list.html",
	styleUrls: ["./src/app/components/products/products.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class ProductsComponent implements OnInit {
    productList = [].ToList<Product>();
	searchList: ProductListItem[] = [];
	selectedItem: ProductListItem = null;
	quoteHeader1: QuoteHeader = new QuoteHeader(null, null, null);
	quoteHeader2: QuoteHeader = new QuoteHeader(null, null, null);

	filterText = '';
	totalAmount = 0;

	categoryAmount = 0;
	supplierAmount = 0;

	fixedRateHigh: number = (<any>window).nzb.rate.high;
	fixedRateLow: number = (<any>window).nzb.rate.low;
	currentRate: number = (<any>window).nzb.rate.live;

	isProductsLoading = true;
	isCategoriesLoading = true;
	isSuppliersLoading = true;

	private _filterText = '';
	private _isProductsLoaded = false;

    constructor(private http: Http, private router: Router) { }

    ngOnInit() {
        this.get();
    }

    get() {
		var that = this;

		this.http.get(PRODUCTS_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isProductsLoading = false;
				if (!json) return;

				json.forEach(c => {
					that.productList.Add(new Product(c));
				});

				that.totalAmount = that.productList.Count();
				that._isProductsLoaded = true;

				that.addProductsToSearchList(that.productList);
			},
			error => {
				this.isProductsLoading = false;
				console.log(error);
			});

		this.http.get(CATEGORIES_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isCategoriesLoading = false;
				if (!json) return;

				that.categoryAmount = json.length;
			},
			error => {
				this.isCategoriesLoading = false;
				console.log(error);
			});

		this.http.get(SUPPLIERS_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isSuppliersLoading = false;
				if (!json) return;

				that.supplierAmount = json.length;
			},
			error => {
				this.isSuppliersLoading = false;
				console.log(error);
			});
    }

	onClearFilter() {
		this.onSearch('');
	}

	onSearch(value: string) {
		if (this.filterText !== value)
			this.filterText = value;

		if (this.filterText === this._filterText)
			return;

		this.searchList = [];
		if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
			var result = this.productList
				.Where(x => this.startsWith(x.name, this.filterText) ||
					this.startsWith(x.category.name, this.filterText) ||
					this.startsWith(x.brand.name.toLowerCase(), this.filterText.toLowerCase()));

			this.addProductsToSearchList(result);
		}

		this._filterText = this.filterText;
	}

	onSelect(id: number) {
		this.selectedItem = null
		var that = this;

		this.searchList.forEach(x => {
			x.selected = x.id == id && !x.isCategoryItem;

			if (x.selected)
				that.selectedItem = x;
		});

		if (this.selectedItem && this.selectedItem.quotes.length > 0) {
			this.quoteHeader1.reset(this.selectedItem.quotes[0].supplier, this.fixedRateHigh, this.fixedRateLow);
		}
		else {
			this.quoteHeader1.empty();
		}

		if (this.selectedItem && this.selectedItem.quotes.length > 1) {
			this.quoteHeader2.reset(this.selectedItem.quotes[1].supplier, this.fixedRateHigh, this.fixedRateLow);
		}
		else {
			this.quoteHeader2.empty();
		}
	}

	addProductsToSearchList(products: List<Product>) {
		var list = [].ToList<ProductListItem>();
		var category = '';
		var that = this;

		products.ForEach(p => {
			if (p.category.name !== category) {
				list.Add(new ProductListItem(null, null, p.category.name, null, null, null, true));
				category = p.category.name;
			}

			var quoteItemList: QuoteListItem[] = [];
			p.quotes.forEach(q => {
				quoteItemList.push(new QuoteListItem(q.supplier.name, '$ ' + q.price,
					that.currencyConvert(that.fixedRateHigh, q.price),
					that.currencyConvert(that.fixedRateLow, q.price)));
			});

			list.Add(new ProductListItem(p.id, p.name, p.category.name, p.brand.name, '¥ ' + p.price, quoteItemList));
		});

		this.searchList = list.ToArray();
	}

	startsWith(str: string, searchString: string) {
		return str.substr(0, searchString.length) === searchString;
	};

	currencyConvert(rate: number, price: number) {
		return !price || isNaN(price) ? '' : '¥ ' + (price * rate).toFixed(2).toString().replace(/\.?0+$/, "");
	}

	get amount() { return this.searchList.ToList<ProductListItem>().Where(p => !p.isCategoryItem).Count(); }
	get isLoading() { return this.isProductsLoading || this.isCategoriesLoading || this.isSuppliersLoading; }
}