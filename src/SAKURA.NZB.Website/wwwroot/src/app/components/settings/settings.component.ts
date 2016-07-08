import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Control, Validators} from "angular2/common";
import {Http, Headers} from 'angular2/http';
import {SETTINGS_ENDPOINT} from "../api.service";
import {PositiveNumberValidator, NumberValidator, ValidationResult} from "../../validators/numberValidator";
import { ACCORDION_DIRECTIVES } from 'ng2-bootstrap/ng2-bootstrap';

class Settings {
	constructor(public fixedRateLow: number, public fixedRateHigh: number, public freightRate: number,
		public apiLayerAccessKey: string, public senderName: string, public senderPhone: string,
		public flywayUri: string, public flywayCode: string, public efsPostUri: string, public ztoUri: string,
		public nzstCode: string, public nzstUri: string, public ftdUri: string,
		public productItemsPerPage: number, public ordersItemsPerPage: number, public exchangeHistoriesItemsPerPage: number) { }
}

@Component({
    selector: "settings",
    templateUrl: "./src/app/components/settings/settings.html",
	styleUrls: ["./src/app/components/settings/settings.css"],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ACCORDION_DIRECTIVES]
})

export class SettingsComponent implements OnInit {
	model: Settings = null;

	isLoading = true;
	settingsForm: ControlGroup;

	constructor(private http: Http, fb: FormBuilder) {
		this.settingsForm = fb.group({
			fixedRateLow: [null, NumberValidator.unspecified],
			fixedRateHigh: [null, NumberValidator.unspecified],
			freightRate: [null, NumberValidator.unspecified],

			apiLayerAccessKey: [null, Validators.required],
			senderName: [null, Validators.required],
			senderPhone: [null, Validators.required],

			flywayUri: [null, Validators.required],
			flywayCode: [null, Validators.required],
			efsPostUri: [null, Validators.required],
			ztoUri: [null, Validators.required],
			nzstCode: [null, Validators.required],
			nzstUri: [null, Validators.required],
			ftdUri: [null, Validators.required],

			productItemsPerPage: [null, PositiveNumberValidator.unspecified],
			ordersItemsPerPage: [null, PositiveNumberValidator.unspecified],
			exchangeHistoriesItemsPerPage: [null, PositiveNumberValidator.unspecified],
		});
	}

	ngOnInit() {
		this.get();
	}

	onSubmit() {

		var that = this;
		this.model.fixedRateLow = this.settingsForm.value.fixedRateLow;
		this.model.fixedRateHigh = this.settingsForm.value.fixedRateHigh;
		this.model.freightRate = this.settingsForm.value.freightRate;

		this.model.apiLayerAccessKey = this.settingsForm.value.apiLayerAccessKey;
		this.model.senderName = this.settingsForm.value.senderName;
		this.model.senderPhone = this.settingsForm.value.senderPhone;

		this.model.flywayUri = this.settingsForm.value.flywayUri;
		this.model.flywayCode = this.settingsForm.value.flywayCode;
		this.model.efsPostUri = this.settingsForm.value.efsPostUri;
		this.model.ztoUri = this.settingsForm.value.ztoUri;
		this.model.nzstCode = this.settingsForm.value.nzstCode;
		this.model.nzstUri = this.settingsForm.value.nzstUri;
		this.model.ftdUri = this.settingsForm.value.ftdUri;

		this.model.productItemsPerPage = this.settingsForm.value.productItemsPerPage;
		this.model.ordersItemsPerPage = this.settingsForm.value.ordersItemsPerPage;
		this.model.exchangeHistoriesItemsPerPage = this.settingsForm.value.exchangeHistoriesItemsPerPage;

		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		this.http
			.post(SETTINGS_ENDPOINT, JSON.stringify(this.model), { headers: headers })
			.subscribe(
			response => that.get(),
			error => console.error(error));
	}

	onCancel() {
		this.updateForm();
	}

	get() {
		this.http.get(SETTINGS_ENDPOINT)
			.map(res => res.status === 404 ? null : res.json())
			.subscribe(json => {
				this.isLoading = false;
				if (!json) return;

				this.model = new Settings(json.fixedRateLow, json.fixedRateHigh, json.freightRate,
					json.apiLayerAccessKey, json.senderName, json.senderPhone,
					json.flywayUri, json.flywayCode, json.efsPostUri, json.ztoUri, json.nzstCode, json.nzstUri, json.ftdUri,
					json.productItemsPerPage, json.ordersItemsPerPage, json.exchangeHistoriesItemsPerPage);

				this.updateForm();		
			},
			error => {
				this.isLoading = false;
				console.log(error);
			});
    }

	updateForm() {
		(<any>this.settingsForm.controls['fixedRateLow']).updateValue(this.model.fixedRateLow);
		(<any>this.settingsForm.controls['fixedRateHigh']).updateValue(this.model.fixedRateHigh);
		(<any>this.settingsForm.controls['freightRate']).updateValue(this.model.freightRate);

		(<any>this.settingsForm.controls['apiLayerAccessKey']).updateValue(this.model.apiLayerAccessKey);
		(<any>this.settingsForm.controls['senderName']).updateValue(this.model.senderName);
		(<any>this.settingsForm.controls['senderPhone']).updateValue(this.model.senderPhone);

		(<any>this.settingsForm.controls['flywayUri']).updateValue(this.model.flywayUri);
		(<any>this.settingsForm.controls['flywayCode']).updateValue(this.model.flywayCode);
		(<any>this.settingsForm.controls['efsPostUri']).updateValue(this.model.efsPostUri);
		(<any>this.settingsForm.controls['ztoUri']).updateValue(this.model.ztoUri);
		(<any>this.settingsForm.controls['nzstCode']).updateValue(this.model.nzstCode);
		(<any>this.settingsForm.controls['nzstUri']).updateValue(this.model.nzstUri);
		(<any>this.settingsForm.controls['ftdUri']).updateValue(this.model.ftdUri);

		(<any>this.settingsForm.controls['productItemsPerPage']).updateValue(this.model.productItemsPerPage);
		(<any>this.settingsForm.controls['ordersItemsPerPage']).updateValue(this.model.ordersItemsPerPage);
		(<any>this.settingsForm.controls['exchangeHistoriesItemsPerPage']).updateValue(this.model.exchangeHistoriesItemsPerPage);
	}
}