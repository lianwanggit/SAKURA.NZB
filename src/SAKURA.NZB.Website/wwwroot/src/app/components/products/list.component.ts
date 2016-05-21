/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Http} from 'angular2/http';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {PRODUCTS_ENDPOINT, PRODUCTS_SEARCH_ENDPOINT, CATEGORIES_ENDPOINT, SUPPLIERS_ENDPOINT} from "../api.service";
import {Category, Supplier} from "./models";
import { PAGINATION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

declare var jQuery: any;

class ProductSummary {
	public quoteText: string;
	public priceText: string;
	public soldHighPriceText: string;
	public soldLowPriceText: string;

	public quoteFixedRateHight: string;
	public quoteFixedRateLow: string;
	public isCategoryItem = false;
	public selected = false;

	constructor(public id: number, public name: string, public category: string, public brand: string,
		public quote: number, price: number, soldHighPrice: number, soldLowPrice: number, public soldCount: number) {
		this.quoteText = this.toNzdText(this.quote);
		this.priceText = this.toCnyText(price);
		this.soldHighPriceText = this.toCnyText(soldHighPrice);
		this.soldLowPriceText = this.toCnyText(soldLowPrice);
	}

	calculateQuoteWithRate(fixedRateHigh: number, fixedRateLow: number) {
		this.quoteFixedRateHight = this.currencyConvert(fixedRateHigh, this.quote);
		this.quoteFixedRateLow = this.currencyConvert(fixedRateLow, this.quote);
	}

	private toNzdText(value: number) {
		return !jQuery.isNumeric(value) ? '' : '$ ' + value.toFixed(2).toString().replace(/\.?0+$/, "");
	}

	private toCnyText(value: number) {
		return !jQuery.isNumeric(value) ? '' : '¥ ' + value.toFixed(2).toString().replace(/\.?0+$/, "");
	}

	private currencyConvert(rate: number, price: number) {
		return !jQuery.isNumeric(price) ? '' : '¥ ' + (price * rate).toFixed(2).toString().replace(/\.?0+$/, "");
	}
}

@Component({
    selector: "products",
    templateUrl: "./src/app/components/products/list.html",
	styleUrls: ["./src/app/components/products/products.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, PAGINATION_DIRECTIVES]
})
export class ProductsComponent implements OnInit {
	productList = [].ToList<ProductSummary>();
	searchList: ProductSummary[] = [];
	selectedItem: ProductSummary = null;
	categories: Category[] = [];

	filterCategory = '';
	filterText = '';
	totalAmount = 0;

	categoryAmount = 0;
	supplierAmount = 0;

	fixedRateHigh: number = (<any>window).nzb.rate.high;
	fixedRateLow: number = (<any>window).nzb.rate.low;
	currentRate: number = (<any>window).nzb.rate.history;

	isProductsLoading = true;
	isCategoriesLoading = true;
	isSuppliersLoading = true;

	page = 1;
	prevItems = [].ToList<ProductSummary>();
	nextItems = [].ToList<ProductSummary>();
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
		this._isPrevItemsLoaded = false;
		this._isNextItemsLoaded = false;

		var that = this;
		var url = PRODUCTS_SEARCH_ENDPOINT + '?page=' + this.page;
		if (this.filterCategory)
			url += '&category=' + this.filterCategory;
		if (this.filterText)
			url += '&keyword=' + this.filterText;

		this.http.get(url)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isProductsLoading = false;
				if (!json) return;

				that.productList = [].ToList<ProductSummary>();
				that.prevItems = [].ToList<ProductSummary>();
				that.nextItems = [].ToList<ProductSummary>();

				if (json.items) {
					json.items.forEach(c => {
						that.productList.Add(new ProductSummary(c.id, c.name, c.category, c.brand, c.quote, c.price, c.soldHighPrice, c.soldLowPrice, c.soldCount));
					});
				}

				if (json.prevItems) {
					json.prevItems.forEach(c => {
						that.prevItems.Add(new ProductSummary(c.id, c.name, c.category, c.brand, c.quote, c.price, c.soldHighPrice, c.soldLowPrice, c.soldCount));
					});
					that._isPrevItemsLoaded = true;
				}

				if (json.nextItems) {
					json.nextItems.forEach(c => {
						that.nextItems.Add(new ProductSummary(c.id, c.name, c.category, c.brand, c.quote, c.price, c.soldHighPrice, c.soldLowPrice, c.soldCount));
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

	addProductsToSearchList(products: List<ProductSummary>) {
		var list = [].ToList<ProductSummary>();
		var category = '';
		var that = this;

		products.ForEach(p => {
			if (p.category !== category) {
				var ps = new ProductSummary(null, null, p.category, null, null, null, null, null, null);
				ps.isCategoryItem = true;

				list.Add(ps);
				category = p.category;
			}

			p.calculateQuoteWithRate(that.fixedRateHigh, that.fixedRateLow);
			list.Add(p);
		});

		this.searchList = list.ToArray();
	}

	get isLoading() { return this.isProductsLoading || this.isCategoriesLoading || this.isSuppliersLoading; }
}