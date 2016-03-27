System.register(["rxjs/Rx", "angular2/http", "angular2/core"], function(exports_1) {
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
    var ApiService;
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
            ApiService = (function () {
                function ApiService(http) {
                    this.http = http;
                }
                ApiService.prototype.get = function (onNext) {
                    this.http.get("api/random").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getCustomers = function (onNext) {
                    this.http.get("api/Customers").map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.getCustomer = function (id, onNext) {
                    this.http.get("api/Customers/" + id).map(function (response) { return response.json(); }).subscribe(onNext);
                };
                ApiService.prototype.postCustomer = function (data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.post('api/Customers', data, { headers: headers });
                };
                ApiService.prototype.putCustomer = function (id, data) {
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    return this.http.put('api/Customers/' + id, data, { headers: headers });
                };
                ApiService = __decorate([
                    core_1.Injectable(), 
                    __metadata('design:paramtypes', [http_1.Http])
                ], ApiService);
                return ApiService;
            })();
            exports_1("ApiService", ApiService);
        }
    }
});
//# sourceMappingURL=api.service.js.map