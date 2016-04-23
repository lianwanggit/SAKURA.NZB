/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/router', "../api.service", "./models", "./orderCustomers.component", "./orderProducts.component", "./orderInvoice.component", "./orderSummary.component", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, router_1, api_service_1, models_1, orderCustomers_component_1, orderProducts_component_1, orderInvoice_component_1, orderSummary_component_1;
    var OrderEditComponent;
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
            function (orderCustomers_component_1_1) {
                orderCustomers_component_1 = orderCustomers_component_1_1;
            },
            function (orderProducts_component_1_1) {
                orderProducts_component_1 = orderProducts_component_1_1;
            },
            function (orderInvoice_component_1_1) {
                orderInvoice_component_1 = orderInvoice_component_1_1;
            },
            function (orderSummary_component_1_1) {
                orderSummary_component_1 = orderSummary_component_1_1;
            },
            function (_1) {}],
        execute: function() {
            OrderEditComponent = (function () {
                function OrderEditComponent(service, router, params) {
                    this.service = service;
                    this.router = router;
                    this.editMode = false;
                    this.orderStates = (new models_1.Dict()).orderStates;
                    this.paymentStates = (new models_1.Dict()).paymentStates;
                    this.orderId = params.get("id");
                    if (this.orderId) {
                        this.editMode = true;
                    }
                    this.order = new models_1.OrderModel(0, null, null, null, "Created", "Unpaid", null, null, null, null, null, null, null, null, null, this.orderStates, []);
                }
                OrderEditComponent.prototype.ngOnInit = function () {
                    var that = this;
                    this.service.getLatestExchangeRates(function (json) {
                        if (json) {
                            that.fixedRateHigh = json.fixedRateHigh;
                            that.fixedRateLow = json.fixedRateLow;
                            that.currentRate = json.currentRate.toFixed(2);
                            that.order.exchangeRate = that.currentRate;
                            that.loadData();
                        }
                    });
                };
                OrderEditComponent.prototype.onSave = function () {
                    var _this = this;
                    var data = models_1.map(this.order);
                    if (!this.editMode) {
                        this.service.postOrder(JSON.stringify(data, this.emptyStringToNull))
                            .subscribe(function (response) {
                            _this.router.navigate(['订单']);
                        });
                    }
                };
                OrderEditComponent.prototype.loadData = function () {
                    var that = this;
                    if (!this.editMode) {
                        this.service.getSenderInfo(function (json) {
                            if (json) {
                                that.order.sender = json.sender;
                                that.order.senderPhone = json.senderPhone;
                            }
                        });
                    }
                    else {
                        this.service.getOrder(this.orderId, function (json) {
                            if (json) {
                                that.order.id = json.id;
                                that.order.orderTime = json.orderTime;
                                that.order.deliveryTime = json.deliveryTime;
                                that.order.receiveTime = json.receiveTime;
                                that.order.orderState = json.orderState;
                                that.order.paymentState = json.paymentState;
                                that.order.waybillNumber = json.waybillNumber;
                                that.order.freight = json.freight;
                                that.order.recipient = json.recipient;
                                that.order.phone = json.phone;
                                that.order.address = json.address;
                                that.order.sender = json.sender;
                                that.order.senderPhone = json.senderPhone;
                                json.customerOrders.forEach(function (co) {
                                    var c = new models_1.CustomerOrder(co.customerId, co.customerName, []);
                                    co.orderProducts.forEach(function (op) {
                                        var p = new models_1.OrderProduct(op.productId, op.productBrand, op.productName, op.cost, op.price, op.qty, that.currentRate);
                                        p.calculateProfit(that.currentRate);
                                        c.orderProducts.push(p);
                                    });
                                    c.updateSummary();
                                    that.order.customerOrders.push(c);
                                });
                                that.order.updateSummary();
                                that.order.updateStatus();
                                that.order.updateExpressText();
                            }
                        });
                    }
                };
                OrderEditComponent.prototype.emptyStringToNull = function (key, value) {
                    return value === "" ? null : value;
                };
                Object.defineProperty(OrderEditComponent.prototype, "title", {
                    get: function () { return this.editMode ? "编辑订单 " : "新建订单"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderEditComponent.prototype, "customerCount", {
                    get: function () { return this.order.customerOrders.length; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderEditComponent.prototype, "productCount", {
                    get: function () {
                        return this.order.customerOrders.ToList()
                            .Sum(function (co) { return co.orderProducts.ToList().Sum(function (op) { return op.qty; }); });
                    },
                    enumerable: true,
                    configurable: true
                });
                OrderEditComponent = __decorate([
                    core_1.Component({
                        selector: "order-edit",
                        templateUrl: "./src/app/components/orders/edit.html",
                        styleUrls: ["./src/app/components/orders/orders.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES,
                            orderCustomers_component_1.OrderCustomersComponent, orderProducts_component_1.OrderProductsComponent, orderInvoice_component_1.OrderInvoiceComponent, orderSummary_component_1.OrderSummaryComponent]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router, router_1.RouteParams])
                ], OrderEditComponent);
                return OrderEditComponent;
            }());
            exports_1("OrderEditComponent", OrderEditComponent);
        }
    }
});
//# sourceMappingURL=edit.component.js.map