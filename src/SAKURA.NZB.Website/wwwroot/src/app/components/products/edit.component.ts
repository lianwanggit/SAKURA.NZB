/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
import {Category, Brand, Supplier, Product} from "./models";
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

	model: Product = new Product({
		"id": 0, "name": null, "desc": null, "categoryId": 0, "category": null,
		"brandId": 0, "brand": null, "images": null, "quotes": null, "price": 0, "selected": false
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
			name: new Control(this.model.name, Validators.required)
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
	}

	onSubmit() {

	}

	get title() { return (this.model && this.editMode) ? "编辑产品 - " + this.model.name : "新建产品"; }
	get data() { return JSON.stringify(this.productForm.value); }
}