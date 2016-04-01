import "rxjs/Rx"
import {Http, Headers} from "angular2/http";
import {Injectable} from "angular2/core";

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

	postProduct(data: string) {
		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post('api/products', data, { headers: headers });
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
}