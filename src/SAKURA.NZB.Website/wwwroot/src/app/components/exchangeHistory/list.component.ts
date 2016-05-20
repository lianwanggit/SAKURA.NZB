/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Http} from 'angular2/http';
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {EXCHANGERATE_ENDPOINT} from "../api.service";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';
declare var moment: any;

export class ExchangeHistory {
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
		this.receiverCharge = obj.sponsorCharge;
		this.agent = obj.agent;
		this.createdTime = moment(obj.sponsorCharge).format('YYYY-MM-DD');
	}
}

@Component({
    selector: "customers",
    templateUrl: "./src/app/components/exchangeHistory/list.html",
	styleUrls: ["./src/app/components/exchangeHistory/list.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class ExchangeHistoriesComponent implements OnInit {
    historyList: ExchangeHistory[] = [];
	filterText = '';
	totalAmount = 0;

	isLoading = true;
	private _filterText = '';

    constructor(private http: Http, private router: Router) { }

    ngOnInit() {
        this.get();
    }

    get() {
		var that = this;

		this.http.get(EXCHANGERATE_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isLoading = false;
				if (!json) return;

				json.forEach(c => {
					that.historyList.push(new ExchangeHistory(c));
				});

				that.totalAmount = that.historyList.length;
			},
			error => {
				this.isLoading = false;
				console.log(error);
			});
    }
}