/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
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
    providers: [ApiService],
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

	private editType: string;
	private editMode = true;

    constructor(private service: ApiService, private router: Router, params: RouteParams) {
		this.editType = params.get("type");
	}

    ngOnInit() {
		var that = this;

		if (this.isCategory) {
			this.service.getCategories(json => {
				if (json) {
					json.forEach(x => {
						that.namelist.push(new NameList(x.id, x.name));
						that.categories.Add(new Category(x));
					});

					if (that.namelist.length > 0)
						that.onSelect(that.namelist[0].id);
				}
			});
		}
		if (this.isBrand) {
			this.service.getBrands(json => {
				if (json) {
					json.forEach(x => {
						that.namelist.push(new NameList(x.id, x.name));
						that.brands.Add(new Brand(x));
					});

					if (that.namelist.length > 0)
						that.onSelect(that.namelist[0].id);
				}
			});
		}
		if (this.isSupplier) {
			this.service.getSuppliers(json => {
				if (json) {
					json.forEach(x => {
						that.namelist.push(new NameList(x.id, x.name));
						that.suppliers.Add(new Supplier(x));
					});

					if (that.namelist.length > 0)
						that.onSelect(that.namelist[0].id);
				}
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
		this.submitted = false;
	}

	onSubmit() {
		var that = this;

		if (this.isCategory) {
			if (this.editMode) 
				this.service.putCategory(this.categoryModel.id.toString(), JSON.stringify(this.categoryModel))
					.subscribe(x => this.router.navigate(['产品']));		
			else 
				this.service.postCategory(JSON.stringify(this.categoryModel))
					.subscribe(x => this.router.navigate(['产品']));				
		}
		if (this.isBrand) {
			if (this.editMode)
				this.service.putBrand(this.brandModel.id.toString(), JSON.stringify(this.brandModel))
					.subscribe(x => this.router.navigate(['产品']));
			else 
				this.service.postBrand(JSON.stringify(this.brandModel))
					.subscribe(x => this.router.navigate(['产品']));			
		}
		if (this.isSupplier) {
			if (this.editMode)
				this.service.putSupplier(this.supplierModel.id.toString(), JSON.stringify(this.supplierModel))
					.subscribe(x => this.router.navigate(['产品']));
			else 
				this.service.postSupplier(JSON.stringify(this.supplierModel))
					.subscribe(x => this.router.navigate(['产品']));
		}
	}

	get isCategory() { return this.editType == "category"; }
	get isBrand() { return this.editType == "brand"; }
	get isSupplier() { return this.editType == "supplier"; }
	get title() {
		if (this.isCategory)
			return "产品类别";
		if (this.isBrand)
			return "品牌";
		if (this.isSupplier)
			return "供应商";
		return "";
	}
}