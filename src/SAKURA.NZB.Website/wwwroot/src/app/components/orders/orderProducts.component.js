System.register(["angular2/core", "angular2/common", "../api.service", "../../directives/brandIndexer.directive", "./list.component", "../products/models"], function(exports_1, context_1) {
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
    var core_1, common_1, api_service_1, brandIndexer_directive_1, list_component_1, models_1;
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
            },
            function (list_component_1_1) {
                list_component_1 = list_component_1_1;
            },
            function (models_1_1) {
                models_1 = models_1_1;
            }],
        execute: function() {
            OrderProductsComponent = (function () {
                function OrderProductsComponent(service) {
                    this.service = service;
                    this.selectedCustomerId = '';
                }
                OrderProductsComponent.prototype.ngOnInit = function () {
                    this.getProducts();
                };
                OrderProductsComponent.prototype.onItemSelected = function (id) {
                    var _this = this;
                    if (!this.isLoaded)
                        return;
                    var coList = this.orderModel.customerOrders.ToList();
                    if (coList.All(function (co) { return co.customerId.toString() != _this.selectedCustomerId; }))
                        this.selectedCustomerId = coList.First().customerId.toString();
                    var co = coList.First(function (co) { return co.customerId.toString() == _this.selectedCustomerId; });
                    var opList = co.orderProducts.ToList();
                    var that = this;
                    this.service.getProduct(id, function (json) {
                        if (json) {
                            var product = new models_1.Product(json);
                            var op = opList.FirstOrDefault(function (p) { return p.productId == product.id; });
                            if (!op) {
                                var lowestCost = null;
                                if (product.quotes.length)
                                    lowestCost = product.quotes.ToList().Min(function (q) { return q.price; });
                                co.orderProducts.push(new list_component_1.OrderProduct(product.id, product.brand.name, product.name, lowestCost, product.price, 1, 0));
                            }
                            else
                                op.qty += 1;
                            co.updateSummary();
                            that.orderModel.updateSummary();
                        }
                    });
                };
                OrderProductsComponent.prototype.onRemoveItem = function (cid, pid) {
                    var co = this.orderModel.customerOrders.ToList().FirstOrDefault(function (c) { return c.customerId == cid; });
                    if (!co)
                        return;
                    for (var i = co.orderProducts.length; i--;) {
                        if (co.orderProducts[i].productId == pid) {
                            co.orderProducts.splice(i, 1);
                            co.updateSummary();
                            this.orderModel.updateSummary();
                            return;
                        }
                    }
                };
                OrderProductsComponent.prototype.onSelectCustomer = function (id) {
                    this.selectedCustomerId = id;
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
                Object.defineProperty(OrderProductsComponent.prototype, "isLoaded", {
                    get: function () { return this.orderModel && this.orderModel.customerOrders && this.orderModel.customerOrders.length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderProductsComponent.prototype, "customerOrders", {
                    get: function () { return this.isLoaded ? this.orderModel.customerOrders : []; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderProductsComponent.prototype, "data", {
                    get: function () { return JSON.stringify(this.orderModel.customerOrders); },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', list_component_1.OrderModel)
                ], OrderProductsComponent.prototype, "orderModel", void 0);
                OrderProductsComponent = __decorate([
                    core_1.Component({
                        selector: "order-products",
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