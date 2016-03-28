/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";
import {Category, Brand, Supplier, Product} from "./models";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

@Component({
    selector: "product-base-edit",
    templateUrl: "./src/app/components/products/baseEdit.html",
	styleUrls: ["./css/products.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class ProductBaseEditComponent implements OnInit {
    elementSource: Element[];

	categoryModel: Category = new Category({ "id": 0, "name": null });
	brandModel: Brand = new Brand({ "id": 0, "name": null });
	supplierModel: Supplier = new Supplier({ "id": 0, "name": null, "address": null, "phone": null });

	editMode = false;
	private editType: string;


    constructor(private service: ApiService, private router: Router, params: RouteParams) {
		this.editType = params.get("type");
	}

    ngOnInit() {

    }
}