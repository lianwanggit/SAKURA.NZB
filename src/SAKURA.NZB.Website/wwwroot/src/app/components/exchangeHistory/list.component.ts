﻿/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Http} from 'angular2/http';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {EXCHANGEHISTORIES_SEARCH_ENDPOINT, EXCHANGEHISTORIES_YEARS_ENDPOINT, EXCHANGEHISTORIES_SUMMARY_ENDPOINT} from "../api.service";
import { PAGINATION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';
declare var moment: any;

class ExchangeHistory {
	id: number;
	cny: number;
	nzd: number;
	rate: number;
	sponsorCharge: number;
	receiverCharge: number;
	agent: string;
	createdTime: string;

	constructor(obj) {
		this.id = obj.id;
		this.cny = obj.cny;
		this.nzd = obj.nzd;
		this.rate = obj.rate;
		this.sponsorCharge = obj.sponsorCharge;
		this.receiverCharge = obj.receiverCharge;
		this.agent = obj.agent;
		this.createdTime = obj.createdTime;
	}
}

class ExchangeSummary {
	totalNzd: string;
	totalCny: string;
	rate: number;

	constructor(obj) {
		this.totalNzd = obj.totalNzd;
		this.totalCny = obj.totalCny;
		this.rate = obj.rate;
	}
}

@Component({
    selector: "customers",
    templateUrl: "./src/app/components/exchangeHistory/list.html",
	styleUrls: ["./src/app/components/exchangeHistory/list.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES, PAGINATION_DIRECTIVES]
})
export class ExchangeHistoriesComponent implements OnInit {
    historyList: ExchangeHistory[] = [];
	historySummary: ExchangeSummary = null;
	totalAmount = 0;

	isListLoading = true;
	isSummaryLoading = true;

	yearList: number[] = [];
	selectedYear: number = 0;

	page = 1;
	prevItems = [].ToList<ExchangeHistory>();
	nextItems = [].ToList<ExchangeHistory>();
	itemsPerPage = 0;
	totalItemCount = 0;

	private _isPrevItemsLoaded = false;
	private _isNextItemsLoaded = false;

    constructor(private http: Http, private router: Router) { }

    ngOnInit() {
        this.get();

		this.http.get(EXCHANGEHISTORIES_YEARS_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isSummaryLoading = false;
				if (!json) return;

				json.forEach(y => this.yearList.push(y));
			},
			error => {
				this.isSummaryLoading = false;
				console.log(error);
			});
    }

    get() {
		this._isPrevItemsLoaded = false;
		this._isNextItemsLoaded = false;

		var that = this;
		var url = EXCHANGEHISTORIES_SEARCH_ENDPOINT + '?page=' + this.page;
		if (this.selectedYear && this.selectedYear > 0)
			url += '&year=' + this.selectedYear;

		this.http.get(url)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isListLoading = false;
				if (!json) return;

				that.historyList = [];
				that.prevItems = [].ToList<ExchangeHistory>();
				that.nextItems = [].ToList<ExchangeHistory>();

				if (json.items) {
					json.items.forEach(c => {
						that.historyList.push(new ExchangeHistory(c));
					});
				}

				if (json.prevItems) {
					json.prevItems.forEach(c => {
						that.prevItems.Add(new ExchangeHistory(c));
					});
					that._isPrevItemsLoaded = true;
				}

				if (json.nextItems) {
					json.nextItems.forEach(c => {
						that.nextItems.Add(new ExchangeHistory(c));
					});
					that._isNextItemsLoaded = true;
				}
	
				that.itemsPerPage = json.itemsPerPage;
				that.totalItemCount = json.totalItemCount;

				if (!that.selectedYear)
					that.totalAmount = that.totalItemCount;
			},
			error => {
				this.isListLoading = false;
				console.log(error);
			});

		this.http.get(EXCHANGEHISTORIES_SUMMARY_ENDPOINT + this.selectedYear)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isSummaryLoading = false;
				if (!json) return;

				that.historySummary = new ExchangeSummary(json);
			},
			error => {
				this.isSummaryLoading = false;
				console.log(error);
			});
    }

	onSearchByYear(year: number) {
		if (this.selectedYear !== year)
			this.selectedYear = year;

		this.page = 1;
		this.get();
	}

	onPageChanged(event: any): void {
		this.historyList = [];

		if (this.page - 1 == event.page && this._isPrevItemsLoaded) {
			this.historyList = this.prevItems.ToArray();
		}
		if (this.page + 1 == event.page && this._isNextItemsLoaded) {
			this.historyList = this.nextItems.ToArray();
		}

		this.page = event.page;
		this.get();
	};

	get isLoading() { return this.isListLoading || this.isSummaryLoading; }
}