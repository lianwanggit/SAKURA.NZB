System.register(["angular2/core", "angular2/common", "../api.service", "./models"], function(exports_1, context_1) {
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
    var core_1, common_1, api_service_1, models_1;
    var ProductInfo, OrderInvoiceComponent;
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
            function (models_1_1) {
                models_1 = models_1_1;
            }],
        execute: function() {
            ProductInfo = (function () {
                function ProductInfo(id, name, cost, qty, purchased) {
                    this.id = id;
                    this.name = name;
                    this.cost = cost;
                    this.qty = qty;
                    this.purchased = purchased;
                    this.totalCost = this.purchased ? 0 : this.cost * this.qty;
                }
                return ProductInfo;
            }());
            OrderInvoiceComponent = (function () {
                function OrderInvoiceComponent(service) {
                    this.service = service;
                }
                OrderInvoiceComponent.prototype.onPurchasedChanged = function (id) {
                    this.orderModel.customerOrders.forEach(function (co) {
                        co.orderProducts.forEach(function (op) {
                            if (op.productId.toString() == id) {
                                op.purchased = !op.purchased;
                                return;
                            }
                        });
                    });
                };
                Object.defineProperty(OrderInvoiceComponent.prototype, "productList", {
                    get: function () {
                        if (!this.orderModel || !this.orderModel.customerOrders)
                            return [];
                        var list = [].ToList();
                        this.orderModel.customerOrders.forEach(function (co) {
                            co.orderProducts.forEach(function (op) {
                                var p = list.FirstOrDefault(function (l) { return l.id == op.productId; });
                                if (p)
                                    p.qty += op.qty;
                                else
                                    list.Add(new ProductInfo(op.productId, op.productBrand + ' ' + op.productName, op.cost, op.qty, op.purchased));
                            });
                        });
                        this.totalCost = (list.Sum(function (p) { return p.totalCost; }) + this.orderModel.freight).toFixed(2);
                        return list.OrderBy(function (p) { return p.name; }).ToArray();
                    },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', models_1.OrderModel)
                ], OrderInvoiceComponent.prototype, "orderModel", void 0);
                OrderInvoiceComponent = __decorate([
                    core_1.Component({
                        selector: "order-invoice",
                        templateUrl: "./src/app/components/orders/orderInvoice.html",
                        styleUrls: ["./src/app/components/orders/orderCustomers.css",
                            "./src/app/components/orders/orderInvoice.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService])
                ], OrderInvoiceComponent);
                return OrderInvoiceComponent;
            }());
            exports_1("OrderInvoiceComponent", OrderInvoiceComponent);
        }
    }
});
//# sourceMappingURL=orderInvoice.component.js.map