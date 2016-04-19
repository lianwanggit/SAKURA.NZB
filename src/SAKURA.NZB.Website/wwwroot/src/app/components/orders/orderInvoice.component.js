System.register(["angular2/core", "angular2/common", "../api.service", "./list.component"], function(exports_1, context_1) {
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
    var core_1, common_1, api_service_1, list_component_1;
    var SenderInfo, OrderInvoiceComponent;
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
            function (list_component_1_1) {
                list_component_1 = list_component_1_1;
            }],
        execute: function() {
            SenderInfo = (function () {
                function SenderInfo(sender, senderPhone) {
                    this.sender = sender;
                    this.senderPhone = senderPhone;
                }
                return SenderInfo;
            }());
            OrderInvoiceComponent = (function () {
                function OrderInvoiceComponent(service) {
                    this.service = service;
                    this.senderInfo = new SenderInfo(null, null);
                }
                OrderInvoiceComponent.prototype.ngOnInit = function () {
                    var that = this;
                };
                OrderInvoiceComponent.prototype.ngOnChanges = function () {
                    if (this.orderModel) {
                        console.log(JSON.stringify(this.orderModel));
                    }
                };
                __decorate([
                    core_1.Input(), 
                    __metadata('design:type', list_component_1.OrderModel)
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