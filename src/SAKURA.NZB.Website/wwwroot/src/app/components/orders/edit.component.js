/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/router', "../api.service", "../../directives/alphaIndexer.directive", "../customers/edit.component", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, api_service_1, alphaIndexer_directive_1, edit_component_1;
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
            function (alphaIndexer_directive_1_1) {
                alphaIndexer_directive_1 = alphaIndexer_directive_1_1;
            },
            function (edit_component_1_1) {
                edit_component_1 = edit_component_1_1;
            },
            function (_1) {}],
        execute: function() {
            OrderEditComponent = (function () {
                function OrderEditComponent(service, router, params) {
                    this.service = service;
                    this.router = router;
                    this.editMode = false;
                    this.orderId = params.get("id");
                    if (this.orderId) {
                        this.editMode = true;
                    }
                }
                OrderEditComponent.prototype.ngOnInit = function () {
                    var that = this;
                    this.getCustomers();
                };
                OrderEditComponent.prototype.onElementSelected = function (id) {
                    this.getCustomer(id);
                };
                OrderEditComponent.prototype.getCustomer = function (id) {
                    var that = this;
                    this.service.getCustomer(id, function (json) {
                        if (json) {
                            that.selectedCustomer = new edit_component_1.Customer(json);
                        }
                    });
                };
                OrderEditComponent.prototype.getCustomers = function () {
                    var that = this;
                    this.service.getCustomers(function (json) {
                        if (json) {
                            var list = [].ToList();
                            json.forEach(function (x) {
                                var c = new edit_component_1.Customer(x);
                                list.Add(new alphaIndexer_directive_1.Element(c.id, c.fullName, c.namePinYin));
                            });
                            that.elementSource = list.ToArray();
                        }
                    });
                };
                Object.defineProperty(OrderEditComponent.prototype, "title", {
                    get: function () { return this.editMode ? "编辑订单 " : "新建订单"; },
                    enumerable: true,
                    configurable: true
                });
                OrderEditComponent = __decorate([
                    core_1.Component({
                        selector: "product-edit",
                        templateUrl: "./src/app/components/orders/edit.html",
                        styleUrls: ["./src/app/components/orders/orders.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES, alphaIndexer_directive_1.AlphaIndexerDirective]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router, router_1.RouteParams])
                ], OrderEditComponent);
                return OrderEditComponent;
            })();
            exports_1("OrderEditComponent", OrderEditComponent);
        }
    }
});
//# sourceMappingURL=edit.component.js.map