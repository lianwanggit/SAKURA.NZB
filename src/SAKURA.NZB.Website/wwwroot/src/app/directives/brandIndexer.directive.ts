/// <reference path="../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnChanges, SimpleChange, Input, Output, EventEmitter} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";

import '../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

export class Item {
	selected: boolean = false;
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

		if (this.filterText === this._filterText)
			return;

		this.itemList = [];
		if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
			this.itemList = this.items.ToList<Item>()
				.Where(x => this.includes(x.name, this.filterText))
				.OrderBy(x => x.name)
				.ToArray();
		}

		this._filterText = this.filterText;
	}

	onClickIndexer(brand: string) {
		if (this._brand === brand) {
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

	includes(str:string, search:string) {
		if (search.length > str.length) {
			return false;
		} else {
			return str.indexOf(search) !== -1;
		}
	};

}