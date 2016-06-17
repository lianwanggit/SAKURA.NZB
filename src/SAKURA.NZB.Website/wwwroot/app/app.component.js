/// <reference path="../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require("@angular/router");
var common_1 = require("@angular/common");
var dashboard_component_1 = require("./components/dashboard/dashboard.component");
var brand_list_component_1 = require("./components/brands/brand-list.component");
require('../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js');
var AppComponent = (function () {
    //	public routes: RouteDefinition[] = null;
    //	menuRoutes: RouteDefinition[] = null;
    function AppComponent(location, router) {
        this.location = location;
        this.router = router;
    }
    AppComponent.prototype.ngOnInit = function () {
        //     if (this.routes === null) {
        //         this.routes = [
        //             { path: "/index", component: DashboardComponent, name: "首页", useAsDefault: true },
        //	//{ path: "/orders", component: OrdersComponent, name: "订单", useAsDefault: false },
        //	//{ path: "/orders/add", component: OrderEditComponent, name: "OAdd", useAsDefault: false },
        //	//{ path: "/orders/edit/:id", component: OrderEditComponent, name: "OEdit", useAsDefault: false },
        //	//{ path: "/orders/view/:id", component: OrderEditComponent, name: "OView", data: { readonly: true }, useAsDefault: false },
        //	//{ path: "/products", component: ProductsComponent, name: "产品", useAsDefault: false },
        //	//{ path: "/products/edit/base/:type", component: ProductBaseEditComponent, name: "PbeEdit", useAsDefault: false },
        //	//{ path: "/products/add", component: ProductEditComponent, name: "PAdd", useAsDefault: false },
        //	//{ path: "/products/edit/:id", component: ProductEditComponent, name: "PEdit", useAsDefault: false },
        //	//{ path: "/brands", component: BrandsComponent, name: "品牌", useAsDefault: false },
        //	//{ path: "/customers", component: CustomersComponent, name: "客户", useAsDefault: false },
        //	//{ path: "/customers/add", component: CustomerEditComponent, name: "CAdd", useAsDefault: false },
        //	//{ path: "/customers/edit/:id", component: CustomerEditComponent, name: "CEdit", useAsDefault: false },
        //	//{ path: "/exchangehistories", component: ExchangeHistoriesComponent, name: "换汇记录", useAsDefault: false },
        //	//{ path: "/exchangehistories/add", component: ExchangeHistoryEditComponent, name: "EHAdd", useAsDefault: false },
        //	//{ path: "/exchangehistories/edit/:id", component: ExchangeHistoryEditComponent, name: "EHEdit", useAsDefault: false },
        //	//{ path: "/settings", component: SettingsComponent, name: "设置", useAsDefault: false }
        //         ];
        //         this.router.config(this.routes);
        //this.menuRoutes = this.routes.ToList<RouteDefinition>()
        //	.Where(x => (x.path.match(/\//g) || []).length < 2)
        //	.ToArray();
        //     }
    };
    AppComponent.prototype.onClickHangfire = function ($event) {
        window.location.href = "/hangfire";
        $event.preventDefault();
        return false;
    };
    AppComponent.prototype.getLinkStyle = function (route) {
        return this.location.path().indexOf(route) > -1;
    };
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            template: "\n\t\t<nav class=\"navbar navbar-inverse\">\n\t\t\t<div class=\"container-fluid\">\n\t\t\t\t<div class=\"navbar-header\">\n\t\t\t\t\t<a class=\"navbar-brand\" href=\"#\" style=\"padding: 10px\">\n\t\t\t\t\t\t<img src=\"./images/favicon_32.png\" width=\"32\" height=\"32\" alt=\"Brand\" />\n\t\t\t\t\t</a>\n\t\t\t\t</div>\n\t\t\t\t<ul class=\"nav navbar-nav\">\n\t\t\t\t\t<li [class.active]=\"getLinkStyle('index')\">\n\t\t\t\t\t\t<a [routerLink]=\"['/index']\">\u9996\u9875</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li [class.active]=\"getLinkStyle('brands')\">\n\t\t\t\t\t\t<a [routerLink]=\"['/brands']\">\u54C1\u724C</a>\n\t\t\t\t\t</li>\n\t\t\t\t\t<li><a (click)=\"onClickHangfire($event)\">Hangfire</a></li>\n\t\t\t\t</ul>\n\t\t\t</div>\n\t\t</nav>\n\t\t<div class=\"content padding has-header\">\n\t\t\t<router-outlet></router-outlet>\n\t\t</div>",
            directives: [router_1.ROUTER_DIRECTIVES]
        }),
        router_1.Routes([
            { path: "/index", component: dashboard_component_1.DashboardComponent },
            { path: "/brands", component: brand_list_component_1.BrandListComponent }
        ]), 
        __metadata('design:paramtypes', [common_1.Location, router_1.Router])
    ], AppComponent);
    return AppComponent;
}());
exports.AppComponent = AppComponent;
//# sourceMappingURL=app.component.js.map