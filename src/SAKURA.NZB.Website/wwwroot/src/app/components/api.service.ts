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
}