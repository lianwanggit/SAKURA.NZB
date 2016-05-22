/// <reference path="../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {AsyncRoute, Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";
import {DashboardComponent} from "./dashboard.component";
import {CustomersComponent} from "./customers/list.component";
import {CustomerEditComponent} from "./customers/edit.component";
import {ProductsComponent} from "./products/list.component";
import {ProductBaseEditComponent} from "./products/baseEdit.component";
import {ProductEditComponent} from "./products/edit.component";
import {OrdersComponent} from "./orders/list.component";
import {OrderEditComponent} from "./orders/edit.component";
import {BrandsComponent} from "./brands/brands.component";
import {ExchangeHistoriesComponent} from "./exchangehistory/list.component";
import {ExchangeHistoryEditComponent} from "./exchangehistory/edit.component";

declare var System: any;
import '../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

@Component({
    selector: "app",
    templateUrl: "./src/app/components/app.html",
    directives: [ROUTER_DIRECTIVES]
})

export class AppComponent implements OnInit {
    public routes: RouteDefinition[] = null;
	menuRoutes: RouteDefinition[] = null;

    constructor(private router: Router, private location: Location) {
    }


    ngOnInit() {
        if (this.routes === null) {
            this.routes = [
                { path: "/index", component: DashboardComponent, name: "首页", useAsDefault: true },
				{ path: "/orders", component: OrdersComponent, name: "订单", useAsDefault: false },
				{ path: "/orders/add", component: OrderEditComponent, name: "OAdd", useAsDefault: false },
				{ path: "/orders/edit/:id", component: OrderEditComponent, name: "OEdit", useAsDefault: false },
				{ path: "/orders/view/:id", component: OrderEditComponent, name: "OView", data: { readonly: true }, useAsDefault: false },
				{ path: "/products", component: ProductsComponent, name: "产品", useAsDefault: false },
				{ path: "/products/edit/base/:type", component: ProductBaseEditComponent, name: "PbeEdit", useAsDefault: false },
				{ path: "/products/add", component: ProductEditComponent, name: "PAdd", useAsDefault: false },
				{ path: "/products/edit/:id", component: ProductEditComponent, name: "PEdit", useAsDefault: false },
				{ path: "/brands", component: BrandsComponent, name: "品牌", useAsDefault: false },			
				{ path: "/customers", component: CustomersComponent, name: "客户", useAsDefault: false },
				{ path: "/customers/add", component: CustomerEditComponent, name: "CAdd", useAsDefault: false },
				{ path: "/customers/edit/:id", component: CustomerEditComponent, name: "CEdit", useAsDefault: false },
				{ path: "/exchangehistories", component: ExchangeHistoriesComponent, name: "换汇记录", useAsDefault: false },
				{ path: "/exchangehistories/add", component: ExchangeHistoryEditComponent, name: "EHAdd", useAsDefault: false },
				{ path: "/exchangehistories/edit/:id", component: ExchangeHistoryEditComponent, name: "EHEdit", useAsDefault: false },

                //new AsyncRoute({
                //    path: "/sub",
                //    name: "Sub",
                //    loader: () => System.import("src/app/components/mvc.component").then(c => c["MvcComponent"])
                //}),
                //new AsyncRoute({
                //    path: "/numbers",
                //    name: "Numbers",
                //    loader: () => System.import("src/app/components/api.component").then(c => c["ApiComponent"])
                //})
            ];

            this.router.config(this.routes);
			this.menuRoutes = this.routes.ToList<RouteDefinition>()
				.Where(x => (x.path.match(/\//g) || []).length < 2)
				.ToArray();
        }
    }

	onClickHangfire($event) {
		window.location.href = "/hangfire";
		$event.preventDefault();
		return false;
	}

    getLinkStyle(route: RouteDefinition) {
        return this.location.path().indexOf(route.path) > -1;
    }

	getIsMainMenu(route: RouteDefinition) {
		return (route.path.match(/\//g) || []).length < 2;
	}
}