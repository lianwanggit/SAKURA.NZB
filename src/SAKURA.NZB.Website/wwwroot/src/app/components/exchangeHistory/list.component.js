/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/http', 'angular2/router', "../api.service", 'ng2-bootstrap/ng2-bootstrap', '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, http_1, router_1, api_service_1, ng2_bootstrap_1;
    var ExchangeHistory, ExchangeSummary, ExchangeHistoriesComponent;
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
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
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
            ExchangeSummary = (function () {
                function ExchangeSummary(obj) {
                    this.totalNzd = obj.totalNzd;
                    this.totalCny = obj.totalCny;
                    this.rate = obj.rate;
                }
                return ExchangeSummary;
            }());
            exports_1("ExchangeSummary", ExchangeSummary);
            ExchangeHistoriesComponent = (function () {
                function ExchangeHistoriesComponent(http, router) {
                    this.http = http;
                    this.router = router;
                    this.historyList = [];
                    this.historySummary = null;
                    this.totalAmount = 0;
                    this.isListLoading = true;
                    this.isSummaryLoading = true;
                    this.page = 1;
                    this.prevItems = [].ToList();
                    this.nextItems = [].ToList();
                    this.itemsPerPage = 0;
                    this.totalItemCount = 0;
                    this._isPrevItemsLoaded = false;
                    this._isNextItemsLoaded = false;
                }
                ExchangeHistoriesComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                ExchangeHistoriesComponent.prototype.get = function () {
                    var _this = this;
                    this._isPrevItemsLoaded = false;
                    this._isNextItemsLoaded = false;
                    var that = this;
                    this.http.get(api_service_1.EXCHANGEHISTORIES_SEARCH_ENDPOINT + this.page)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isListLoading = false;
                        if (!json)
                            return;
                        that.historyList = [];
                        that.prevItems = [].ToList();
                        that.nextItems = [].ToList();
                        if (json.items) {
                            json.items.forEach(function (c) {
                                that.historyList.push(new ExchangeHistory(c));
                            });
                        }
                        if (json.prevItems) {
                            json.prevItems.forEach(function (c) {
                                that.prevItems.Add(new ExchangeHistory(c));
                            });
                            that._isPrevItemsLoaded = true;
                        }
                        if (json.nextItems) {
                            json.nextItems.forEach(function (c) {
                                that.nextItems.Add(new ExchangeHistory(c));
                            });
                            that._isNextItemsLoaded = true;
                        }
                        that.itemsPerPage = json.itemsPerPage;
                        that.totalItemCount = json.totalItemCount;
                    }, function (error) {
                        _this.isListLoading = false;
                        console.log(error);
                    });
                    this.http.get(api_service_1.EXCHANGEHISTORIES_SUMMARY_ENDPOINT)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isSummaryLoading = false;
                        if (!json)
                            return;
                        that.historySummary = new ExchangeSummary(json);
                    }, function (error) {
                        _this.isSummaryLoading = false;
                        console.log(error);
                    });
                };
                ExchangeHistoriesComponent.prototype.onPageChanged = function (event) {
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
                ;
                Object.defineProperty(ExchangeHistoriesComponent.prototype, "isLoading", {
                    get: function () { return this.isListLoading || this.isSummaryLoading; },
                    enumerable: true,
                    configurable: true
                });
                ExchangeHistoriesComponent = __decorate([
                    core_1.Component({
                        selector: "customers",
                        templateUrl: "./src/app/components/exchangeHistory/list.html",
                        styleUrls: ["./src/app/components/exchangeHistory/list.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES, ng2_bootstrap_1.PAGINATION_DIRECTIVES]
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