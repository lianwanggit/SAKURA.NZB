/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
import {Category, Brand, Supplier, Product} from "./models";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';


@Component({
    selector: "product-edit",
    templateUrl: "./src/app/components/products/edit.html",
	styleUrls: ["./src/app/components/products/products.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class ProductEditComponent implements OnInit {
	//categoryModel: Category = new Category({ "id": 0, "name": null });
	//brandModel: Brand = new Brand({ "id": 0, "name": null });
	//supplierModel: Supplier = new Supplier({ "id": 0, "name": null, "address": null, "phone": null });

	categories = [].ToList<Category>();
	brands = [].ToList<Brand>();
	suppliers = [].ToList<Supplier>();

	private editMode = false;

    constructor(private service: ApiService, private router: Router, params: RouteParams) {

	}

    ngOnInit() { }
}