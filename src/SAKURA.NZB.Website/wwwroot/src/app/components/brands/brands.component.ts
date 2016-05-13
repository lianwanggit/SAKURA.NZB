/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators} from "angular2/common";
import {Http, Headers} from 'angular2/http';
import {BRANDS_ENDPOINT} from "../api.service";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

declare var $: any;

class Brand {
	public selected: boolean = false;
	constructor(public id: string, public name: string) { }
}

@Component({
    selector: "customers",
    templateUrl: "./src/app/components/brands/brands.html",
	styleUrls: ["./src/app/components/brands/brands.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class BrandsComponent implements OnInit {
	brandList: Brand[] = [];
	searchList: Brand[] = [];
	filterText = '';
	totalAmount = 0;

	private _editMode = false;
	private _filterText = '';
	private _selectedBrand: Brand;

	isLoading = true;
	brandForm: ControlGroup;

	constructor(private http: Http, fb: FormBuilder) {
		this.brandForm = fb.group({
			brand: [null, Validators.required]
		});
	}

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

	onCreate() {
		(<any>this.brandForm.controls['brand']).updateValue(null);
		this._editMode = false;
		$('#myModal').modal('show');
	}

	onClick(id: string) {
		this.searchList.forEach(b => {
			if (b.id == id) {
				if (b.selected) {
					(<any>this.brandForm.controls['brand']).updateValue(this._selectedBrand.name);
					this._editMode = true;
					$('#myModal').modal('show');
				}

				this._selectedBrand = b;
			}

			b.selected = b.id == id;
		});
	}

	onSubmit() {
		$('#myModal').modal('hide');
		var that = this;
		var name = this.brandForm.value.brand;
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');
	
		if (!this._editMode)
			this.http
				.post(BRANDS_ENDPOINT, JSON.stringify(new Brand("0", name)), { headers: headers })
				.subscribe(
					response => this.get(),
					error => console.error(error));
		else {
			var brand = new Brand(this._selectedBrand.id, name);
			this.http.put(BRANDS_ENDPOINT + brand.id, JSON.stringify(brand), { headers: headers })
				.subscribe(
					response => this.get(),
					error => console.error(error));
		}
	}

	get() {
		var that = this;
		this.brandList = [];

		this.http.get(BRANDS_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isLoading = false;
				if (!json) return;

				json.forEach(c => {
					that.brandList.push(new Brand(c.id, c.name));
				});

				that.totalAmount = that.brandList.length;
				that.searchList = that.brandList.ToList<Brand>()
					.OrderBy(x => x.name)
					.ToArray();

				if (that._selectedBrand) {
					this.searchList.forEach(b => {
						b.selected = b.id == that._selectedBrand.id;

						if (b.id == that._selectedBrand.id) {
							that._selectedBrand = b;
						}
					});
				}
			},
			error => {
				this.isLoading = false;
				console.log(error);
			});
    }

	startsWith(str: string, searchString: string) {
		return str.substr(0, searchString.length) === searchString;
	};

	get amount() { return this.searchList.length; }
	get dialogTitle() { return this._editMode ? "编辑品牌" : "新建品牌"; }
}