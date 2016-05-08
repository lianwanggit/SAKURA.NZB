System.register(["angular2/core", "angular2/common", "./models"], function(exports_1, context_1) {
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
    var core_1, common_1, models_1;
    var ProductInfo, OrderQuoteComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (models_1_1) {
                models_1 = models_1_1;
            }],
        execute: function() {
            ProductInfo = (function () {
                function ProductInfo(id, name, price, qty) {
                    this.id = id;
                    this.name = name;
                    this.price = price;
                    this.qty = qty;
                    this.totalPrice = this.price * this.qty;
                }
                return ProductInfo;
            }());
            OrderQuoteComponent = (function () {
                function OrderQuoteComponent() {
                }
                Object.defineProperty(OrderQuoteComponent.prototype, "productList", {
                    get: function () {
                        if (!this.orderModel || !this.orderModel.customerOrders)
                            return [];
                        var list = [].ToList();
                        this.orderModel.customerOrders.forEach(function (co) {
                            co.orderProducts.forEach(function (op) {
                                var p = list.FirstOrDefault(function (l) { return l.id == op.productId && l.name == op.productName; });
                                if (p)
                                    p.qty += op.qty;
                                else
                                    list.Add(new ProductInfo(op.productId, op.productName, op.price, op.qty));
                            });
                        });
                        this.totalPrice = (list.Sum(function (p) { return p.totalPrice; })).toFixed(2);
                        return list.OrderBy(function (p) { return p.name; }).ToArray();
                    },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', models_1.OrderModel)
                ], OrderQuoteComponent.prototype, "orderModel", void 0);
                OrderQuoteComponent = __decorate([
                    core_1.Component({
                        selector: "order-quote",
                        templateUrl: "./src/app/components/orders/orderQuote.html",
                        styleUrls: ["./src/app/components/orders/orderQuote.css"],
                        directives: [common_1.CORE_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], OrderQuoteComponent);
                return OrderQuoteComponent;
            }());
            exports_1("OrderQuoteComponent", OrderQuoteComponent);
        }
    }
});
//# sourceMappingURL=orderQuote.component.js.map