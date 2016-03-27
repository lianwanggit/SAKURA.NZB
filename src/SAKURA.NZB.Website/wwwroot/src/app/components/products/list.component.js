/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/router', "../api.service", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, api_service_1;
    var Category, Brand, Supplier, Quote, Product, ProductsComponent;
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
            function (_1) {}],
        execute: function() {
            Category = (function () {
                function Category(obj) {
                    this.id = obj.id;
                    this.name = obj.name;
                }
                return Category;
            })();
            exports_1("Category", Category);
            Brand = (function () {
                function Brand(obj) {
                    this.id = obj.id;
                    this.name = obj.name;
                }
                return Brand;
            })();
            exports_1("Brand", Brand);
            Supplier = (function () {
                function Supplier(obj) {
                    this.id = obj.id;
                    this.name = obj.name;
                    this.address = obj.address;
                    this.phone = obj.phone;
                }
                return Supplier;
            })();
            exports_1("Supplier", Supplier);
            Quote = (function () {
                function Quote(obj) {
                    this.id = obj.id;
                    this.productId = obj.productId;
                    this.supplierId = obj.supplierId;
                    this.supplier = obj.supplier;
                    this.price = obj.price;
                }
                return Quote;
            })();
            exports_1("Quote", Quote);
            Product = (function () {
                function Product(obj) {
                    this.selected = false;
                    this.id = obj.id;
                    this.name = obj.fullName;
                    this.desc = obj.desc;
                    this.categoryId = obj.categoryId;
                    this.category = obj.category;
                    this.brandId = obj.brandId;
                    this.brand = obj.brand;
                    this.images = obj.images;
                    this.quotes = obj.quotes;
                    this.price = obj.price;
                }
                return Product;
            })();
            exports_1("Product", Product);
            ProductsComponent = (function () {
                function ProductsComponent(service, router) {
                    this.service = service;
                    this.router = router;
                    //icons = ['ambulance', 'car', 'bicycle', 'bus', 'taxi', 'fighter-jet', 'motorcycle', 'plane', 'rocket', 'ship', 'space-shuttle', 'subway', 'taxi', 'train', 'truck'];
                    this.productList = [];
                    this.searchList = [];
                    this.filterText = '';
                    this.totalAmount = 0;
                    //isListViewMode = true;
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
                                that.productList.push(new Product(c));
                            });
                            that.totalAmount = that.productList.length;
                            that.searchList = that.productList.ToList()
                                .ToArray();
                            ;
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
                        this.searchList = this.productList.ToList()
                            .Where(function (x) { return _this.startsWith(x.name, _this.filterText) ||
                            _this.startsWith(x.brand.name.toLowerCase(), _this.filterText.toLowerCase()); })
                            .ToArray();
                    }
                    this._filterText = this.filterText;
                };
                ProductsComponent.prototype.onClickListItem = function (id) {
                    this.productList.forEach(function (x) {
                        x.selected = x.id == id;
                    });
                };
                ProductsComponent.prototype.onEdit = function (cid) {
                    this.productList.forEach(function (x) {
                        if (x.id == cid && x.selected) {
                            //this.router.navigate(['CEdit', { id: cid }]);
                            return;
                        }
                    });
                };
                ProductsComponent.prototype.startsWith = function (str, searchString) {
                    return str.substr(0, searchString.length) === searchString;
                };
                ;
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
                        styleUrls: ["./css/products.css"],
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