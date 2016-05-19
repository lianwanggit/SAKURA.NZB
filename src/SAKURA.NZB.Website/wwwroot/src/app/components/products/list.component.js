/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/http', 'angular2/router', "../api.service", "./models", 'ng2-bootstrap/ng2-bootstrap', '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, http_1, router_1, api_service_1, models_1, ng2_bootstrap_1;
    var ProductSummary, ProductsComponent;
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
            function (models_1_1) {
                models_1 = models_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (_1) {}],
        execute: function() {
            ProductSummary = (function () {
                function ProductSummary(id, name, category, brand, quote, price, soldHighPrice, soldLowPrice, soldCount) {
                    this.id = id;
                    this.name = name;
                    this.category = category;
                    this.brand = brand;
                    this.quote = quote;
                    this.soldCount = soldCount;
                    this.isCategoryItem = false;
                    this.selected = false;
                    this.quoteText = this.toNzdText(this.quote);
                    this.priceText = this.toCnyText(price);
                    this.soldHighPriceText = this.toCnyText(soldHighPrice);
                    this.soldLowPriceText = this.toCnyText(soldLowPrice);
                }
                ProductSummary.prototype.calculateQuoteWithRate = function (fixedRateHigh, fixedRateLow) {
                    this.quoteFixedRateHight = this.currencyConvert(fixedRateHigh, this.quote);
                    this.quoteFixedRateLow = this.currencyConvert(fixedRateLow, this.quote);
                };
                ProductSummary.prototype.toNzdText = function (value) {
                    return !jQuery.isNumeric(value) ? '' : '$ ' + value.toFixed(2).toString().replace(/\.?0+$/, "");
                };
                ProductSummary.prototype.toCnyText = function (value) {
                    return !jQuery.isNumeric(value) ? '' : '¥ ' + value.toFixed(2).toString().replace(/\.?0+$/, "");
                };
                ProductSummary.prototype.currencyConvert = function (rate, price) {
                    return !jQuery.isNumeric(price) ? '' : '¥ ' + (price * rate).toFixed(2).toString().replace(/\.?0+$/, "");
                };
                return ProductSummary;
            }());
            ProductsComponent = (function () {
                function ProductsComponent(http, router) {
                    this.http = http;
                    this.router = router;
                    this.productList = [].ToList();
                    this.searchList = [];
                    this.selectedItem = null;
                    this.categories = [];
                    this.filterCategory = '';
                    this.filterText = '';
                    this.totalAmount = 0;
                    this.categoryAmount = 0;
                    this.supplierAmount = 0;
                    this.fixedRateHigh = window.nzb.rate.high;
                    this.fixedRateLow = window.nzb.rate.low;
                    this.currentRate = window.nzb.rate.live;
                    this.isProductsLoading = true;
                    this.isCategoriesLoading = true;
                    this.isSuppliersLoading = true;
                    this.page = 1;
                    this.prevItems = [].ToList();
                    this.nextItems = [].ToList();
                    this.itemsPerPage = 0;
                    this.totalItemCount = 0;
                    this._filterText = '';
                    this._isPrevItemsLoaded = false;
                    this._isNextItemsLoaded = false;
                }
                ProductsComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                ProductsComponent.prototype.get = function () {
                    var _this = this;
                    var that = this;
                    this.getProductsByPage();
                    this.http.get(api_service_1.CATEGORIES_ENDPOINT)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isCategoriesLoading = false;
                        if (!json)
                            return;
                        json.forEach(function (c) {
                            that.categories.push(new models_1.Category(c));
                        });
                        that.categoryAmount = json.length;
                    }, function (error) {
                        _this.isCategoriesLoading = false;
                        console.log(error);
                    });
                    this.http.get(api_service_1.SUPPLIERS_ENDPOINT)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isSuppliersLoading = false;
                        if (!json)
                            return;
                        that.supplierAmount = json.length;
                    }, function (error) {
                        _this.isSuppliersLoading = false;
                        console.log(error);
                    });
                };
                ProductsComponent.prototype.onClearFilter = function () {
                    this.onSearchKeyword('');
                };
                ProductsComponent.prototype.onSearchKeyword = function (value) {
                    if (this.filterText !== value)
                        this.filterText = value;
                    if (this.filterText === this._filterText)
                        return;
                    this.searchList = [];
                    if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
                        this.page = 1;
                        this.getProductsByPage();
                    }
                    this._filterText = this.filterText;
                };
                ProductsComponent.prototype.onSearchCategory = function (value) {
                    if (this.filterCategory !== value)
                        this.filterCategory = value;
                    this.page = 1;
                    this.getProductsByPage();
                };
                ProductsComponent.prototype.onSelect = function (id) {
                    this.selectedItem = null;
                    var that = this;
                    this.searchList.forEach(function (x) {
                        x.selected = x.id == id && !x.isCategoryItem;
                        if (x.selected)
                            that.selectedItem = x;
                    });
                };
                ProductsComponent.prototype.onPageChanged = function (event) {
                    var loadSearchList = true;
                    this.searchList = [];
                    if (this.page - 1 == event.page && this._isPrevItemsLoaded) {
                        this.addProductsToSearchList(this.prevItems);
                        loadSearchList = false;
                    }
                    if (this.page + 1 == event.page && this._isNextItemsLoaded) {
                        this.addProductsToSearchList(this.nextItems);
                        loadSearchList = false;
                    }
                    this.page = event.page;
                    this.getProductsByPage(loadSearchList);
                };
                ;
                ProductsComponent.prototype.getProductsByPage = function (loadSearchList) {
                    var _this = this;
                    if (loadSearchList === void 0) { loadSearchList = true; }
                    this._isPrevItemsLoaded = false;
                    this._isNextItemsLoaded = false;
                    var that = this;
                    var url = api_service_1.PRODUCTS_SEARCH_ENDPOINT + '?page=' + this.page;
                    if (this.filterCategory)
                        url += '&category=' + this.filterCategory;
                    if (this.filterText)
                        url += '&keyword=' + this.filterText;
                    this.http.get(url)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isProductsLoading = false;
                        if (!json)
                            return;
                        that.productList = [].ToList();
                        that.prevItems = [].ToList();
                        that.nextItems = [].ToList();
                        if (json.items) {
                            json.items.forEach(function (c) {
                                that.productList.Add(new ProductSummary(c.id, c.name, c.category, c.brand, c.quote, c.price, c.soldHighPrice, c.soldLowPrice, c.soldCount));
                            });
                        }
                        if (json.prevItems) {
                            json.prevItems.forEach(function (c) {
                                that.prevItems.Add(new ProductSummary(c.id, c.name, c.category, c.brand, c.quote, c.price, c.soldHighPrice, c.soldLowPrice, c.soldCount));
                            });
                            that._isPrevItemsLoaded = true;
                        }
                        if (json.nextItems) {
                            json.nextItems.forEach(function (c) {
                                that.nextItems.Add(new ProductSummary(c.id, c.name, c.category, c.brand, c.quote, c.price, c.soldHighPrice, c.soldLowPrice, c.soldCount));
                            });
                            that._isNextItemsLoaded = true;
                        }
                        that.itemsPerPage = json.itemsPerPage;
                        that.totalItemCount = json.totalItemCount;
                        if (!that.filterCategory && !that.filterText)
                            that.totalAmount = that.totalItemCount;
                        if (loadSearchList)
                            that.addProductsToSearchList(that.productList);
                    }, function (error) {
                        _this.isProductsLoading = false;
                        console.log(error);
                    });
                };
                ProductsComponent.prototype.addProductsToSearchList = function (products) {
                    var list = [].ToList();
                    var category = '';
                    var that = this;
                    products.ForEach(function (p) {
                        if (p.category !== category) {
                            var ps = new ProductSummary(null, null, p.category, null, null, null, null, null, null);
                            ps.isCategoryItem = true;
                            list.Add(ps);
                            category = p.category;
                        }
                        p.calculateQuoteWithRate(that.fixedRateHigh, that.fixedRateLow);
                        list.Add(p);
                    });
                    this.searchList = list.ToArray();
                };
                Object.defineProperty(ProductsComponent.prototype, "isLoading", {
                    get: function () { return this.isProductsLoading || this.isCategoriesLoading || this.isSuppliersLoading; },
                    enumerable: true,
                    configurable: true
                });
                ProductsComponent = __decorate([
                    core_1.Component({
                        selector: "products",
                        templateUrl: "./src/app/components/products/list.html",
                        styleUrls: ["./src/app/components/products/products.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES, ng2_bootstrap_1.PAGINATION_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, router_1.Router])
                ], ProductsComponent);
                return ProductsComponent;
            }());
            exports_1("ProductsComponent", ProductsComponent);
        }
    }
});
//# sourceMappingURL=list.component.js.map