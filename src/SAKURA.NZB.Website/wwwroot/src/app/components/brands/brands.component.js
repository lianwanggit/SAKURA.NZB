/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", "../api.service", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, api_service_1;
    var Brand, BrandsComponent;
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
            Brand = (function () {
                function Brand(id, name) {
                    this.id = id;
                    this.name = name;
                }
                return Brand;
            }());
            BrandsComponent = (function () {
                function BrandsComponent(service) {
                    this.service = service;
                    this.brandList = [];
                    this.searchList = [];
                    this.filterText = '';
                    this.totalAmount = 0;
                    this._filterText = '';
                }
                BrandsComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                BrandsComponent.prototype.onClearFilter = function () {
                    this.onSearch('');
                };
                BrandsComponent.prototype.onSearch = function (value) {
                    var _this = this;
                    if (this.filterText !== value)
                        this.filterText = value;
                    if (this.filterText === this._filterText)
                        return;
                    this.searchList = [];
                    if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
                        this.searchList = this.brandList.ToList()
                            .Where(function (x) { return _this.startsWith(x.name.toUpperCase(), _this.filterText.toUpperCase()); })
                            .OrderBy(function (x) { return x.name; })
                            .ToArray();
                    }
                    this._filterText = this.filterText;
                };
                BrandsComponent.prototype.get = function () {
                    var that = this;
                    this.service.getBrands(function (json) {
                        if (json) {
                            json.forEach(function (c) {
                                that.brandList.push(new Brand(c.id, c.name));
                            });
                            that.totalAmount = that.brandList.length;
                            that.searchList = that.brandList.ToList()
                                .OrderBy(function (x) { return x.name; })
                                .ToArray();
                            ;
                        }
                    });
                };
                BrandsComponent.prototype.startsWith = function (str, searchString) {
                    return str.substr(0, searchString.length) === searchString;
                };
                ;
                Object.defineProperty(BrandsComponent.prototype, "amount", {
                    get: function () { return this.searchList.length; },
                    enumerable: true,
                    configurable: true
                });
                BrandsComponent = __decorate([
                    core_1.Component({
                        selector: "customers",
                        templateUrl: "./src/app/components/brands/brands.html",
                        styleUrls: ["./src/app/components/brands/brands.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService])
                ], BrandsComponent);
                return BrandsComponent;
            }());
            exports_1("BrandsComponent", BrandsComponent);
        }
    }
});
//# sourceMappingURL=brands.component.js.map