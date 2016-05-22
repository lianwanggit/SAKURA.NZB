/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit, AfterViewInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Http, Headers} from 'angular2/http';
import {Router, RouteParams, ROUTER_DIRECTIVES} from 'angular2/router';
import {EXCHANGEHISTORIES_ENDPOINT} from "../api.service";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

declare var moment: any;
declare var jQuery: any;

export class ExchangeHistory {
	id: number;
	cny: number;
	nzd: number;
	rate: number;
	sponsorCharge: number;
	receiverCharge: number;
	agent: string;
	createdTime: Date;

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

@Component({
    selector: "customer-edit",
    templateUrl: "./src/app/components/exchangehistory/edit.html",
	styleUrls: ["./src/app/components/exchangehistory/edit.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class ExchangeHistoryEditComponent implements OnInit, AfterViewInit {

	model: ExchangeHistory = new ExchangeHistory({
		"id": 0, "cny": null, "nzd": null, "rate": 0, "sponsorCharge": null,
		"receiverCharge": null, "agent": null, "createdTime": new Date()
	});

	editMode = false;
	isLoading = true;
	isCreatedDateValid = true;
	private historyId: string;

    constructor(private http: Http, private router: Router, params: RouteParams) {
		this.historyId = params.get("id");
		if (this.historyId) {
			this.editMode = true;
		} else { this.isLoading = false; }
	}

    ngOnInit() {
		if (this.editMode) {
			this.getHistory(this.historyId);
		}
    }

	ngAfterViewInit() {
		this.initialiseDatePicker();
	}

	getHistory(id: string) {
		var that = this;

		this.http.get(EXCHANGEHISTORIES_ENDPOINT + id)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isLoading = false;
				if (!json) return;

				that.model = new ExchangeHistory(json);
				jQuery('#createdDate').data("DateTimePicker").date(moment(that.model.createdTime));
			},
			error => {
				this.isLoading = false;
				console.log(error);
			});
	}

	onSubmit() {
		var that = this;
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		if (!this.editMode)
			this.http
				.post(EXCHANGEHISTORIES_ENDPOINT, JSON.stringify(this.model, this.emptyStringToNull), { headers: headers })
				.subscribe(
				response => this.router.navigate(['换汇记录']),
				error => console.error(error));
		else
			this.http.put(EXCHANGEHISTORIES_ENDPOINT + this.historyId, JSON.stringify(this.model, this.emptyStringToNull), { headers: headers })
				.subscribe(
				response => this.router.navigate(['换汇记录']),
				error => console.error(error));
	}

	onDelete() {
		if (this.editMode)
			this.http
				.delete(EXCHANGEHISTORIES_ENDPOINT + this.historyId)
				.subscribe(
				response => this.router.navigate(['换汇记录']),
				error => console.error(error));
	}

	initialiseDatePicker() {
		var that = this;
		var today = moment().startOf('day');
		var lastYear = moment().add(-1, 'y').endOf('day');
		jQuery('#createdDate').datetimepicker({
			locale: 'en-nz',
			format: 'L',
			minDate: lastYear,
			maxDate: today,
			ignoreReadonly: true,
			allowInputToggle: true
		});
		jQuery('#createdDate').data("DateTimePicker").showTodayButton(true);
		jQuery('#createdDate').data("DateTimePicker").showClear(true);
		jQuery('#createdDate').data("DateTimePicker").showClose(true);
		jQuery('#createdDate').data("DateTimePicker").defaultDate(today);
		jQuery('#createdDate').on("dp.change", function (e) {
			if (!e.date) {			
				that.isCreatedDateValid = false;
				that.model.createdTime = null;
			} else {
				that.isCreatedDateValid = true;
				that.model.createdTime = e.date.toDate();
			}
		});
	}
	 
	emptyStringToNull(key: string, value: string) {
		return value === "" ? null : value;
	}

	get data() { return JSON.stringify(this.model); }
	get title() { return (this.model && this.editMode) ? "编辑换汇记录" : "新建换汇记录"; }
}