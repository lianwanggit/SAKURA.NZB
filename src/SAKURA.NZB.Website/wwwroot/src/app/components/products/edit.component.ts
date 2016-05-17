/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Http, Headers} from 'angular2/http';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {PRODUCTS_ENDPOINT, CATEGORIES_ENDPOINT, BRANDS_ENDPOINT, SUPPLIERS_ENDPOINT, ORDER_GET_LATEST_BY_PRODUCT} from "../api.service";
import {Category, Brand, Supplier, Product, Quote} from "./models";
import {SelectValidator, ValidationResult} from "../../validators/selectValidator";

import {TYPEAHEAD_DIRECTIVES} from "ng2-bootstrap/ng2-bootstrap";
import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

class LatestOrder {
	constructor(public waybill: string, public customer: string, public orderTime: string) { }
}

@Component({
    selector: "product-edit",
    templateUrl: "./src/app/components/products/edit.html",
	styleUrls: ["./src/app/components/products/products.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, TYPEAHEAD_DIRECTIVES]
})
export class ProductEditComponent implements OnInit {
	categories: Category[] = [];
	brands: Brand[] = [];
	suppliers: Supplier[] = [];

	public selectedBrandName: string = '';

	fixedRateHigh: number = (<any>window).nzb.rate.high;
	fixedRateLow: number = (<any>window).nzb.rate.low;
	currentRate: number = (<any>window).nzb.rate.live;

	model: Product = new Product({
		"id": 0, "name": null, "desc": null, "categoryId": 0, "category": null,
		"brandId": 0, "brand": null, "images": null, "quotes": [], "price": null
	});
	productForm: ControlGroup;

	isProductLoading = true;
	isLatestOrderLoading = true;
	isCategoriesLoading = true;
	isBrandsLoading = true;
	isSuppliersLoading = true;

	duplicatedNameAlert = false;
	latestOrder: LatestOrder = null;
	canDelete = true;
	editMode = false;

	private productId: string;

    constructor(private http: Http, private router: Router, params: RouteParams) {
		this.productId = params.get("id");
		if (this.productId) {
			this.editMode = true;
		} else {
			this.isProductLoading = false;
			this.isLatestOrderLoading = false;
		}

		this.productForm = new ControlGroup({
			category: new Control(this.model.categoryId, SelectValidator.unselected),
			brand: new Control(this.model.brandId, Validators.required),
			name: new Control(this.model.name, Validators.required),
			price: new Control(this.model.price),
			desc: new Control(this.model.desc)
		});
	}

    ngOnInit() {
		var that = this;

		this.http.get(CATEGORIES_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isCategoriesLoading = false;
				if (!json) return;

				json.forEach(c => {
					that.categories.push(new Category(c));
				});
			},
			error => {
				this.isCategoriesLoading = false;
				console.log(error);
			});

		this.http.get(BRANDS_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isBrandsLoading = false;
				if (!json) return;

				json.forEach(b => {
					that.brands.push(new Brand(b));
				});
			},
			error => {
				this.isBrandsLoading = false;
				console.log(error);
			});

		this.http.get(SUPPLIERS_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isSuppliersLoading = false;
				if (!json) return;

				json.forEach(s => {
					that.suppliers.push(new Supplier(s));
				});
			},
			error => {
				this.isSuppliersLoading = false;
				console.log(error);
			});

		if (this.editMode) {
			this.http.get(PRODUCTS_ENDPOINT + this.productId)
				.map(res => res.status === 404 ? null : res.json())
				.subscribe(json => {
					this.isProductLoading = false;
					if (!json) return;

					that.model = new Product(json);
					var categoryControl: any;
					categoryControl = that.productForm.controls['category'];
					categoryControl.updateValue(that.model.categoryId);

					var brandControl: any;
					brandControl = that.productForm.controls['brand'];
					brandControl.updateValue(that.model.brandId);

					var nameControl: any;
					nameControl = that.productForm.controls['name'];
					nameControl.updateValue(that.model.name);

					var priceControl: any;
					priceControl = that.productForm.controls['price'];
					priceControl.updateValue(that.model.price);

					var descControl: any;
					descControl = that.productForm.controls['desc'];
					descControl.updateValue(that.model.desc);

					that.selectedBrandName = that.model.brand.name;
				},
				error => {
					this.isProductLoading = false;
					console.log(error);
				});

			this.http.get(ORDER_GET_LATEST_BY_PRODUCT + this.productId)
				.map(res => res.status === 404 ? null : res.json())
				.subscribe(json => {
					this.isLatestOrderLoading = false;
					if (!json) return;

					this.canDelete = false;
					this.latestOrder = new LatestOrder(json.waybill, json.customer, json.orderTime);
				},
				error => {
					this.isLatestOrderLoading = false;
					console.log(error);
				});
		}
	}

	onAddQuote() {
		var supplierId = 0;
		if (this.suppliers.length) {
			supplierId = this.suppliers[0].id;
		}

		this.model.quotes.push(new Quote({
			id: 0,
			productId: 0,
			supplierId: supplierId,
			supplier: null,
			price: null
		}));
	}

	onRemoveQuote(i: number) {
		this.model.quotes.splice(i, 1);
	}

	onSelectBrand(e: any) {
		var brandControl: any;
		brandControl = this.productForm.controls['brand'];
		brandControl.updateValue(e.item.id);
	}

	onBrandInput(e: any) {
		var name = e.target.value;
		var brand = this.brands.ToList<Brand>().FirstOrDefault(b => b.name == name);
		var brandControl: any;
		brandControl = this.productForm.controls['brand'];

		if (brand) {
			brandControl.updateValue(brand.id);
		} else {
			brandControl.updateValue(null);
		}
	}

	onSubmit() {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		var form = this.productForm.value;
		var p = new Product({
			"id": 0, "name": form.name, "desc": form.desc, "categoryId": form.category, "category": null,
			"brandId": form.brand, "brand": null, "images": null, "quotes": this.model.quotes, "price": form.price, "selected": false
		});

		if (!this.editMode) {
			this.http
				.post(PRODUCTS_ENDPOINT, JSON.stringify(p, this.emptyStringToNull), { headers: headers })
				.subscribe(
					response => this.router.navigate(['产品']),
					error => {
						console.error(error);

						if (error._body == 'name taken') {
							this.duplicatedNameAlert = true;
							return;
						}
					});
		} else {
			p.id = parseInt(this.productId);
			this.http
				.put(PRODUCTS_ENDPOINT + this.productId, JSON.stringify(p, this.emptyStringToNull), { headers: headers })
				.subscribe(
					response => this.router.navigate(['产品']),
					error => {
						console.error(error);

						if (error._body == 'name taken') {
							this.duplicatedNameAlert = true;
							return;
						}
					});
		}
	}

	onDelete() {
		if (this.editMode)
			this.http.delete(PRODUCTS_ENDPOINT + this.productId)
				.subscribe(
				response => this.router.navigate(['产品']),
				error => console.error(error));
	}

	emptyStringToNull(key: string, value: string) {
		return value === "" ? null : value;
	}

	get isLoading() { return this.isProductLoading || this.isLatestOrderLoading || this.isCategoriesLoading || this.isBrandsLoading || this.isSuppliersLoading; }
	get title() { return (this.model && this.editMode) ? "编辑产品 - " + this.model.name : "新建产品"; }
	get canAddQuote() { return !this.model.quotes || (this.model.quotes.length < this.suppliers.length); }
	get isQuotesValid() { return this.model.quotes.ToList<Quote>().All(q => q.isValid); }
	get isLowPrice() {
		var price = this.productForm.value.price;
		if (price && this.model.quotes.length > 0) {
			var lowQuote = this.model.quotes.ToList<Quote>().Min(q => q.price);
			if (lowQuote && price <= lowQuote * this.currentRate) {
				return true;
			}
		}

		return false;
	}

	get profit() {
		var price = this.productForm.value.price;
		if (price && this.model.quotes.length > 0) {
			var lowQuote = this.model.quotes.ToList<Quote>().Min(q => q.price);
			if (lowQuote) {
				return (price - lowQuote * this.fixedRateLow).toFixed(2);
			}
		}

		return '';
	}
}