/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Http, Headers} from 'angular2/http';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {CATEGORIES_ENDPOINT, SUPPLIERS_ENDPOINT} from "../api.service";
import {Category, Brand, Supplier, Product} from "./models";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

export class NameList {
	id: number;
	name: string;
	selected = false;

	constructor(id: number, name: string) {
		this.id = id;
		this.name = name;
	}
}

@Component({
    selector: "product-base-edit",
    templateUrl: "./src/app/components/products/baseEdit.html",
	styleUrls: ["./src/app/components/products/products.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class ProductBaseEditComponent implements OnInit {
	categoryModel: Category = new Category({ "id": 0, "name": null });
	brandModel: Brand = new Brand({ "id": 0, "name": null });
	supplierModel: Supplier = new Supplier({ "id": 0, "name": null, "address": null, "phone": null });

	namelist: NameList[] = [];
	categories = [].ToList<Category>();
	brands = [].ToList<Brand>();
	suppliers = [].ToList<Supplier>();

	isLoading = true;
	private editType: string;
	private editMode = true;

    constructor(private http: Http, private router: Router, params: RouteParams) {
		this.editType = params.get("type");
	}

    ngOnInit() {
		var that = this;

		if (this.isCategory) {
			this.http.get(CATEGORIES_ENDPOINT)
				.map(res => res.status === 404 ? null : res.json())
				.subscribe(json => {
					that.isLoading = false;
					if (!json) return;

					json.forEach(x => {
						that.namelist.push(new NameList(x.id, x.name));
						that.categories.Add(new Category(x));
					});

					if (that.namelist.length > 0)
						that.onSelect(that.namelist[0].id);
				},
				error => {
					this.isLoading = false;
					console.log(error);
				});
		}
		if (this.isSupplier) {

			this.http.get(SUPPLIERS_ENDPOINT)
				.map(res => res.status === 404 ? null : res.json())
				.subscribe(json => {
					that.isLoading = false;
					if (!json) return;

					json.forEach(x => {
						that.namelist.push(new NameList(x.id, x.name));
						that.suppliers.Add(new Supplier(x));
					});

					if (that.namelist.length > 0)
						that.onSelect(that.namelist[0].id);
				},
				error => {
					this.isLoading = false;
					console.log(error);
				});
		}
    }

	onSelect(id: number) {
		if (this.isCategory)
			this.categoryModel = this.categories.FirstOrDefault(x => x.id == id);
		if (this.isBrand)
			this.brandModel = this.brands.FirstOrDefault(x => x.id == id);
		if (this.isSupplier)
			this.supplierModel = this.suppliers.FirstOrDefault(x => x.id == id);

		this.namelist.forEach(x => {
			x.selected = x.id == id;
		});

		this.editMode = true;
	}

	onCreate() {
		if (this.isCategory)
			this.categoryModel = new Category({ "id": 0, "name": null });
		if (this.isBrand)
			this.brandModel = new Brand({ "id": 0, "name": null });
		if (this.isSupplier)
			this.supplierModel = new Supplier({ "id": 0, "name": null, "address": null, "phone": null });

		this.namelist.forEach(x => {
			x.selected = false;
		});

		this.editMode = false;
	}

	onSubmit() {
		var that = this;
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		if (this.isCategory) {
			if (this.editMode) 
				this.http
					.put(CATEGORIES_ENDPOINT + this.categoryModel.id, JSON.stringify(this.categoryModel), { headers: headers })
					.subscribe(
					response => this.router.navigate(['产品']),
					error => console.error(error));
			else 
				this.http
					.post(CATEGORIES_ENDPOINT, JSON.stringify(this.categoryModel), { headers: headers })
					.subscribe(
					response => this.router.navigate(['产品']),
					error => console.error(error));			
		}
		if (this.isSupplier) {
			if (this.editMode)
				this.http
					.put(SUPPLIERS_ENDPOINT + this.supplierModel.id, JSON.stringify(this.supplierModel), { headers: headers })
					.subscribe(
					response => this.router.navigate(['产品']),
					error => console.error(error));
			else
				this.http
					.post(SUPPLIERS_ENDPOINT, JSON.stringify(this.supplierModel), { headers: headers })
					.subscribe(
					response => this.router.navigate(['产品']),
					error => console.error(error));	
		}
	}

	get isCategory() { return this.editType == "category"; }
	get isSupplier() { return this.editType == "supplier"; }
	get title() {
		if (this.isCategory)
			return "产品类别";
		if (this.isSupplier)
			return "供应商";
		return "";
	}
}