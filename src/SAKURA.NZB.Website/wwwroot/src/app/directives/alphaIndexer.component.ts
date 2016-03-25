/// <reference path="../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnChanges, SimpleChange, Input} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";

import '../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

export class Element {
	id: number;
	name: string;
	index: string;
	pinyin: string;

	constructor(i: number, n: string, p: string) {
		this.id = i;
		this.name = n;
		this.pinyin = p;
		this.index = this.pinyin ? this.pinyin.charAt(0).toUpperCase() : 'A';
	}
}

export class Indexer {
	letter: string;
	count: number;

	constructor(l: string, c: number) {
		this.letter = l;
		this.count = c;
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
	resultList: Element[] = [];

	@Input() elements: Element[];

	constructor() { }

	ngOnChanges(changes: { [propName: string]: SimpleChange }) {
		//console.log(JSON.stringify(changes));
		if (this.elements) {

			var list = this.alphabet.ToList<string>().Select(x => new Indexer(x, 0));
			this.elements.forEach(x => {
				var item = list.First(i => i.letter === x.index);
				item.count += 1;
			});

			this.indexerList = list.ToArray();
			this.resultList = this.elements.ToList<Element>()
				.OrderBy(x => x.pinyin)
				.ToArray();
		}
    }

	get d1() { return JSON.stringify(this.indexerList); }
	get d2() { return JSON.stringify(this.resultList); }
}