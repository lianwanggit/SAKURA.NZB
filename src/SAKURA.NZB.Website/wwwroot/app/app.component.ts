/// <reference path="../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import { Component, OnInit } from '@angular/core';
import { Routes, Router, ROUTER_DIRECTIVES, ROUTER_PROVIDERS } from "@angular/router";
import { Location } from "@angular/common";


import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { BrandListComponent } from "./components/brands/brand-list.component";
import '../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';

@Component({
	selector: 'app',
	template: `
		<nav class="navbar navbar-inverse">
			<div class="container-fluid">
				<div class="navbar-header">
					<a class="navbar-brand" href="#" style="padding: 10px">
						<img src="./images/favicon_32.png" width="32" height="32" alt="Brand" />
					</a>
				</div>
				<ul class="nav navbar-nav">
					<li [class.active]="getLinkStyle('index')">
						<a [routerLink]="['/index']">首页</a>
					</li>
					<li [class.active]="getLinkStyle('brands')">
						<a [routerLink]="['/brands']">品牌</a>
					</li>
					<li><a (click)="onClickHangfire($event)">Hangfire</a></li>
				</ul>
			</div>
		</nav>
		<div class="content padding has-header">
			<router-outlet></router-outlet>
		</div>`,
	directives: [ROUTER_DIRECTIVES]
})

@Routes([
		{ path: "/index", component: DashboardComponent },
		{ path: "/brands", component: BrandListComponent }
])

export class AppComponent implements OnInit {
//	public routes: RouteDefinition[] = null;
//	menuRoutes: RouteDefinition[] = null;

    constructor(private location: Location, private router: Router) {
    }

	ngOnInit() {
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
    }

	onClickHangfire($event: any) {
		window.location.href = "/hangfire";
		$event.preventDefault();
		return false;
	}

    getLinkStyle(route: string) {
        return this.location.path().indexOf(route) > -1;
    }

//	getIsMainMenu(route: RouteDefinition) {
//		return (route.path.match(/\//g) || []).length < 2;
//	}
}