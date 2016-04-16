/// <reference path="../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/router", "./static.component", "./customers/list.component", "./customers/edit.component", "./products/list.component", "./products/baseEdit.component", "./products/edit.component", "./orders/list.component", "./orders/edit.component", '../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
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
    var core_1, router_1, static_component_1, list_component_1, edit_component_1, list_component_2, baseEdit_component_1, edit_component_2, list_component_3, edit_component_3;
    var AppComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (static_component_1_1) {
                static_component_1 = static_component_1_1;
            },
            function (list_component_1_1) {
                list_component_1 = list_component_1_1;
            },
            function (edit_component_1_1) {
                edit_component_1 = edit_component_1_1;
            },
            function (list_component_2_1) {
                list_component_2 = list_component_2_1;
            },
            function (baseEdit_component_1_1) {
                baseEdit_component_1 = baseEdit_component_1_1;
            },
            function (edit_component_2_1) {
                edit_component_2 = edit_component_2_1;
            },
            function (list_component_3_1) {
                list_component_3 = list_component_3_1;
            },
            function (edit_component_3_1) {
                edit_component_3 = edit_component_3_1;
            },
            function (_1) {}],
        execute: function() {
            AppComponent = (function () {
                function AppComponent(router, location) {
                    this.router = router;
                    this.location = location;
                    this.routes = null;
                    this.menuRoutes = null;
                }
                AppComponent.prototype.ngOnInit = function () {
                    if (this.routes === null) {
                        this.routes = [
                            { path: "/index", component: static_component_1.StaticComponent, name: "Index", useAsDefault: true },
                            { path: "/orders", component: list_component_3.OrdersComponent, name: "订单", useAsDefault: false },
                            { path: "/orders/add", component: edit_component_3.OrderEditComponent, name: "OAdd", useAsDefault: false },
                            { path: "/orders/edit/:id", component: edit_component_3.OrderEditComponent, name: "OEdit", useAsDefault: false },
                            { path: "/products", component: list_component_2.ProductsComponent, name: "产品", useAsDefault: false },
                            { path: "/products/edit/base/:type", component: baseEdit_component_1.ProductBaseEditComponent, name: "PbeEdit", useAsDefault: false },
                            { path: "/products/add", component: edit_component_2.ProductEditComponent, name: "PAdd", useAsDefault: false },
                            { path: "/products/edit/:id", component: edit_component_2.ProductEditComponent, name: "PEdit", useAsDefault: false },
                            { path: "/customers", component: list_component_1.CustomersComponent, name: "客户", useAsDefault: false },
                            { path: "/customers/add", component: edit_component_1.CustomerEditComponent, name: "CAdd", useAsDefault: false },
                            { path: "/customers/edit/:id", component: edit_component_1.CustomerEditComponent, name: "CEdit", useAsDefault: false },
                            new router_1.AsyncRoute({
                                path: "/sub",
                                name: "Sub",
                                loader: function () { return System.import("src/app/components/mvc.component").then(function (c) { return c["MvcComponent"]; }); }
                            }),
                            new router_1.AsyncRoute({
                                path: "/numbers",
                                name: "Numbers",
                                loader: function () { return System.import("src/app/components/api.component").then(function (c) { return c["ApiComponent"]; }); }
                            })
                        ];
                        this.router.config(this.routes);
                        this.menuRoutes = this.routes.ToList()
                            .Where(function (x) { return (x.path.match(/\//g) || []).length < 2; })
                            .ToArray();
                    }
                };
                AppComponent.prototype.onClickHangfire = function ($event) {
                    window.location.href = "/hangfire";
                    $event.preventDefault();
                    return false;
                };
                AppComponent.prototype.getLinkStyle = function (route) {
                    return this.location.path().indexOf(route.path) > -1;
                };
                AppComponent.prototype.getIsMainMenu = function (route) {
                    return (route.path.match(/\//g) || []).length < 2;
                };
                AppComponent = __decorate([
                    core_1.Component({
                        selector: "app",
                        templateUrl: "./src/app/components/app.html",
                        directives: [router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [router_1.Router, router_1.Location])
                ], AppComponent);
                return AppComponent;
            }());
            exports_1("AppComponent", AppComponent);
        }
    }
});
//# sourceMappingURL=app.component.js.map