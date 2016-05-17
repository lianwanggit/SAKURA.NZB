import "rxjs/Rx"
import {Http, Headers} from "angular2/http";
import {Injectable} from "angular2/core";

export const CUSTOMERS_ENDPOINT = "api/customers/";
export const BRANDS_ENDPOINT = "api/brands/";
export const PRODUCTS_ENDPOINT = "api/products/";
export const PRODUCTS_SEARCH_ENDPOINT = "api/products/search/";
export const PRODUCTS_GET_BY_BRAND_ENDPOINT = "api/products/get-by-brand/";
export const CATEGORIES_ENDPOINT = "api/categories/";
export const SUPPLIERS_ENDPOINT = "api/suppliers/";
export const ORDER_GET_LATEST_BY_PRODUCT = "api/orders/get-latest-by-product/";

@Injectable()
export class ApiService {
    constructor(private http: Http) { }

    get(onNext: (json: any) => void) {
        this.http.get("api/random").map(response => response.json()).subscribe(onNext);
    }

	getCustomers(onNext: (json: any) => void) {
        this.http.get("api/customers").map(response => response.json()).subscribe(onNext);
    }

	getCustomer(id: string, onNext: (json: any) => void) {
        this.http.get("api/customers/" + id).map(response => response.json()).subscribe(onNext);
    }

	postCustomer(data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post('api/customers', data, { headers: headers });
    }

	putCustomer(id: string, data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.put('api/customers/' + id, data, { headers: headers });
    }

	getProducts(onNext: (json: any) => void) {
        this.http.get("api/products").map(response => response.json()).subscribe(onNext);
    }

	getProduct(id: string, onNext: (json: any) => void) {
        this.http.get("api/products/" + id).map(response => response.json()).subscribe(onNext);
    }
	
	getProductsBrief(onNext: (json: any) => void) {
        this.http.get("api/products/get-brief").map(response => response.json()).subscribe(onNext);
    }

	postProduct(data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post('api/products', data, { headers: headers });
    }

	putProduct(id: string, data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.put('api/products/' + id, data, { headers: headers });
    }

	getCategories(onNext: (json: any) => void) {
        this.http.get("api/categories").map(response => response.json()).subscribe(onNext);
    }

	postCategory(data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post('api/categories', data, { headers: headers });
    }

	putCategory(id: string, data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.put('api/categories/' + id, data, { headers: headers });
    }

	getBrands(onNext: (json: any) => void) {
        this.http.get("api/brands").map(response => response.json()).subscribe(onNext);
    }

	postBrand(data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post('api/brands', data, { headers: headers });
    }

	putBrand(id: string, data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.put('api/brands/' + id, data, { headers: headers });
    }

	getSuppliers(onNext: (json: any) => void) {
        this.http.get("api/suppliers").map(response => response.json()).subscribe(onNext);
    }

	postSupplier(data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post('api/suppliers', data, { headers: headers });
    }

	putSupplier(id: string, data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.put('api/suppliers/' + id, data, { headers: headers });
    }

	getLatestExchangeRates(onNext: (json: any) => void) {
        this.http.get("api/exchangerates/latest").map(response => response.json()).subscribe(onNext);
    }

	getOrders(onNext: (json: any) => void) {
        this.http.get("api/orders").map(response => response.json()).subscribe(onNext);
    }

	getOrder(id: string, onNext: (json: any) => void) {
        this.http.get("api/orders/" + id).map(response => response.json()).subscribe(onNext);
    }

	getSenderInfo(onNext: (json: any) => void) {
        this.http.get("api/orders/get-sender-info").map(response => response.json()).subscribe(onNext);
    }

	getSearchOrders(keyword: string, orderState: string, paymentState: string, onNext: (json: any) => void) {
		this.http.get("api/orders/search/" + keyword + '?orderState=' + orderState + '&paymentState=' + paymentState)
			.map(response => response.json()).subscribe(onNext);
	}

	postUpdateOrderStatus(data: string, onNext: (json: any) => void) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		this.http.post('api/orders/update-order-status' , data, { headers: headers })
			.map(response => response.json()).subscribe(onNext);
	}

	postDeliverOrder(data: string, onNext: (json: any) => void) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		this.http.post('api/orders/deliver', data, { headers: headers })
			.map(response => response.json()).subscribe(onNext);
	}

	postOrder(data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post('api/orders', data, { headers: headers });
    }

	putOrder(id: string, data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.put('api/orders/' + id, data, { headers: headers });
    }

	deleteOrder(id: string) {
		return this.http.delete('api/orders/' + id);
	}

	getDashboardSummary(onNext: (json: any) => void) {	
		this.http.get("api/dashboard/summary").map(response => response.json()).subscribe(onNext);
	}

	getDashboardAnnualSales(onNext: (json: any) => void) {
		this.http.get("api/dashboard/annual-sales").map(response => response.json()).subscribe(onNext);
	}

	getDashboardTopSaleProducts(onNext: (json: any) => void) {
		this.http.get("api/dashboard/top-sale-products").map(response => response.json()).subscribe(onNext);
	}

	getDashboardTopSaleBrands(onNext: (json: any) => void) {
		this.http.get("api/dashboard/top-sale-brands").map(response => response.json()).subscribe(onNext);
	}

	getDashboardPast30DaysProfit(onNext: (json: any) => void) {
		this.http.get("api/dashboard/past-30days-profit").map(response => response.json()).subscribe(onNext);
	}

	getDashboardPast30DaysExchange(onNext: (json: any) => void) {
		this.http.get("api/dashboard/past-30days-exchange").map(response => response.json()).subscribe(onNext);
	}

	getDashboardOrderStatus(onNext: (json: any) => void) {
		this.http.get("api/dashboard/order-status").map(response => response.json()).subscribe(onNext);
	}

	getExpressTrack(id: string, onNext: (json: any) => void) {
		this.http.get("api/expresstrack/" + id).map(response => response.json()).subscribe(onNext);
	}
}