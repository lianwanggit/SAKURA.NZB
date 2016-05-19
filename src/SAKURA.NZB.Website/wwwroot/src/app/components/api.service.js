System.register(["rxjs/Rx", "angular2/http", "angular2/core"], function(exports_1, context_1) {
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
    var http_1, core_1;
    var CUSTOMERS_ENDPOINT, BRANDS_ENDPOINT, PRODUCTS_ENDPOINT, PRODUCTS_SEARCH_ENDPOINT, PRODUCTS_BRIEF_ENDPOINT, PRODUCTS_GET_BY_BRAND_ENDPOINT, CATEGORIES_ENDPOINT, SUPPLIERS_ENDPOINT, ORDERS_ENDPOINT, ORDERS_SEARCH_ENDPOINT, ORDERS_STATUS_ENDPOINT, ORDER_DELIVER_ENDPOINT, ORDER_UPDATE_STATUS_ENDPOINT, ORDER_GET_LATEST_BY_PRODUCT_ENDPOINT, EXPRESS_TRACK_ENDPOINT, DASHBOARD_SUMMARY_ENDPOINT, DASHBOARD_ANNUAL_SALES_ENDPOINT, DASHBOARD_TOP_SALE_PRODUCTS_ENDPOINT, DASHBOARD_TOP_SALE_BRANDS_ENDPOINT, DASHBOARD_PAST_30_DAYS_PROFIT_ENDPOINT, DASHBOARD_PAST_30_DAYS_EXCHANGE_ENDPOINT, ApiService;
    return {
        setters:[
            function (_1) {},
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            exports_1("CUSTOMERS_ENDPOINT", CUSTOMERS_ENDPOINT = "api/customers/");
            exports_1("BRANDS_ENDPOINT", BRANDS_ENDPOINT = "api/brands/");
            exports_1("PRODUCTS_ENDPOINT", PRODUCTS_ENDPOINT = "api/products/");
            exports_1("PRODUCTS_SEARCH_ENDPOINT", PRODUCTS_SEARCH_ENDPOINT = "api/products/search/");
            exports_1("PRODUCTS_BRIEF_ENDPOINT", PRODUCTS_BRIEF_ENDPOINT = "api/products/get-brief/");
            exports_1("PRODUCTS_GET_BY_BRAND_ENDPOINT", PRODUCTS_GET_BY_BRAND_ENDPOINT = "api/products/get-by-brand/");
            exports_1("CATEGORIES_ENDPOINT", CATEGORIES_ENDPOINT = "api/categories/");
            exports_1("SUPPLIERS_ENDPOINT", SUPPLIERS_ENDPOINT = "api/suppliers/");
            exports_1("ORDERS_ENDPOINT", ORDERS_ENDPOINT = "api/orders/");
            exports_1("ORDERS_SEARCH_ENDPOINT", ORDERS_SEARCH_ENDPOINT = "api/orders/search/");
            exports_1("ORDERS_STATUS_ENDPOINT", ORDERS_STATUS_ENDPOINT = "api/dashboard/order-status/");
            exports_1("ORDER_DELIVER_ENDPOINT", ORDER_DELIVER_ENDPOINT = "api/orders/deliver/");
            exports_1("ORDER_UPDATE_STATUS_ENDPOINT", ORDER_UPDATE_STATUS_ENDPOINT = "api/orders/update-order-status/");
            exports_1("ORDER_GET_LATEST_BY_PRODUCT_ENDPOINT", ORDER_GET_LATEST_BY_PRODUCT_ENDPOINT = "api/orders/get-latest-by-product/");
            exports_1("EXPRESS_TRACK_ENDPOINT", EXPRESS_TRACK_ENDPOINT = "api/expresstrack/");
            exports_1("DASHBOARD_SUMMARY_ENDPOINT", DASHBOARD_SUMMARY_ENDPOINT = "api/dashboard/summary/");
            exports_1("DASHBOARD_ANNUAL_SALES_ENDPOINT", DASHBOARD_ANNUAL_SALES_ENDPOINT = "api/dashboard/annual-sales/");
            exports_1("DASHBOARD_TOP_SALE_PRODUCTS_ENDPOINT", DASHBOARD_TOP_SALE_PRODUCTS_ENDPOINT = "api/dashboard/top-sale-products/");
            exports_1("DASHBOARD_TOP_SALE_BRANDS_ENDPOINT", DASHBOARD_TOP_SALE_BRANDS_ENDPOINT = "api/dashboard/top-sale-brands/");
            exports_1("DASHBOARD_PAST_30_DAYS_PROFIT_ENDPOINT", DASHBOARD_PAST_30_DAYS_PROFIT_ENDPOINT = "api/dashboard/past-30days-profit/");
            exports_1("DASHBOARD_PAST_30_DAYS_EXCHANGE_ENDPOINT", DASHBOARD_PAST_30_DAYS_EXCHANGE_ENDPOINT = "api/dashboard/past-30days-exchange/");
            ApiService = (function () {
                function ApiService(http) {
                    this.http = http;
                }
                ApiService.prototype.get = function (onNext) {
                    this.http.get("api/random").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ApiService);
                return ApiService;
            }());
            exports_1("ApiService", ApiService);
        }
    }
});
//# sourceMappingURL=api.service.js.map