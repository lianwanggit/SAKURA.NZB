/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
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
    providers: [ApiService],
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
	brandAmount = 0;
	supplierAmount = 0;

	fixedRateHigh: number;
	fixedRateLow: number;
	currentRate: number;

	private _filterText = '';
	private _isProductsLoaded = false;
	private _isRatesLoaded = false;

    constructor(private service: ApiService, private router: Router) { }

    ngOnInit() {
        this.get();
    }

    get() {
		var that = this;

		this.service.getLatestExchangeRates(json => {
			if (json) {
				that.fixedRateHigh = json.fixedRateHigh;
				that.fixedRateLow = json.fixedRateLow;
				that.currentRate = json.currentRate.toFixed(2);
				that._isRatesLoaded = true;

				if (that._isProductsLoaded)
					that.addProductsToSearchList(that.productList);
			}
		});

        this.service.getProducts(json => {
            if (json) {
                json.forEach(c => {
					that.productList.Add(new Product(c));
				});

				that.totalAmount = that.productList.Count();
				that._isProductsLoaded = true;

				if (that._isRatesLoaded)
					that.addProductsToSearchList(that.productList);
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
}