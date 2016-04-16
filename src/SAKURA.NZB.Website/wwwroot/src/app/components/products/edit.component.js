/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/router', "../api.service", "./models", "../../validators/selectValidator", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, router_1, api_service_1, models_1, selectValidator_1;
    var ProductEditComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (models_1_1) {
                models_1 = models_1_1;
            },
            function (selectValidator_1_1) {
                selectValidator_1 = selectValidator_1_1;
            },
            function (_1) {}],
        execute: function() {
            ProductEditComponent = (function () {
                function ProductEditComponent(service, router, params) {
                    this.service = service;
                    this.router = router;
                    this.categories = [];
                    this.brands = [];
                    this.suppliers = [];
                    this.model = new models_1.Product({
                        "id": 0, "name": null, "desc": null, "categoryId": 0, "category": null,
                        "brandId": 0, "brand": null, "images": null, "quotes": [], "price": null
                    });
                    this.editMode = false;
                    this.productId = params.get("id");
                    if (this.productId) {
                        this.editMode = true;
                    }
                    this.productForm = new common_1.ControlGroup({
                        category: new common_1.Control(this.model.categoryId, selectValidator_1.SelectValidator.unselected),
                        brand: new common_1.Control(this.model.brandId, selectValidator_1.SelectValidator.unselected),
                        name: new common_1.Control(this.model.name, common_1.Validators.required),
                        price: new common_1.Control(this.model.price),
                        desc: new common_1.Control(this.model.desc)
                    });
                }
                ProductEditComponent.prototype.ngOnInit = function () {
                    var that = this;
                    this.service.getCategories(function (json) {
                        if (json)
                            json.forEach(function (c) {
                                that.categories.push(new models_1.Category(c));
                            });
                    });
                    this.service.getBrands(function (json) {
                        if (json)
                            json.forEach(function (b) {
                                that.brands.push(new models_1.Brand(b));
                            });
                    });
                    this.service.getSuppliers(function (json) {
                        if (json)
                            json.forEach(function (s) {
                                that.suppliers.push(new models_1.Supplier(s));
                            });
                    });
                    this.service.getLatestExchangeRates(function (json) {
                        if (json) {
                            that.fixedRateHigh = json.fixedRateHigh;
                            that.fixedRateLow = json.fixedRateLow;
                            that.currentRate = json.currentRate.toFixed(2);
                        }
                    });
                    if (this.editMode) {
                        this.service.getProduct(this.productId, function (json) {
                            if (json) {
                                that.model = new models_1.Product(json);
                                var categoryControl;
                                categoryControl = that.productForm.controls['category'];
                                categoryControl.updateValue(that.model.categoryId);
                                var brandControl;
                                brandControl = that.productForm.controls['brand'];
                                brandControl.updateValue(that.model.brandId);
                                var nameControl;
                                nameControl = that.productForm.controls['name'];
                                nameControl.updateValue(that.model.name);
                                var priceControl;
                                priceControl = that.productForm.controls['price'];
                                priceControl.updateValue(that.model.price);
                                var descControl;
                                descControl = that.productForm.controls['desc'];
                                descControl.updateValue(that.model.desc);
                            }
                        });
                    }
                };
                ProductEditComponent.prototype.onAddQuote = function () {
                    this.model.quotes.push(new models_1.Quote({
                        id: 0,
                        productId: 0,
                        supplierId: 0,
                        supplier: null,
                        price: null
                    }));
                };
                ProductEditComponent.prototype.onRemoveQuote = function (i) {
                    this.model.quotes.splice(i, 1);
                };
                ProductEditComponent.prototype.onSubmit = function () {
                    var _this = this;
                    var form = this.productForm.value;
                    var p = new models_1.Product({
                        "id": 0, "name": form.name, "desc": form.desc, "categoryId": form.category, "category": null,
                        "brandId": form.brand, "brand": null, "images": null, "quotes": this.model.quotes, "price": form.price, "selected": false
                    });
                    if (!this.editMode) {
                        this.service.postProduct(JSON.stringify(p, this.emptyStringToNull))
                            .subscribe(function (response) {
                            _this.router.navigate(['产品']);
                        });
                    }
                    else {
                        p.id = parseInt(this.productId);
                        this.service.putProduct(this.productId, JSON.stringify(p, this.emptyStringToNull))
                            .subscribe(function (response) {
                            _this.router.navigate(['产品']);
                        });
                    }
                };
                ProductEditComponent.prototype.emptyStringToNull = function (key, value) {
                    return value === "" ? null : value;
                };
                Object.defineProperty(ProductEditComponent.prototype, "title", {
                    get: function () { return (this.model && this.editMode) ? "编辑产品 - " + this.model.name : "新建产品"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProductEditComponent.prototype, "canAddQuote", {
                    get: function () { return !this.model.quotes || (this.model.quotes.length < this.suppliers.length); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProductEditComponent.prototype, "isQuotesValid", {
                    get: function () { return this.model.quotes.ToList().All(function (q) { return q.isValid; }); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProductEditComponent.prototype, "isLowPrice", {
                    get: function () {
                        var price = this.productForm.value.price;
                        if (price && this.model.quotes.length > 0) {
                            var lowQuote = this.model.quotes.ToList().Min(function (q) { return q.price; });
                            if (lowQuote && price <= lowQuote * this.currentRate) {
                                return true;
                            }
                        }
                        return false;
                    },
                    enumerable: true,
                    configurable: true
                });
                ProductEditComponent = __decorate([
                    core_1.Component({
                        selector: "product-edit",
                        templateUrl: "./src/app/components/products/edit.html",
                        styleUrls: ["./src/app/components/products/products.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router, router_1.RouteParams])
                ], ProductEditComponent);
                return ProductEditComponent;
            }());
            exports_1("ProductEditComponent", ProductEditComponent);
        }
    }
});
//# sourceMappingURL=edit.component.js.map