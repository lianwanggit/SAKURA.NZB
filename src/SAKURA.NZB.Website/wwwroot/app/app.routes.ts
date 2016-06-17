import { provideRouter }		from '@angular/router';
import { DashboardComponent }	from './components/dashboard/dashboard.component';
import { BrandsRoutes }			from './components/brands/brands.routes';
export const routes = [
	...BrandsRoutes,
	{ path: '/dashboard', component: DashboardComponent }
];
export const APP_ROUTER_PROVIDERS = [
	provideRouter(routes)
];