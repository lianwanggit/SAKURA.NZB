/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/router', "../api.service", "./models", "../../validators/selectValidator", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1) {
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
                        "brandId": 0, "brand": null, "images": null, "quotes": null, "price": 0, "selected": false
                    });
                    this.editMode = false;
                    this.productId = params.get("id");
                    if (this.productId) {
                        this.editMode = true;
                    }
                    this.productForm = new common_1.ControlGroup({
                        category: new common_1.Control(this.model.categoryId, selectValidator_1.SelectValidator.unselected),
                        name: new common_1.Control(this.model.name, common_1.Validators.required)
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
                };
                ProductEditComponent.prototype.onSubmit = function () {
                };
                Object.defineProperty(ProductEditComponent.prototype, "title", {
                    get: function () { return (this.model && this.editMode) ? "编辑产品 - " + this.model.name : "新建产品"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ProductEditComponent.prototype, "data", {
                    get: function () { return JSON.stringify(this.productForm.value); },
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
            })();
            exports_1("ProductEditComponent", ProductEditComponent);
        }
    }
});
//# sourceMappingURL=edit.component.js.map