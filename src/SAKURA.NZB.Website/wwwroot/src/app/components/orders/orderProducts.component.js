System.register(["angular2/core", "angular2/common", "../api.service", "../../directives/brandIndexer.directive"], function(exports_1, context_1) {
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
    var core_1, common_1, api_service_1, brandIndexer_directive_1;
    var OrderProductsComponent;
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
            function (brandIndexer_directive_1_1) {
                brandIndexer_directive_1 = brandIndexer_directive_1_1;
            }],
        execute: function() {
            OrderProductsComponent = (function () {
                function OrderProductsComponent(service) {
                    this.service = service;
                    this.selectedId = '123';
                }
                OrderProductsComponent.prototype.ngOnInit = function () {
                    this.getProducts();
                };
                OrderProductsComponent.prototype.ngOnChanges = function (changes) {
                    console.log(JSON.stringify(changes));
                };
                OrderProductsComponent.prototype.onItemSelected = function (id) {
                    this.selectedId = id;
                };
                OrderProductsComponent.prototype.getProducts = function () {
                    var that = this;
                    this.service.getProductsBrief(function (json) {
                        if (json) {
                            var list = [].ToList();
                            json.forEach(function (x) {
                                list.Add(new brandIndexer_directive_1.Item(x.id, x.name, x.brand));
                            });
                            that.itemSource = list.ToArray();
                        }
                    });
                };
                Object.defineProperty(OrderProductsComponent.prototype, "data", {
                    get: function () { return JSON.stringify(this.customers); },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', Array)
                ], OrderProductsComponent.prototype, "customers", void 0);
                OrderProductsComponent = __decorate([
                    core_1.Component({
                        selector: "order-product",
                        templateUrl: "./src/app/components/orders/orderProducts.html",
                        styleUrls: ["./src/app/components/orders/orderCustomers.css",
                            "./src/app/components/orders/orderProducts.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, brandIndexer_directive_1.BrandIndexerDirective]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService])
                ], OrderProductsComponent);
                return OrderProductsComponent;
            }());
            exports_1("OrderProductsComponent", OrderProductsComponent);
        }
    }
});
//# sourceMappingURL=orderProducts.component.js.map