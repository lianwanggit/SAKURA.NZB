"use strict";
var brand_list_component_1 = require('./brand-list.component');
var brand_detail_component_1 = require('./brand-detail.component');
exports.BrandsRoutes = [
    { path: '/brands', component: brand_list_component_1.BrandListComponent },
    { path: '/brand/:id', component: brand_detail_component_1.BrandDetailComponent }
];
//# sourceMappingURL=brands.routes.js.map