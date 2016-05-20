/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/http', 'angular2/router', "../api.service", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, http_1, router_1, api_service_1;
    var ExchangeHistory, ExchangeHistoriesComponent;
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
            function (_1) {}],
        execute: function() {
            ExchangeHistory = (function () {
                function ExchangeHistory(obj) {
                    this.id = obj.id;
                    this.cny = obj.cny;
                    this.nzd = obj.nzd;
                    this.rate = obj.rate;
                    this.sponsorCharge = obj.sponsorCharge;
                    this.receiverCharge = obj.sponsorCharge;
                    this.agent = obj.agent;
                    this.createdTime = moment(obj.sponsorCharge).format('YYYY-MM-DD');
                }
                return ExchangeHistory;
            }());
            exports_1("ExchangeHistory", ExchangeHistory);
            ExchangeHistoriesComponent = (function () {
                function ExchangeHistoriesComponent(http, router) {
                    this.http = http;
                    this.router = router;
                    this.historyList = [];
                    this.filterText = '';
                    this.totalAmount = 0;
                    this.isLoading = true;
                    this._filterText = '';
                }
                ExchangeHistoriesComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                ExchangeHistoriesComponent.prototype.get = function () {
                    var _this = this;
                    var that = this;
                    this.http.get(api_service_1.EXCHANGERATE_ENDPOINT)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isLoading = false;
                        if (!json)
                            return;
                        json.forEach(function (c) {
                            that.historyList.push(new ExchangeHistory(c));
                        });
                        that.totalAmount = that.historyList.length;
                    }, function (error) {
                        _this.isLoading = false;
                        console.log(error);
                    });
                };
                ExchangeHistoriesComponent = __decorate([
                    core_1.Component({
                        selector: "customers",
                        templateUrl: "./src/app/components/exchangeHistory/list.html",
                        styleUrls: ["./src/app/components/exchangeHistory/list.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, router_1.Router])
                ], ExchangeHistoriesComponent);
                return ExchangeHistoriesComponent;
            }());
            exports_1("ExchangeHistoriesComponent", ExchangeHistoriesComponent);
        }
    }
});
//# sourceMappingURL=list.component.js.map