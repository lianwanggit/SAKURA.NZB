"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
require("rxjs/Rx");
var http_1 = require("@angular/http");
var core_1 = require("@angular/core");
exports.CUSTOMERS_ENDPOINT = "api/customers/";
exports.BRANDS_ENDPOINT = "api/brands/";
exports.PRODUCTS_ENDPOINT = "api/products/";
exports.PRODUCTS_SEARCH_ENDPOINT = "api/products/search/";
exports.PRODUCTS_BRIEF_ENDPOINT = "api/products/get-brief/";
exports.PRODUCTS_GET_BY_BRAND_ENDPOINT = "api/products/get-by-brand/";
exports.CATEGORIES_ENDPOINT = "api/categories/";
exports.SUPPLIERS_ENDPOINT = "api/suppliers/";
exports.ORDERS_ENDPOINT = "api/orders/";
exports.ORDERS_SEARCH_ENDPOINT = "api/orders/search/";
exports.ORDERS_STATUS_ENDPOINT = "api/dashboard/order-status/";
exports.ORDER_DELIVER_ENDPOINT = "api/orders/deliver/";
exports.ORDER_UPDATE_STATUS_ENDPOINT = "api/orders/update-order-status/";
exports.ORDER_GET_LATEST_BY_PRODUCT_ENDPOINT = "api/orders/get-latest-by-product/";
exports.EXPRESS_TRACK_ENDPOINT = "api/expresstrack/";
exports.EXCHANGEHISTORIES_ENDPOINT = "api/exchangehistories/";
exports.EXCHANGEHISTORIES_SUMMARY_ENDPOINT = "api/exchangehistories/summary/";
exports.EXCHANGEHISTORIES_SEARCH_ENDPOINT = "api/exchangehistories/search/";
exports.DASHBOARD_SUMMARY_ENDPOINT = "api/dashboard/summary/";
exports.DASHBOARD_ANNUAL_SALES_ENDPOINT = "api/dashboard/annual-sales/";
exports.DASHBOARD_TOP_SALE_PRODUCTS_ENDPOINT = "api/dashboard/top-sale-products/";
exports.DASHBOARD_TOP_SALE_BRANDS_ENDPOINT = "api/dashboard/top-sale-brands/";
exports.DASHBOARD_PAST_30_DAYS_PROFIT_ENDPOINT = "api/dashboard/past-30days-profit/";
exports.DASHBOARD_PAST_30_DAYS_EXCHANGE_ENDPOINT = "api/dashboard/past-30days-exchange/";
exports.SETTINGS_ENDPOINT = "api/settings/";
var ApiService = (function () {
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
exports.ApiService = ApiService;
//# sourceMappingURL=api.service.js.map