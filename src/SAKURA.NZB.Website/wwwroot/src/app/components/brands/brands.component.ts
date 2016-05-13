/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators} from "angular2/common";
import {ApiService} from "../api.service";

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
    providers: [ApiService],
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

	brandForm: ControlGroup;

	constructor(private service: ApiService, fb: FormBuilder) {
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
		var name = this.brandForm.value.brand;
		var that = this;

		if (this._editMode) {
			var brand = new Brand(this._selectedBrand.id, name);
			this.service.putBrand(brand.id, JSON.stringify(brand))
				.subscribe(x => that.get());
		}
		else
			this.service.postBrand(JSON.stringify(new Brand("0", name)))
				.subscribe(x => that.get());
	}

	//areDuplicated(group: ControlGroup) {
	//	var id = (this._selectedBrand) ? this._selectedBrand.id : '';
	//	var name = group.controls['brand'].value
	//	var isDuplicated = this.brandList.ToList<Brand>().Any(b => b.id != id && b.name == name);

	//	return isDuplicated ? { duplicated: true } : null;
	//}

	get() {
		var that = this;

		this.brandList = [];
        this.service.getBrands(json => {
            if (json) {
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
            }
        });
    }

	startsWith(str: string, searchString: string) {
		return str.substr(0, searchString.length) === searchString;
	};

	get amount() { return this.searchList.length; }
	get dialogTitle() { return this._editMode ? "编辑品牌" : "新建品牌"; }
}