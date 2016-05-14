/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/http', "../api.service", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, http_1, api_service_1;
    var Brand, BrandsComponent;
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
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (_1) {}],
        execute: function() {
            Brand = (function () {
                function Brand(id, name, count) {
                    this.id = id;
                    this.name = name;
                    this.count = count;
                    this.selected = false;
                }
                return Brand;
            }());
            BrandsComponent = (function () {
                function BrandsComponent(http, fb) {
                    this.http = http;
                    this.brandList = [];
                    this.searchList = [];
                    this.filterText = '';
                    this.totalAmount = 0;
                    this.editMode = false;
                    this._filterText = '';
                    this.products = [];
                    this.duplicatedNameAlert = false;
                    this.isLoading = true;
                    this.brandForm = fb.group({
                        brand: [null, common_1.Validators.required]
                    });
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
                BrandsComponent.prototype.onCreate = function () {
                    this.brandForm.controls['brand'].updateValue(null);
                    this.editMode = false;
                    $('#myModal').modal('show');
                };
                BrandsComponent.prototype.onClick = function (id) {
                    var _this = this;
                    this.products = [];
                    this.duplicatedNameAlert = false;
                    this.searchList.forEach(function (b) {
                        if (b.id == id) {
                            if (b.selected) {
                                _this.http.get(api_service_1.PRODUCTS_GET_BY_BRAND_ENDPOINT + id)
                                    .map(function (res) { return res.status === 404 ? null : res.json(); })
                                    .subscribe(function (json) {
                                    if (!json)
                                        return;
                                    json.forEach(function (p) {
                                        _this.products.push(p);
                                    });
                                });
                                _this.brandForm.controls['brand'].updateValue(_this._selectedBrand.name);
                                _this.editMode = true;
                                $('#myModal').modal('show');
                            }
                            _this._selectedBrand = b;
                        }
                        b.selected = b.id == id;
                    });
                };
                BrandsComponent.prototype.onSubmit = function () {
                    var _this = this;
                    var that = this;
                    var name = this.brandForm.value.brand;
                    var headers = new http_1.Headers();
                    headers.append('Content-Type', 'application/json');
                    if (!this.editMode)
                        this.http
                            .post(api_service_1.BRANDS_ENDPOINT, JSON.stringify(new Brand("0", name, 0)), { headers: headers })
                            .subscribe(function (response) {
                            $('#myModal').modal('hide');
                            _this.get();
                        }, function (error) {
                            console.error(error);
                            if (error._body == 'name taken') {
                                _this.duplicatedNameAlert = true;
                                return;
                            }
                            $('#myModal').modal('hide');
                        });
                    else {
                        var brand = new Brand(this._selectedBrand.id, name, 0);
                        this.http.put(api_service_1.BRANDS_ENDPOINT + brand.id, JSON.stringify(brand), { headers: headers })
                            .subscribe(function (response) {
                            $('#myModal').modal('hide');
                            _this.get();
                        }, function (error) {
                            console.error(error);
                            if (error._body == 'name taken') {
                                _this.duplicatedNameAlert = true;
                                return;
                            }
                            $('#myModal').modal('hide');
                        });
                    }
                };
                BrandsComponent.prototype.onDelete = function () {
                    var _this = this;
                    $('#myModal').modal('hide');
                    if (this.editMode)
                        this.http.delete(api_service_1.BRANDS_ENDPOINT + this._selectedBrand.id)
                            .subscribe(function (response) { return _this.get(); }, function (error) { return console.error(error); });
                };
                BrandsComponent.prototype.get = function () {
                    var _this = this;
                    var that = this;
                    this.brandList = [];
                    this.http.get(api_service_1.BRANDS_ENDPOINT)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isLoading = false;
                        if (!json)
                            return;
                        json.forEach(function (c) {
                            that.brandList.push(new Brand(c.id, c.name, c.count));
                        });
                        that.totalAmount = that.brandList.length;
                        that.searchList = that.brandList.ToList()
                            .OrderBy(function (x) { return x.name; })
                            .ToArray();
                        if (that._selectedBrand) {
                            _this.searchList.forEach(function (b) {
                                b.selected = b.id == that._selectedBrand.id;
                                if (b.id == that._selectedBrand.id) {
                                    that._selectedBrand = b;
                                }
                            });
                        }
                    }, function (error) {
                        _this.isLoading = false;
                        console.log(error);
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
                Object.defineProperty(BrandsComponent.prototype, "dialogTitle", {
                    get: function () { return this.editMode ? "编辑品牌" : "新建品牌"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(BrandsComponent.prototype, "canDelete", {
                    get: function () {
                        if (!this._selectedBrand)
                            return false;
                        return this._selectedBrand.count == 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                BrandsComponent = __decorate([
                    core_1.Component({
                        selector: "customers",
                        templateUrl: "./src/app/components/brands/brands.html",
                        styleUrls: ["./src/app/components/brands/brands.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, common_1.FormBuilder])
                ], BrandsComponent);
                return BrandsComponent;
            }());
            exports_1("BrandsComponent", BrandsComponent);
        }
    }
});
//# sourceMappingURL=brands.component.js.map