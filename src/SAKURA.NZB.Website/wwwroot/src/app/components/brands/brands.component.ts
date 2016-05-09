/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {ApiService} from "../api.service";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

class Brand {
	constructor(public id: string, public name: string) { }
}

@Component({
    selector: "customers",
    templateUrl: "./src/app/components/brands/brands.html",
	styleUrls: ["./src/app/components/brands/brands.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class BrandsComponent implements OnInit {
	brandList: Brand[] = [];
	searchList: Brand[] = [];
	filterText = '';
	totalAmount = 0;
	private _filterText = '';
	constructor(private service: ApiService) { }

	ngOnInit() {
		this.get();
	}

	onClearFilter() {
		this.onSearch('');
	}

	onSearch(value: string) {
		if (this.filterText !== value)
			this.filterText = value;

		if (this.filterText === this._filterText)
			return;

		this.searchList = [];
		if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
			this.searchList = this.brandList.ToList<Brand>()
				.Where(x => this.startsWith(x.name.toUpperCase(), this.filterText.toUpperCase()))
				.OrderBy(x => x.name)
				.ToArray();
		}

		this._filterText = this.filterText;
	}

	get() {
		var that = this;

        this.service.getBrands(json => {
            if (json) {
                json.forEach(c => {
					that.brandList.push(new Brand(c.id, c.name));
				});

				that.totalAmount = that.brandList.length;
				that.searchList = that.brandList.ToList<Brand>()
					.OrderBy(x => x.name)
					.ToArray();;
            }
        });
    }

	startsWith(str: string, searchString: string) {
		return str.substr(0, searchString.length) === searchString;
	};

	get amount() { return this.searchList.length; }
}