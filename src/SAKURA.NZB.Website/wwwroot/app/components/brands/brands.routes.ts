import { RouterConfig }          from '@angular/router';
import { BrandListComponent }     from './brand-list.component';
import { BrandDetailComponent }   from './brand-detail.component';
export const BrandsRoutes: RouterConfig = [
	{ path: '/brands', component: BrandListComponent },
	{ path: '/brand/:id', component: BrandDetailComponent }
];