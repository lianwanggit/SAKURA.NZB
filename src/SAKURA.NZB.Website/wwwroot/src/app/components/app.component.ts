/// <reference path="../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {AsyncRoute, Router, RouteDefinition, RouteConfig, Location, ROUTER_DIRECTIVES} from "angular2/router";
import {StaticComponent} from "./static.component";
import {CustomersComponent} from "./customers/list.component";
import {CustomerEditComponent} from "./customers/edit.component";
import {ProductsComponent} from "./products/list.component";

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
                { path: "/index", component: StaticComponent, name: "Index", useAsDefault: true },
				{ path: "/customers", component: CustomersComponent, name: "客户", useAsDefault: false },
				{ path: "/customers/add", component: CustomerEditComponent, name: "CAdd", useAsDefault: false },
				{ path: "/customers/edit/:id", component: CustomerEditComponent, name: "CEdit", useAsDefault: false },
				{ path: "/products", component: ProductsComponent, name: "产品", useAsDefault: false },

                new AsyncRoute({
                    path: "/sub",
                    name: "Sub",
                    loader: () => System.import("src/app/components/mvc.component").then(c => c["MvcComponent"])
                }),
                new AsyncRoute({
                    path: "/numbers",
                    name: "Numbers",
                    loader: () => System.import("src/app/components/api.component").then(c => c["ApiComponent"])
                })
            ];

            this.router.config(this.routes);
			this.menuRoutes = this.routes.ToList<RouteDefinition>()
				.Where(x => (x.path.match(/\//g) || []).length < 2)
				.ToArray();
        }
    }

    getLinkStyle(route: RouteDefinition) {
        return this.location.path().indexOf(route.path) > -1;
    }

	getIsMainMenu(route: RouteDefinition) {
		return  (route.path.match(/\//g) || []).length < 2;
	}
}