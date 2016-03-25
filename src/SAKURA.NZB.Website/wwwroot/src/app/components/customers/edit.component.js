/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", "../api.service", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, api_service_1;
    var Customer, CustomerEditComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (_1) {}],
        execute: function() {
            Customer = (function () {
                function Customer(obj) {
                    this.id = obj.Id;
                    this.name = obj.FullName;
                    this.pinyin = obj.NamePinYin;
                    this.tel = obj.Phone1;
                    this.address = obj.Address;
                    this.index = this.pinyin ? this.pinyin.charAt(0).toUpperCase() : 'A';
                }
                return Customer;
            })();
            exports_1("Customer", Customer);
            CustomerEditComponent = (function () {
                function CustomerEditComponent(service) {
                    this.service = service;
                    this.customerList = [];
                    this.searchList = [];
                    this.filterText = '';
                    this.totalAmount = 0;
                    this.isListViewMode = true;
                    this._filterText = '';
                }
                CustomerEditComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                CustomerEditComponent.prototype.get = function () {
                    var that = this;
                    this.service.getCustomers(function (json) {
                        if (json) {
                            json.forEach(function (c) {
                                that.customerList.push(new Customer(c));
                            });
                            that.totalAmount = that.customerList.length;
                            that.searchList = that.customerList.ToList()
                                .OrderBy(function (x) { return x.pinyin; })
                                .ToArray();
                            ;
                        }
                    });
                };
                CustomerEditComponent.prototype.startsWith = function (str, searchString) {
                    return str.substr(0, searchString.length) === searchString;
                };
                ;
                Object.defineProperty(CustomerEditComponent.prototype, "amount", {
                    get: function () { return this.searchList.length; },
                    enumerable: true,
                    configurable: true
                });
                CustomerEditComponent = __decorate([
                    core_1.Component({
                        selector: "customer-edit",
                        templateUrl: "./src/app/components/customers/edit.html",
                        styleUrls: ["./css/customers.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService])
                ], CustomerEditComponent);
                return CustomerEditComponent;
            })();
            exports_1("CustomerEditComponent", CustomerEditComponent);
        }
    }
});
//# sourceMappingURL=edit.component.js.map