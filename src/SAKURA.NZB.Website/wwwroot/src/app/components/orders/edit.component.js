/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/router', "../api.service", "./list.component", "./orderCustomers.component", "./orderProducts.component", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, common_1, router_1, api_service_1, list_component_1, orderCustomers_component_1, orderProducts_component_1;
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
            function (list_component_1_1) {
                list_component_1 = list_component_1_1;
            },
            function (orderCustomers_component_1_1) {
                orderCustomers_component_1 = orderCustomers_component_1_1;
            },
            function (orderProducts_component_1_1) {
                orderProducts_component_1 = orderProducts_component_1_1;
            },
            function (_1) {}],
        execute: function() {
            OrderEditComponent = (function () {
                function OrderEditComponent(service, router, params) {
                    this.service = service;
                    this.router = router;
                    this.editMode = false;
                    this.orderStates = (new list_component_1.Dict()).orderStates;
                    this.paymentStates = (new list_component_1.Dict()).paymentStates;
                    this.orderId = params.get("id");
                    if (this.orderId) {
                        this.editMode = true;
                    }
                    this.order = new list_component_1.OrderModel(null, null, null, null, "Created", "Unpaid", null, null, null, null, null, null, null, null, null, this.orderStates, []);
                    this.customerInfo = new orderCustomers_component_1.CustomerInfo(null, null, null);
                }
                OrderEditComponent.prototype.ngOnInit = function () {
                    var that = this;
                };
                OrderEditComponent.prototype.onCustomersChanged = function (c) {
                    var _this = this;
                    this.order.recipient = this.customerInfo.recipient;
                    this.order.phone = this.customerInfo.phone;
                    this.order.address = this.customerInfo.address;
                    this.order.customerOrders = [];
                    this.customerInfo.customers.forEach(function (c) {
                        var co = new list_component_1.CustomerOrder(c.id, c.name, []);
                        _this.order.customerOrders.push(co);
                    });
                };
                Object.defineProperty(OrderEditComponent.prototype, "title", {
                    get: function () { return this.editMode ? "编辑订单 " : "新建订单"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderEditComponent.prototype, "customerCount", {
                    get: function () { return this.customerInfo.customers.length; },
                    enumerable: true,
                    configurable: true
                });
                OrderEditComponent = __decorate([
                    core_1.Component({
                        selector: "order-edit",
                        templateUrl: "./src/app/components/orders/edit.html",
                        styleUrls: ["./src/app/components/orders/orders.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES, orderCustomers_component_1.OrderCustomersComponent, orderProducts_component_1.OrderProductsComponent]
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