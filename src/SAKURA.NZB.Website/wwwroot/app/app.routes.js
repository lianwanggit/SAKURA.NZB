"use strict";
var router_1 = require('@angular/router');
var dashboard_component_1 = require('./components/dashboard/dashboard.component');
var brands_routes_1 = require('./components/brands/brands.routes');
exports.routes = brands_routes_1.BrandsRoutes.concat([
    { path: '/dashboard', component: dashboard_component_1.DashboardComponent }
]);
exports.APP_ROUTER_PROVIDERS = [
    router_1.provideRouter(exports.routes)
];
//# sourceMappingURL=app.routes.js.map