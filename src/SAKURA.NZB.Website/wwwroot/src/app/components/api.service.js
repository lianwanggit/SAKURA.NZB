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
    var GET_CUSTOMERS, ApiService;
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
            exports_1("GET_CUSTOMERS", GET_CUSTOMERS = "api/customers");
            ApiService = (function () {
                function ApiService(http) {
                    this.http = http;
                }
                ApiService.prototype.get = function (onNext) {
                    this.http.get("api/random").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getCustomers = function (onNext) {
                    this.http.get("api/customers").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getCustomer = function (id, onNext) {
                    this.http.get("api/customers/" + id).map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.postCustomer = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post('api/customers', data, { headers: headers });
                };
                ApiService.prototype.putCustomer = function (id, data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.put('api/customers/' + id, data, { headers: headers });
                };
                ApiService.prototype.getProducts = function (onNext) {
                    this.http.get("api/products").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getProduct = function (id, onNext) {
                    this.http.get("api/products/" + id).map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getProductsBrief = function (onNext) {
                    this.http.get("api/products/get-brief").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.postProduct = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post('api/products', data, { headers: headers });
                };
                ApiService.prototype.putProduct = function (id, data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.put('api/products/' + id, data, { headers: headers });
                };
                ApiService.prototype.getCategories = function (onNext) {
                    this.http.get("api/categories").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.postCategory = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post('api/categories', data, { headers: headers });
                };
                ApiService.prototype.putCategory = function (id, data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.put('api/categories/' + id, data, { headers: headers });
                };
                ApiService.prototype.getBrands = function (onNext) {
                    this.http.get("api/brands").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.postBrand = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post('api/brands', data, { headers: headers });
                };
                ApiService.prototype.putBrand = function (id, data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.put('api/brands/' + id, data, { headers: headers });
                };
                ApiService.prototype.getSuppliers = function (onNext) {
                    this.http.get("api/suppliers").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.postSupplier = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post('api/suppliers', data, { headers: headers });
                };
                ApiService.prototype.putSupplier = function (id, data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.put('api/suppliers/' + id, data, { headers: headers });
                };
                ApiService.prototype.getLatestExchangeRates = function (onNext) {
                    this.http.get("api/exchangerates/latest").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getOrders = function (onNext) {
                    this.http.get("api/orders").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getOrder = function (id, onNext) {
                    this.http.get("api/orders/" + id).map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getSenderInfo = function (onNext) {
                    this.http.get("api/orders/get-sender-info").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getSearchOrders = function (keyword, orderState, paymentState, onNext) {
                    this.http.get("api/orders/search/" + keyword + '?orderState=' + orderState + '&paymentState=' + paymentState)
                        .map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.postUpdateOrderStatus = function (data, onNext) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    this.http.post('api/orders/update-order-status', data, { headers: headers })
                        .map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.postDeliverOrder = function (data, onNext) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    this.http.post('api/orders/deliver', data, { headers: headers })
                        .map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.postOrder = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post('api/orders', data, { headers: headers });
                };
                ApiService.prototype.putOrder = function (id, data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.put('api/orders/' + id, data, { headers: headers });
                };
                ApiService.prototype.deleteOrder = function (id) {
                    return this.http.delete('api/orders/' + id);
                };
                ApiService.prototype.getDashboardSummary = function (onNext) {
                    this.http.get("api/dashboard/summary").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getDashboardAnnualSales = function (onNext) {
                    this.http.get("api/dashboard/annual-sales").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getDashboardTopSaleProducts = function (onNext) {
                    this.http.get("api/dashboard/top-sale-products").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getDashboardTopSaleBrands = function (onNext) {
                    this.http.get("api/dashboard/top-sale-brands").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getDashboardPast30DaysProfit = function (onNext) {
                    this.http.get("api/dashboard/past-30days-profit").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getDashboardPast30DaysExchange = function (onNext) {
                    this.http.get("api/dashboard/past-30days-exchange").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getDashboardOrderStatus = function (onNext) {
                    this.http.get("api/dashboard/order-status").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getExpressTrack = function (id, onNext) {
                    this.http.get("api/expresstrack/" + id).map(function (response) { return response.json(); }).subscribe(onNext);
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