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
    var ProductInfo, OrderSummaryComponent;
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
                function ProductInfo(id, name, cost, costCny, price, qty, profit, strProfit) {
                    this.id = id;
                    this.name = name;
                    this.cost = cost;
                    this.costCny = costCny;
                    this.price = price;
                    this.qty = qty;
                    this.profit = profit;
                    this.strProfit = strProfit;
                    this.profitRate = this.profit / (this.costCny * this.qty) * 100;
                    this.strProfitRate = models_1.formatCurrency(this.profitRate, this.profitRate.toFixed(2)) + '%';
                }
                return ProductInfo;
            }());
            OrderSummaryComponent = (function () {
                function OrderSummaryComponent() {
                    this.exchangeRate = window.nzb.rate.history;
                }
                Object.defineProperty(OrderSummaryComponent.prototype, "productList", {
                    get: function () {
                        var _this = this;
                        if (!this.orderModel || !this.orderModel.customerOrders)
                            return [];
                        var list = [].ToList();
                        this.orderModel.customerOrders.forEach(function (co) {
                            co.orderProducts.forEach(function (op) {
                                var p = list.FirstOrDefault(function (l) { return l.id == op.productId && l.name == op.productName; });
                                if (p)
                                    p.qty += op.qty;
                                else
                                    list.Add(new ProductInfo(op.productId, op.productName, op.cost, (op.cost * _this.exchangeRate).toFixed(2), op.price, op.qty, op.profit, op.strProfit));
                            });
                        });
                        return list.OrderBy(function (p) { return p.name; }).ToArray();
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderSummaryComponent.prototype, "isLoaded", {
                    get: function () { return this.productList.length > 0; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderSummaryComponent.prototype, "totalProfitRate", {
                    get: function () { return this.orderModel.totalProfit / (this.orderModel.totalCost * this.exchangeRate) * 100; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderSummaryComponent.prototype, "strTotalProfitRate", {
                    get: function () { return models_1.formatCurrency(this.totalProfitRate, this.totalProfitRate.toFixed(2)) + '%'; },
                    enumerable: true,
                    configurable: true
                });
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', models_1.OrderModel)
                ], OrderSummaryComponent.prototype, "orderModel", void 0);
                OrderSummaryComponent = __decorate([
                    core_1.Component({
                        selector: "order-summary",
                        templateUrl: "./src/app/components/orders/orderSummary.html",
                        styleUrls: ["./src/app/components/orders/orderInvoice.css"],
                        directives: [common_1.CORE_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [])
                ], OrderSummaryComponent);
                return OrderSummaryComponent;
            }());
            exports_1("OrderSummaryComponent", OrderSummaryComponent);
        }
    }
});
//# sourceMappingURL=orderSummary.component.js.map