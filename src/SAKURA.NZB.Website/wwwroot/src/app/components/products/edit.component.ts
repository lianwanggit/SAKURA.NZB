/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
import {Category, Brand, Supplier, Product, Quote} from "./models";
import {SelectValidator, ValidationResult} from "../../validators/selectValidator";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

@Component({
    selector: "product-edit",
    templateUrl: "./src/app/components/products/edit.html",
	styleUrls: ["./src/app/components/products/products.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class ProductEditComponent implements OnInit {
	categories: Category[] = [];
	brands: Brand[] = [];
	suppliers: Supplier[] = [];

	//quotes: Quote[] = [];

	fixedRateHigh: number;
	fixedRateLow: number;
	currentRate: number;

	model: Product = new Product({
		"id": 0, "name": null, "desc": null, "categoryId": 0, "category": null,
		"brandId": 0, "brand": null, "images": null, "quotes": [], "price": null
	});
	productForm: ControlGroup;

	private editMode = false;
	private productId: string;

    constructor(private service: ApiService, private router: Router, params: RouteParams) {
		this.productId = params.get("id");
		if (this.productId) {
			this.editMode = true;
		}

		this.productForm = new ControlGroup({
			category: new Control(this.model.categoryId, SelectValidator.unselected),
			brand: new Control(this.model.brandId, SelectValidator.unselected),
			name: new Control(this.model.name, Validators.required),
			price: new Control(this.model.price),
			desc: new Control(this.model.desc)
		});
	}

    ngOnInit() {
		var that = this;

		this.service.getCategories(json => {
			if (json)
				json.forEach(c => {
					that.categories.push(new Category(c));
				});
		});
		this.service.getBrands(json => {
			if (json)
				json.forEach(b => {
					that.brands.push(new Brand(b));
				});
		});
		this.service.getSuppliers(json => {
			if (json)
				json.forEach(s => {
					that.suppliers.push(new Supplier(s));
				});
		});
		this.service.getLatestExchangeRates(json => {
			if (json) {
				that.fixedRateHigh = json.fixedRateHigh;
				that.fixedRateLow = json.fixedRateLow;
				that.currentRate = json.currentRate.toFixed(2);
			}
		});

		if (this.editMode) {
			this.service.getProduct(this.productId, json => {
				if (json) {
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
				}
			});
		}
	}

	onAddQuote() {
		this.model.quotes.push(new Quote({
			id: 0,
			productId: 0,
			supplierId: 0,
			supplier: null,
			price: null
		}));
	}

	onRemoveQuote(i: number) {
		this.model.quotes.splice(i, 1);
	}

	onSubmit() {
		var form = this.productForm.value;
		var p = new Product({
			"id": 0, "name": form.name, "desc": form.desc, "categoryId": form.category, "category": null,
			"brandId": form.brand, "brand": null, "images": null, "quotes": this.model.quotes, "price": form.price, "selected": false
		});

		if (!this.editMode) {
			this.service.postProduct(JSON.stringify(p, this.emptyStringToNull))
				.subscribe(response  => {
					this.router.navigate(['产品']);
				});
		} else {
			p.id = parseInt(this.productId);
			this.service.putProduct(this.productId, JSON.stringify(p, this.emptyStringToNull))
				.subscribe(response  => {
					this.router.navigate(['产品']);
				});
		}
	}

	emptyStringToNull(key: string, value: string) {
		return value === "" ? null : value;
	}

	get title() { return (this.model && this.editMode) ? "编辑产品 - " + this.model.name : "新建产品"; }
	get canAddQuote() { return !this.model.quotes || (this.model.quotes.length < this.suppliers.length); }
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
}