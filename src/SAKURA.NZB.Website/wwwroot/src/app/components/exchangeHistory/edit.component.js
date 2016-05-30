/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/http', 'angular2/router', "../api.service", "../../validators/numberValidator", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, http_1, router_1, api_service_1, numberValidator_1;
    var ExchangeHistory, ExchangeHistoryEditComponent;
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
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (numberValidator_1_1) {
                numberValidator_1 = numberValidator_1_1;
            },
            function (_1) {}],
        execute: function() {
            ExchangeHistory = (function () {
                function ExchangeHistory(obj) {
                    this.id = obj.id;
                    this.cny = obj.cny;
                    this.nzd = obj.nzd;
                    this.rate = obj.rate;
                    this.sponsorCharge = obj.sponsorCharge;
                    this.receiverCharge = obj.receiverCharge;
                    this.agent = obj.agent;
                    this.createdTime = obj.createdTime;
                }
                return ExchangeHistory;
            }());
            exports_1("ExchangeHistory", ExchangeHistory);
            ExchangeHistoryEditComponent = (function () {
                function ExchangeHistoryEditComponent(http, fb, router, params) {
                    this.http = http;
                    this.router = router;
                    this.model = new ExchangeHistory({
                        "id": 0, "cny": null, "nzd": null, "rate": 0, "sponsorCharge": null,
                        "receiverCharge": null, "agent": null, "createdTime": new Date()
                    });
                    this.editMode = false;
                    this.isLoading = true;
                    this.isCreatedDateValid = true;
                    this.historyId = params.get("id");
                    if (this.historyId) {
                        this.editMode = true;
                    }
                    else {
                        this.isLoading = false;
                    }
                    this.historyForm = fb.group({
                        cny: [null, numberValidator_1.PositiveNumberValidator.unspecified],
                        sponsorCharge: [150, numberValidator_1.NumberValidator.unspecified],
                        nzd: [null, numberValidator_1.PositiveNumberValidator.unspecified],
                        receiverCharge: [20, numberValidator_1.NumberValidator.unspecified],
                        agent: [null, common_1.Validators.required],
                    });
                }
                ExchangeHistoryEditComponent.prototype.ngOnInit = function () {
                    if (this.editMode) {
                        this.getHistory(this.historyId);
                    }
                };
                ExchangeHistoryEditComponent.prototype.ngAfterViewInit = function () {
                    this.initialiseDatePicker();
                };
                ExchangeHistoryEditComponent.prototype.getHistory = function (id) {
                    var _this = this;
                    var that = this;
                    this.http.get(api_service_1.EXCHANGEHISTORIES_ENDPOINT + id)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isLoading = false;
                        if (!json)
                            return;
                        that.model = new ExchangeHistory(json);
                        jQuery('#createdDate').data("DateTimePicker").date(moment(that.model.createdTime));
                        that.historyForm.controls['cny'].updateValue(that.model.cny);
                        that.historyForm.controls['sponsorCharge'].updateValue(that.model.sponsorCharge);
                        that.historyForm.controls['nzd'].updateValue(that.model.nzd);
                        that.historyForm.controls['receiverCharge'].updateValue(that.model.receiverCharge);
                        that.historyForm.controls['agent'].updateValue(that.model.agent);
                    }, function (error) {
                        _this.isLoading = false;
                        console.log(error);
                    });
                };
                ExchangeHistoryEditComponent.prototype.onSubmit = function () {
                    var _this = this;
                    var that = this;
                    this.model.cny = this.historyForm.value.cny;
                    this.model.sponsorCharge = this.historyForm.value.sponsorCharge;
                    this.model.nzd = this.historyForm.value.nzd;
                    this.model.receiverCharge = this.historyForm.value.receiverCharge;
                    this.model.agent = this.historyForm.value.agent;
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    if (!this.editMode)
                        this.http
                            .post(api_service_1.EXCHANGEHISTORIES_ENDPOINT, JSON.stringify(this.model, this.emptyStringToNull), { headers: headers })
                            .subscribe(function (response) { return _this.router.navigate(['换汇记录']); }, function (error) { return console.error(error); });
                    else
                        this.http.put(api_service_1.EXCHANGEHISTORIES_ENDPOINT + this.historyId, JSON.stringify(this.model, this.emptyStringToNull), { headers: headers })
                            .subscribe(function (response) { return _this.router.navigate(['换汇记录']); }, function (error) { return console.error(error); });
                };
                ExchangeHistoryEditComponent.prototype.onDelete = function () {
                    var _this = this;
                    if (this.editMode)
                        this.http
                            .delete(api_service_1.EXCHANGEHISTORIES_ENDPOINT + this.historyId)
                            .subscribe(function (response) { return _this.router.navigate(['换汇记录']); }, function (error) { return console.error(error); });
                };
                ExchangeHistoryEditComponent.prototype.initialiseDatePicker = function () {
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
                        }
                        else {
                            that.isCreatedDateValid = true;
                            that.model.createdTime = e.date.toDate();
                        }
                    });
                };
                ExchangeHistoryEditComponent.prototype.emptyStringToNull = function (key, value) {
                    return value === "" ? null : value;
                };
                Object.defineProperty(ExchangeHistoryEditComponent.prototype, "data", {
                    get: function () { return JSON.stringify(this.model); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExchangeHistoryEditComponent.prototype, "title", {
                    get: function () { return (this.model && this.editMode) ? "编辑换汇记录" : "新建换汇记录"; },
                    enumerable: true,
                    configurable: true
                });
                ExchangeHistoryEditComponent = __decorate([
                    core_1.Component({
                        selector: "customer-edit",
                        templateUrl: "./src/app/components/exchangehistory/edit.html",
                        styleUrls: ["./src/app/components/exchangehistory/edit.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, common_1.FormBuilder, router_1.Router, router_1.RouteParams])
                ], ExchangeHistoryEditComponent);
                return ExchangeHistoryEditComponent;
            }());
            exports_1("ExchangeHistoryEditComponent", ExchangeHistoryEditComponent);
        }
    }
});
//# sourceMappingURL=edit.component.js.map