﻿/// <reference path="../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnChanges, SimpleChange, Input, Output, EventEmitter} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";

import '../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

export class Item {
	selected: boolean = false;
	visible = true;
	constructor(public id: string, public name: string, public brand: string) { }
}

export class Brand {
	selected: boolean = false;
	constructor(public name: string, public count: number) { }
}

@Component({
    selector: "brand-indexer",
    templateUrl: "./src/app/directives/brandIndexer.html",
	styleUrls: ["./src/app/directives/alpha-indexer.css",
		"./src/app/directives/brand-indexer.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})

export class BrandIndexerDirective implements OnChanges {
	brandList: Brand[] = [];
	itemList: Item[] = [];

	filterText = '';
	private _filterText = '';
	private _brand = '';

	@Input() items: Item[];
	@Input() selectedId: string;
	@Input() height = 500;
	@Output() selectionChanged= new EventEmitter();

	constructor() { }

	ngOnChanges(changes: { [propName: string]: SimpleChange }) {
		if (this.items) {
			var list = this.brandList.ToList<Brand>();
			this.items.forEach(x => {
				var item = list.FirstOrDefault(b => b.name == x.brand);
				if (!item)
					list.Add(new Brand(x.brand, 1));
				else
					item.count += 1;
			});

			this.brandList = list.OrderBy(b => b.name).ToArray();
			this.itemList = this.items.slice();

			this.onClickElement(this.selectedId);
		}
    }

	onClearFilter() {
		this.onSearch('');
	}

	onSearch(value: string) {
		this.clearIndexSelection();

		if (this.filterText !== value)
			this.filterText = value;

		if (this.filterText === this._filterText && this.filterText != '')
			return;

		this.itemList = [];
		if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
			var brand = this.brandList.ToList<Brand>().FirstOrDefault(x => this.startsWith(x.name, this.filterText));
			if (brand) {
				this.onClickIndexer(brand.name, false);	
			} else {
				this.itemList = this.items.ToList<Item>()
				.OrderBy(x => x.name)
				.ToArray();

				this.clearIndexSelection();
			}
		}

		this._filterText = this.filterText;
	}

	onClickIndexer(brand: string, toggle = true) {
		if (this._brand === brand && toggle) {
			this.clearIndexSelection();
			this.itemList = this.items.ToList<Item>()
				.OrderBy(x => x.name)
				.ToArray();
			return;
		}

		this.brandList.forEach(x => {
			x.selected = x.name === brand;
		});

		this.itemList = this.items.ToList<Item>()
			.Where(x => x.brand === brand)
			.OrderBy(x => x.name)
			.ToArray();
		this._brand = brand;
	}

	onClickElement(id: string) {
		this.items.forEach(x => {
			if (x.id.toString() == id) {
				this.selectedId = id;
				this.selectionChanged.emit(id);
			}
		});

	}

	clearIndexSelection() {
		var index = this.brandList.ToList<Brand>().FirstOrDefault(x => x.name == this._brand);
		if (index)
			index.selected = false;
		this._brand = '';
	}

	startsWith(str: string, searchString: string) {
		if (searchString == '') return false;
		return str.toLowerCase().substr(0, searchString.length) === searchString.toLowerCase();
	};

	get indexNoSelection() { return this.brandList.ToList<Brand>().All(b => !b.selected); }
}