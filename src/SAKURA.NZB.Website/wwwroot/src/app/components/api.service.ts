import "rxjs/Rx"
import {Http, Headers} from "angular2/http";
import {Injectable} from "angular2/core";

export const CUSTOMERS_ENDPOINT = "api/customers/";
export const BRANDS_ENDPOINT = "api/brands/";
export const PRODUCTS_ENDPOINT = "api/products/";
export const PRODUCTS_SEARCH_ENDPOINT = "api/products/search/";
export const PRODUCTS_BRIEF_ENDPOINT = "api/products/get-brief/";
export const PRODUCTS_GET_BY_BRAND_ENDPOINT = "api/products/get-by-brand/";
export const CATEGORIES_ENDPOINT = "api/categories/";
export const SUPPLIERS_ENDPOINT = "api/suppliers/";

export const ORDERS_ENDPOINT = "api/orders/";
export const ORDERS_SEARCH_ENDPOINT = "api/orders/search/";
export const ORDERS_STATUS_ENDPOINT = "api/dashboard/order-status/";
export const ORDER_DELIVER_ENDPOINT = "api/orders/deliver/";
export const ORDER_UPDATE_STATUS_ENDPOINT = "api/orders/update-order-status/";
export const ORDER_GET_LATEST_BY_PRODUCT_ENDPOINT = "api/orders/get-latest-by-product/";

export const EXPRESS_TRACK_ENDPOINT = "api/expresstrack/";

export const DASHBOARD_SUMMARY_ENDPOINT = "api/dashboard/summary/";
export const DASHBOARD_ANNUAL_SALES_ENDPOINT = "api/dashboard/annual-sales/";
export const DASHBOARD_TOP_SALE_PRODUCTS_ENDPOINT = "api/dashboard/top-sale-products/";
export const DASHBOARD_TOP_SALE_BRANDS_ENDPOINT = "api/dashboard/top-sale-brands/";
export const DASHBOARD_PAST_30_DAYS_PROFIT_ENDPOINT = "api/dashboard/past-30days-profit/";
export const DASHBOARD_PAST_30_DAYS_EXCHANGE_ENDPOINT = "api/dashboard/past-30days-exchange/";

@Injectable()
export class ApiService {
    constructor(private http: Http) { }

    get(onNext: (json: any) => void) {
        this.http.get("api/random").map(response => response.json()).subscribe(onNext);
    }
}