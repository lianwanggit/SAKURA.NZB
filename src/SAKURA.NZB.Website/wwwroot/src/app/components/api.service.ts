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
        this.http.get("api/Customers").map(response => response.json()).subscribe(onNext);
    }

	getCustomer(id: string, onNext: (json: any) => void) {
        this.http.get("api/Customers/" + id).map(response => response.json()).subscribe(onNext);
    }

	postCustomer(data: any) {

		var headers = new Headers();
		headers.append('Content-Type', 'application/json');

		return this.http.post('api/Customers/', data, { headers: headers });
    }
}