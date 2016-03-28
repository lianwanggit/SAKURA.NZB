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
    var ProductBaseEditComponent;
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
            ProductBaseEditComponent = (function () {
                function ProductBaseEditComponent(service, router, params) {
                    this.service = service;
                    this.router = router;
                    this.categoryModel = new models_1.Category({ "id": 0, "name": null });
                    this.brandModel = new models_1.Brand({ "id": 0, "name": null });
                    this.supplierModel = new models_1.Supplier({ "id": 0, "name": null, "address": null, "phone": null });
                    this.editMode = false;
                    this.customerId = params.get("id");
                    if (this.customerId) {
                        this.editMode = true;
                    }
                }
                ProductBaseEditComponent.prototype.ngOnInit = function () {
                };
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
//# sourceMappingURL=baseEdit.js.map