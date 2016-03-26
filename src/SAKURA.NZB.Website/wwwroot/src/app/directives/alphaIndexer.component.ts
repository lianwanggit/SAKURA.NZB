/// <reference path="../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnChanges, SimpleChange, Input, Output, EventEmitter} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";

import '../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

export class Element {
	id: number;
	name: string;
	index: string;
	pinyin: string;
	selected: boolean;

	constructor(i: number, n: string, p: string) {
		this.id = i;
		this.name = n;
		this.pinyin = p;
		this.index = this.pinyin ? this.pinyin.charAt(0).toUpperCase() : 'A';
		this.selected = false;
	}
}

export class Indexer {
	letter: string;
	count: number;
	selected: boolean;

	constructor(l: string, c: number) {
		this.letter = l;
		this.count = c;
		this.selected = false;
	}
}

@Component({
    selector: "alpha-indexer",
    templateUrl: "./src/app/directives/alphaIndexer.html",
	styleUrls: ["./css/alpha-indexer.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES]
})
export class AlphaIndexerComponent implements OnChanges {
	alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

	indexerList: Indexer[] = [];
	elementList: Element[] = [];

	filterText = '';
	private _filterText = '';
	private _indexer = '';
	private _selectedId = '';

	@Input() elements: Element[];
	@Input() initialSelectedId: string;
	@Output() selectedId = new EventEmitter();

	constructor() { }

	ngOnChanges(changes: { [propName: string]: SimpleChange }) {
		//console.log(JSON.stringify(changes));
		if (this.elements) {

			var list = this.alphabet.ToList<string>().Select(x => new Indexer(x, 0));
			this.elements.forEach(x => {
				var item = list.First(i => i.letter === x.index);
				item.count += 1;
			});

			this.indexerList = list.Where(x => x.count > 0).ToArray();		
			this.elementList = this.elements.ToList<Element>()
				.OrderBy(x => x.pinyin)
				.ToArray();

			this.onClickElement(this.initialSelectedId);
		}
    }

	onClearFilter() {
		this.onSearch('');
	}

	onSearch(value: string) {
		this.clearIndexSelection();
		this.clearElementSelection();

		if (this.filterText !== value)
			this.filterText = value;

		if (this.filterText === this._filterText)
			return;

		this.elementList = [];
		if (/^$|^[\u4e00-\u9fa5_a-zA-Z ]+$/g.test(this.filterText)) {
			this.elementList = this.elements.ToList<Element>()
				.Where(x => this.startsWith(x.name, this.filterText) ||
					this.startsWith(x.pinyin.toLowerCase(), this.filterText.toLowerCase()))
				.OrderBy(x => x.pinyin)
				.ToArray();
		}

		this._filterText = this.filterText;
	}

	onClickIndexer(letter: string) {
		//toggle
		if (this._indexer === letter) {
			this.clearIndexSelection();
			this.elementList = this.elements.ToList<Element>()
				.OrderBy(x => x.pinyin)
				.ToArray();
			return;
		}

		this.indexerList.forEach(x => {
			if (x.letter === letter) {
				x.selected = true;
				return;
			}

			x.selected = false;
		});
				
		this.elementList = this.elements.ToList<Element>()
			.Where(x => x.index === letter)
			.OrderBy(x => x.pinyin)
			.ToArray();
		this.clearElementSelection();
		this._indexer = letter;
	}

	onClickElement(id: string) {
		if (this._selectedId == id) return;

		this.elementList.forEach(x => {
			if (x.id.toString() == id) {
				x.selected = true;
				this.selectedId.emit(x.id);
				return;
			}

			x.selected = false;
		});	

		this._selectedId = id;
	}

	clearIndexSelection() {
		var index = this.indexerList.ToList<Indexer>().FirstOrDefault(x => x.letter == this._indexer);
		if (index)
			index.selected = false;
		this._indexer = '';
	}

	clearElementSelection() {
		var element = this.elementList.ToList<Element>().FirstOrDefault(x => x.id.toString() == this._selectedId);
		if (element)
			element.selected = false;

		this._selectedId = '';
	}

	startsWith(str: string, searchString: string) {
		return str.substr(0, searchString.length) === searchString;
	};

}