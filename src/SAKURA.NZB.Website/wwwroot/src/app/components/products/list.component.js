/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/router', "../api.service", "./models", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, api_service_1, models_1;
    var ProductListItem, QuoteListItem, ProductsComponent;
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
            function (_1) {}],
        execute: function() {
            ProductListItem = (function () {
                function ProductListItem(id, name, category, brand, price, quotes, isCategoryItem) {
                    if (quotes === void 0) { quotes = []; }
                    if (isCategoryItem === void 0) { isCategoryItem = false; }
                    this.id = id;
                    this.name = name;
                    this.category = category;
                    this.brand = brand;
                    this.price = price;
                    this.quotes = quotes;
                    this.isCategoryItem = isCategoryItem;
                }
                return ProductListItem;
            })();
            QuoteListItem = (function () {
                function QuoteListItem(supplier, price, priceFixedRateHigh, priceFixedRateLow) {
                    this.price = price;
                    this.priceFixedRateHigh = priceFixedRateHigh;
                    this.priceFixedRateLow = priceFixedRateLow;
                }
                return QuoteListItem;
            })();
            ProductsComponent = (function () {
                function ProductsComponent(service, router) {
                    this.service = service;
                    this.router = router;
                    this.productList = [].ToList();
                    this.searchList = [];
                    this.filterText = '';
                    this.totalAmount = 0;
                    this.categoryAmount = 0;
                    this.brandAmount = 0;
                    this.supplierAmount = 0;
                    this._filterText = '';
                }
                ProductsComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                ProductsComponent.prototype.get = function () {
                    var that = this;
                    this.service.getProducts(function (json) {
                        if (json) {
                            json.forEach(function (c) {
                                that.productList.Add(new models_1.Product(c));
                            });
                            that.totalAmount = that.productList.Count();
                            that.addProductsToSearchList(that.productList);
                        }
                    });
                    this.service.getCategories(function (json) {
                        if (json)
                            that.categoryAmount = json.length;
                    });
                    this.service.getBrands(function (json) {
                        if (json)
                            that.brandAmount = json.length;
                    });
                    this.service.getSuppliers(function (json) {
                        if (json)
                            that.supplierAmount = json.length;
                    });
                    this.service.getLatestExchangeRates(function (json) {
                        if (json) {
                            that.fixedRateHigh = json.fixedRateHigh;
                            that.fixedRateLow = json.fixedRateLow;
                            that.currentRate = json.currentRate.toFixed(2);
                        }
                    });
                };
                ProductsComponent.prototype.onClearFilter = function () {
                    this.onSearch('');
                };
                ProductsComponent.prototype.onSearch = function (value) {
                    var _this = this;
                    // Sync value for the special cases, for example,
                    // select value from the historical inputs dropdown list
                    if (this.filterText !== value)
                        this.filterText = value;
                    // Avoid multiple submissions
                    if (this.filterText === this._filterText)
                        return;
                    this.searchList = [];
                    if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
                        var result = this.productList
                            .Where(function (x) { return _this.startsWith(x.name, _this.filterText) ||
                            _this.startsWith(x.category.name, _this.filterText) ||
                            _this.startsWith(x.brand.name.toLowerCase(), _this.filterText.toLowerCase()); });
                        this.addProductsToSearchList(result);
                    }
                    this._filterText = this.filterText;
                };
                //onClickListItem(id: number) {
                //	this.productList.forEach(x => {
                //		x.selected = x.id == id;
                //	});
                //}
                //onEdit(cid: number) {
                //	this.productList.forEach(x => {
                //		if (x.id == cid && x.selected) {
                //			//this.router.navigate(['CEdit', { id: cid }]);
                //			return;
                //		}
                //	});
                //}
                ProductsComponent.prototype.addProductsToSearchList = function (products) {
                    var list = [].ToList();
                    var category = '';
                    var that = this;
                    products.ForEach(function (p) {
                        if (p.category.name !== category) {
                            list.Add(new ProductListItem(null, null, p.category.name, null, null, null, true));
                            category = p.category.name;
                        }
                        var quoteItemList = [];
                        p.quotes.forEach(function (q) {
                            quoteItemList.push(new QuoteListItem(q.supplier.name, q.price, that.currencyConvert(that.fixedRateHigh, q.price), that.currencyConvert(that.fixedRateLow, q.price)));
                        });
                        list.Add(new ProductListItem(p.id, p.name, p.category.name, p.brand.name, p.price, quoteItemList));
                    });
                    this.searchList = list.ToArray();
                };
                ProductsComponent.prototype.startsWith = function (str, searchString) {
                    return str.substr(0, searchString.length) === searchString;
                };
                ;
                ProductsComponent.prototype.currencyConvert = function (rate, price) {
                    return !price || isNaN(price) ? '' : (price * rate).toFixed(2).toString().replace(/\.?0+$/, "");
                };
                Object.defineProperty(ProductsComponent.prototype, "amount", {
                    get: function () { return this.searchList.length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProductsComponent.prototype, "data", {
                    get: function () { return JSON.stringify(this.searchList); },
                    enumerable: true,
                    configurable: true
                });
                ProductsComponent = __decorate([
                    core_1.Component({
                        selector: "products",
                        templateUrl: "./src/app/components/products/list.html",
                        styleUrls: ["./src/app/components/products/products.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router])
                ], ProductsComponent);
                return ProductsComponent;
            })();
            exports_1("ProductsComponent", ProductsComponent);
        }
    }
});
//# sourceMappingURL=list.component.js.map