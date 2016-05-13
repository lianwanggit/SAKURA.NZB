/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/http', 'angular2/router', "../api.service", "../../directives/alphaIndexer.directive", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, http_1, router_1, api_service_1, alphaIndexer_directive_1;
    var Customer, CustomerEditComponent;
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
            function (alphaIndexer_directive_1_1) {
                alphaIndexer_directive_1 = alphaIndexer_directive_1_1;
            },
            function (_1) {}],
        execute: function() {
            Customer = (function () {
                function Customer(obj) {
                    this.id = obj.id;
                    this.fullName = obj.fullName;
                    this.namePinYin = obj.namePinYin;
                    this.phone1 = obj.phone1;
                    this.phone2 = obj.phone2;
                    this.address = obj.address;
                    this.address1 = obj.address1;
                    this.email = obj.email;
                    this.isIdentityUploaded = obj.isIdentityUploaded;
                    this.level = obj.level;
                    this.description = obj.description;
                }
                return Customer;
            }());
            exports_1("Customer", Customer);
            CustomerEditComponent = (function () {
                function CustomerEditComponent(http, router, params) {
                    this.http = http;
                    this.router = router;
                    this.model = new Customer({
                        "id": 0, "fullName": null, "namePinYin": null, "phone1": null, "phone2": null,
                        "address": null, "address1": null, "email": null, "isIdentityUploaded": false, "level": null, "description": null
                    });
                    this.editMode = false;
                    this.isCustomerLoading = true;
                    this.isListLoading = true;
                    this.customerId = params.get("id");
                    if (this.customerId) {
                        this.editMode = true;
                    }
                    else {
                        this.isCustomerLoading = false;
                        this.isListLoading = false;
                    }
                }
                CustomerEditComponent.prototype.ngOnInit = function () {
                    if (this.editMode) {
                        this.getCustomer(this.customerId);
                        this.getCustomers();
                    }
                };
                CustomerEditComponent.prototype.getCustomer = function (id) {
                    var _this = this;
                    var that = this;
                    this.http.get(api_service_1.CUSTOMERS_ENDPOINT + id)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isCustomerLoading = false;
                        if (!json)
                            return;
                        that.model = new Customer(json);
                    }, function (error) {
                        _this.isCustomerLoading = false;
                        console.log(error);
                    });
                };
                CustomerEditComponent.prototype.getCustomers = function () {
                    var _this = this;
                    var that = this;
                    this.http.get(api_service_1.CUSTOMERS_ENDPOINT)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isListLoading = false;
                        if (!json)
                            return;
                        var list = [].ToList();
                        json.forEach(function (x) {
                            var c = new Customer(x);
                            list.Add(new alphaIndexer_directive_1.Element(c.id, c.fullName, c.namePinYin));
                        });
                        that.elementSource = list.ToArray();
                    }, function (error) {
                        _this.isListLoading = false;
                        console.log(error);
                    });
                };
                CustomerEditComponent.prototype.onElementSelected = function (id) {
                    this.getCustomer(id);
                };
                CustomerEditComponent.prototype.onSubmit = function () {
                    var _this = this;
                    var that = this;
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    if (!this.editMode)
                        this.http
                            .post(api_service_1.CUSTOMERS_ENDPOINT, JSON.stringify(this.model, this.emptyStringToNull), { headers: headers })
                            .map(function (res) { return res.json(); })
                            .subscribe(function (response) { return _this.router.navigate(['客户']); }, function (error) { return console.error(error); });
                    else
                        this.http.put(api_service_1.CUSTOMERS_ENDPOINT + this.customerId, JSON.stringify(this.model, this.emptyStringToNull), { headers: headers })
                            .subscribe(function (response) { return _this.router.navigate(['客户']); }, function (error) { return console.error(error); });
                };
                CustomerEditComponent.prototype.emptyStringToNull = function (key, value) {
                    return value === "" ? null : value;
                };
                Object.defineProperty(CustomerEditComponent.prototype, "data", {
                    get: function () { return JSON.stringify(this.model); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CustomerEditComponent.prototype, "title", {
                    get: function () { return (this.model && this.editMode) ? "编辑用户 - " + this.model.fullName : "新建用户"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(CustomerEditComponent.prototype, "isLoading", {
                    get: function () { return this.isCustomerLoading || this.isListLoading; },
                    enumerable: true,
                    configurable: true
                });
                CustomerEditComponent = __decorate([
                    core_1.Component({
                        selector: "customer-edit",
                        templateUrl: "./src/app/components/customers/edit.html",
                        styleUrls: ["./src/app/components/customers/customers.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES, alphaIndexer_directive_1.AlphaIndexerDirective]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, router_1.Router, router_1.RouteParams])
                ], CustomerEditComponent);
                return CustomerEditComponent;
            }());
            exports_1("CustomerEditComponent", CustomerEditComponent);
        }
    }
});
//# sourceMappingURL=edit.component.js.map