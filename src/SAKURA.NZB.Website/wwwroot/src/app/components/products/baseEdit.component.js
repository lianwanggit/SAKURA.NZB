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
    var NameList, ProductBaseEditComponent;
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
            NameList = (function () {
                function NameList(id, name) {
                    this.selected = false;
                    this.id = id;
                    this.name = name;
                }
                return NameList;
            })();
            exports_1("NameList", NameList);
            ProductBaseEditComponent = (function () {
                function ProductBaseEditComponent(service, router, params) {
                    this.service = service;
                    this.router = router;
                    this.categoryModel = new models_1.Category({ "id": 0, "name": null });
                    this.brandModel = new models_1.Brand({ "id": 0, "name": null });
                    this.supplierModel = new models_1.Supplier({ "id": 0, "name": null, "address": null, "phone": null });
                    this.namelist = [];
                    this.categories = [].ToList();
                    this.brands = [].ToList();
                    this.suppliers = [].ToList();
                    this.editMode = true;
                    this.editType = params.get("type");
                }
                ProductBaseEditComponent.prototype.ngOnInit = function () {
                    var that = this;
                    if (this.isCategory) {
                        this.service.getCategories(function (json) {
                            if (json) {
                                json.forEach(function (x) {
                                    that.namelist.push(new NameList(x.id, x.name));
                                    that.categories.Add(new models_1.Category(x));
                                });
                                if (that.namelist.length > 0)
                                    that.onSelect(that.namelist[0].id);
                            }
                        });
                    }
                    if (this.isBrand) {
                        this.service.getBrands(function (json) {
                            if (json) {
                                json.forEach(function (x) {
                                    that.namelist.push(new NameList(x.id, x.name));
                                    that.brands.Add(new models_1.Brand(x));
                                });
                                if (that.namelist.length > 0)
                                    that.onSelect(that.namelist[0].id);
                            }
                        });
                    }
                    if (this.isSupplier) {
                        this.service.getSuppliers(function (json) {
                            if (json) {
                                json.forEach(function (x) {
                                    that.namelist.push(new NameList(x.id, x.name));
                                    that.suppliers.Add(new models_1.Supplier(x));
                                });
                                if (that.namelist.length > 0)
                                    that.onSelect(that.namelist[0].id);
                            }
                        });
                    }
                };
                ProductBaseEditComponent.prototype.onSelect = function (id) {
                    if (this.isCategory)
                        this.categoryModel = this.categories.FirstOrDefault(function (x) { return x.id == id; });
                    if (this.isBrand)
                        this.brandModel = this.brands.FirstOrDefault(function (x) { return x.id == id; });
                    if (this.isSupplier)
                        this.supplierModel = this.suppliers.FirstOrDefault(function (x) { return x.id == id; });
                    this.namelist.forEach(function (x) {
                        x.selected = x.id == id;
                    });
                    this.editMode = true;
                };
                ProductBaseEditComponent.prototype.onCreate = function () {
                    if (this.isCategory)
                        this.categoryModel = new models_1.Category({ "id": 0, "name": null });
                    if (this.isBrand)
                        this.brandModel = new models_1.Brand({ "id": 0, "name": null });
                    if (this.isSupplier)
                        this.supplierModel = new models_1.Supplier({ "id": 0, "name": null, "address": null, "phone": null });
                    this.namelist.forEach(function (x) {
                        x.selected = false;
                    });
                    this.editMode = false;
                    this.submitted = false;
                };
                ProductBaseEditComponent.prototype.onSubmit = function () {
                    var _this = this;
                    var that = this;
                    if (this.isCategory) {
                        if (this.editMode)
                            this.service.putCategory(this.categoryModel.id.toString(), JSON.stringify(this.categoryModel))
                                .subscribe(function (x) { return _this.router.navigate(['产品']); });
                        else
                            this.service.postCategory(JSON.stringify(this.categoryModel))
                                .subscribe(function (x) { return _this.router.navigate(['产品']); });
                    }
                    if (this.isBrand) {
                        if (this.editMode)
                            this.service.putBrand(this.brandModel.id.toString(), JSON.stringify(this.brandModel))
                                .subscribe(function (x) { return _this.router.navigate(['产品']); });
                        else
                            this.service.postBrand(JSON.stringify(this.brandModel))
                                .subscribe(function (x) { return _this.router.navigate(['产品']); });
                    }
                    if (this.isSupplier) {
                        if (this.editMode)
                            this.service.putSupplier(this.supplierModel.id.toString(), JSON.stringify(this.supplierModel))
                                .subscribe(function (x) { return _this.router.navigate(['产品']); });
                        else
                            this.service.postSupplier(JSON.stringify(this.supplierModel))
                                .subscribe(function (x) { return _this.router.navigate(['产品']); });
                    }
                };
                Object.defineProperty(ProductBaseEditComponent.prototype, "isCategory", {
                    get: function () { return this.editType == "category"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProductBaseEditComponent.prototype, "isBrand", {
                    get: function () { return this.editType == "brand"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProductBaseEditComponent.prototype, "isSupplier", {
                    get: function () { return this.editType == "supplier"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProductBaseEditComponent.prototype, "title", {
                    get: function () {
                        if (this.isCategory)
                            return "产品类别";
                        if (this.isBrand)
                            return "品牌";
                        if (this.isSupplier)
                            return "供应商";
                        return "";
                    },
                    enumerable: true,
                    configurable: true
                });
                ProductBaseEditComponent = __decorate([
                    core_1.Component({
                        selector: "product-base-edit",
                        templateUrl: "./src/app/components/products/baseEdit.html",
                        styleUrls: ["./css/products.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router, router_1.RouteParams])
                ], ProductBaseEditComponent);
                return ProductBaseEditComponent;
            })();
            exports_1("ProductBaseEditComponent", ProductBaseEditComponent);
        }
    }
});
//# sourceMappingURL=baseEdit.component.js.map