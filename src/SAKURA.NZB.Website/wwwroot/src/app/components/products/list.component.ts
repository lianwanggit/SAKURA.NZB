/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit, ViewEncapsulation} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Http} from 'angular2/http';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {PRODUCTS_ENDPOINT, PRODUCTS_SEARCH_ENDPOINT, CATEGORIES_ENDPOINT, SUPPLIERS_ENDPOINT} from "../api.service";
import {Category, Brand, Supplier, Product, BaseType} from "./models";
import { PAGINATION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

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
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, PAGINATION_DIRECTIVES],
	encapsulation: ViewEncapsulation.None
})
export class ProductsComponent implements OnInit {
    productList = [].ToList<Product>();
	searchList: ProductListItem[] = [];
	selectedItem: ProductListItem = null;
	quoteHeader1: QuoteHeader = new QuoteHeader(null, null, null);
	quoteHeader2: QuoteHeader = new QuoteHeader(null, null, null);
	categories: Category[] = [];

	filterCategory = '';
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

	page = 1;
	prevItems = [].ToList<Product>();
	nextItems = [].ToList<Product>();
	itemsPerPage = 0;
	totalItemCount = 0;

	private _filterText = '';
	private _isPrevItemsLoaded = false;
	private _isNextItemsLoaded = false;

    constructor(private http: Http, private router: Router) { }

    ngOnInit() {
        this.get();
    }

    get() {
		var that = this;

		this.getProductsByPage();
		this.http.get(CATEGORIES_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isCategoriesLoading = false;
				if (!json) return;

				json.forEach(c => {
					that.categories.push(new Category(c));
				});

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
		this.onSearchKeyword('');
	}

	onSearchKeyword(value: string) {
		if (this.filterText !== value)
			this.filterText = value;

		if (this.filterText === this._filterText)
			return;

		this.searchList = [];
		if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
			this.page = 1;
			this.getProductsByPage();
		}

		this._filterText = this.filterText;
	}

	onSearchCategory(value: string) {
		if (this.filterCategory !== value)
			this.filterCategory = value;

		this.page = 1;
		this.getProductsByPage();
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

	onPageChanged(event: any): void {
		var loadSearchList = true;
		this.searchList = [];

		if (this.page - 1 == event.page && this._isPrevItemsLoaded) {
			this.addProductsToSearchList(this.prevItems);
			loadSearchList = false;
		}
		if (this.page + 1 == event.page && this._isNextItemsLoaded) {
			this.addProductsToSearchList(this.nextItems);
			loadSearchList = false;
		}

		this.page = event.page;
		this.getProductsByPage(loadSearchList);
	};

	getProductsByPage(loadSearchList = true) {
		this.productList = [].ToList<Product>();
		this.prevItems = [].ToList<Product>();
		this.nextItems = [].ToList<Product>();
		this._isPrevItemsLoaded = false;
		this._isNextItemsLoaded = false;

		var that = this;
		var url = PRODUCTS_SEARCH_ENDPOINT + '?index=' + this.page;
		if (this.filterCategory)
			url += '&category=' + this.filterCategory;
		if (this.filterText)
			url += '&keyword=' + this.filterText;

		this.http.get(url)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isProductsLoading = false;
				if (!json) return;

				if (json.items) {
					json.items.forEach(c => {
						that.productList.Add(new Product(c));
					});
				}

				if (json.prevItems) {
					json.prevItems.forEach(c => {
						that.prevItems.Add(new Product(c));
					});
					that._isPrevItemsLoaded = true;
				}

				if (json.nextItems) {
					json.nextItems.forEach(c => {
						that.nextItems.Add(new Product(c));
					});
					that._isNextItemsLoaded = true;
				}

				that.itemsPerPage = json.itemsPerPage;
				that.totalItemCount = json.totalItemCount;

				if (!that.filterCategory && !that.filterText)
					that.totalAmount = that.totalItemCount;

				if (loadSearchList)
					that.addProductsToSearchList(that.productList);
			},
			error => {
				this.isProductsLoading = false;
				console.log(error);
			});
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

	currencyConvert(rate: number, price: number) {
		return !price || isNaN(price) ? '' : '¥ ' + (price * rate).toFixed(2).toString().replace(/\.?0+$/, "");
	}

	get isLoading() { return this.isProductsLoading || this.isCategoriesLoading || this.isSuppliersLoading; }
}