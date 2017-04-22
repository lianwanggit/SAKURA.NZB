System.register(["angular2/core", "angular2/common", 'angular2/http', "../api.service", "../../validators/numberValidator", 'ng2-bootstrap/ng2-bootstrap'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, http_1, api_service_1, numberValidator_1, ng2_bootstrap_1;
    var Settings, SettingsComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (numberValidator_1_1) {
                numberValidator_1 = numberValidator_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            }],
        execute: function() {
            Settings = (function () {
                function Settings(fixedRateLow, fixedRateHigh, freightRate, apiLayerAccessKey, senderName, senderPhone, flywayUri, flywayCode, efsPostUri, ztoUri, nzstCode, nzstUri, ftdUri, nsfUri, wdlUri, productItemsPerPage, ordersItemsPerPage, exchangeHistoriesItemsPerPage) {
                    this.fixedRateLow = fixedRateLow;
                    this.fixedRateHigh = fixedRateHigh;
                    this.freightRate = freightRate;
                    this.apiLayerAccessKey = apiLayerAccessKey;
                    this.senderName = senderName;
                    this.senderPhone = senderPhone;
                    this.flywayUri = flywayUri;
                    this.flywayCode = flywayCode;
                    this.efsPostUri = efsPostUri;
                    this.ztoUri = ztoUri;
                    this.nzstCode = nzstCode;
                    this.nzstUri = nzstUri;
                    this.ftdUri = ftdUri;
                    this.nsfUri = nsfUri;
                    this.wdlUri = wdlUri;
                    this.productItemsPerPage = productItemsPerPage;
                    this.ordersItemsPerPage = ordersItemsPerPage;
                    this.exchangeHistoriesItemsPerPage = exchangeHistoriesItemsPerPage;
                }
                return Settings;
            }());
            SettingsComponent = (function () {
                function SettingsComponent(http, fb) {
                    this.http = http;
                    this.model = null;
                    this.isLoading = true;
                    this.settingsForm = fb.group({
                        fixedRateLow: [null, numberValidator_1.NumberValidator.unspecified],
                        fixedRateHigh: [null, numberValidator_1.NumberValidator.unspecified],
                        freightRate: [null, numberValidator_1.NumberValidator.unspecified],
                        apiLayerAccessKey: [null, common_1.Validators.required],
                        senderName: [null, common_1.Validators.required],
                        senderPhone: [null, common_1.Validators.required],
                        flywayUri: [null, common_1.Validators.required],
                        flywayCode: [null, common_1.Validators.required],
                        efsPostUri: [null, common_1.Validators.required],
                        ztoUri: [null, common_1.Validators.required],
                        nzstCode: [null, common_1.Validators.required],
                        nzstUri: [null, common_1.Validators.required],
                        ftdUri: [null, common_1.Validators.required],
                        nsfUri: [null, common_1.Validators.required],
                        wdlUri: [null, common_1.Validators.required],
                        productItemsPerPage: [null, numberValidator_1.PositiveNumberValidator.unspecified],
                        ordersItemsPerPage: [null, numberValidator_1.PositiveNumberValidator.unspecified],
                        exchangeHistoriesItemsPerPage: [null, numberValidator_1.PositiveNumberValidator.unspecified],
                    });
                }
                SettingsComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                SettingsComponent.prototype.onSubmit = function () {
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
                    this.model.nsfUri = this.settingsForm.value.nsfUri;
                    this.model.wdlUri = this.settingsForm.value.wdlUri;
                    this.model.productItemsPerPage = this.settingsForm.value.productItemsPerPage;
                    this.model.ordersItemsPerPage = this.settingsForm.value.ordersItemsPerPage;
                    this.model.exchangeHistoriesItemsPerPage = this.settingsForm.value.exchangeHistoriesItemsPerPage;
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    this.http
                        .post(api_service_1.SETTINGS_ENDPOINT, JSON.stringify(this.model), { headers: headers })
                        .subscribe(function (response) { return that.get(); }, function (error) { return console.error(error); });
                };
                SettingsComponent.prototype.onCancel = function () {
                    this.updateForm();
                };
                SettingsComponent.prototype.get = function () {
                    var _this = this;
                    this.http.get(api_service_1.SETTINGS_ENDPOINT)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isLoading = false;
                        if (!json)
                            return;
                        _this.model = new Settings(json.fixedRateLow, json.fixedRateHigh, json.freightRate, json.apiLayerAccessKey, json.senderName, json.senderPhone, json.flywayUri, json.flywayCode, json.efsPostUri, json.ztoUri, json.nzstCode, json.nzstUri, json.ftdUri, json.nsfUri, json.wdlUri, json.productItemsPerPage, json.ordersItemsPerPage, json.exchangeHistoriesItemsPerPage);
                        _this.updateForm();
                    }, function (error) {
                        _this.isLoading = false;
                        console.log(error);
                    });
                };
                SettingsComponent.prototype.updateForm = function () {
                    this.settingsForm.controls['fixedRateLow'].updateValue(this.model.fixedRateLow);
                    this.settingsForm.controls['fixedRateHigh'].updateValue(this.model.fixedRateHigh);
                    this.settingsForm.controls['freightRate'].updateValue(this.model.freightRate);
                    this.settingsForm.controls['apiLayerAccessKey'].updateValue(this.model.apiLayerAccessKey);
                    this.settingsForm.controls['senderName'].updateValue(this.model.senderName);
                    this.settingsForm.controls['senderPhone'].updateValue(this.model.senderPhone);
                    this.settingsForm.controls['flywayUri'].updateValue(this.model.flywayUri);
                    this.settingsForm.controls['flywayCode'].updateValue(this.model.flywayCode);
                    this.settingsForm.controls['efsPostUri'].updateValue(this.model.efsPostUri);
                    this.settingsForm.controls['ztoUri'].updateValue(this.model.ztoUri);
                    this.settingsForm.controls['nzstCode'].updateValue(this.model.nzstCode);
                    this.settingsForm.controls['nzstUri'].updateValue(this.model.nzstUri);
                    this.settingsForm.controls['ftdUri'].updateValue(this.model.ftdUri);
                    this.settingsForm.controls['nsfUri'].updateValue(this.model.nsfUri);
                    this.settingsForm.controls['wdlUri'].updateValue(this.model.wdlUri);
                    this.settingsForm.controls['productItemsPerPage'].updateValue(this.model.productItemsPerPage);
                    this.settingsForm.controls['ordersItemsPerPage'].updateValue(this.model.ordersItemsPerPage);
                    this.settingsForm.controls['exchangeHistoriesItemsPerPage'].updateValue(this.model.exchangeHistoriesItemsPerPage);
                };
                SettingsComponent = __decorate([
                    core_1.Component({
                        selector: "settings",
                        templateUrl: "./src/app/components/settings/settings.html",
                        styleUrls: ["./src/app/components/settings/settings.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, ng2_bootstrap_1.ACCORDION_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, common_1.FormBuilder])
                ], SettingsComponent);
                return SettingsComponent;
            }());
            exports_1("SettingsComponent", SettingsComponent);
        }
    }
});
//# sourceMappingURL=settings.component.js.map