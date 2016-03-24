import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/src/common/directives/core_directives";
import {ApiService} from "../api.service";

@Component({
    selector: "customers",
    templateUrl: "/partial/customers",
    providers: [ApiService],
    directives: CORE_DIRECTIVES
})
export class CustomersComponent implements OnInit {
    data: any;

    constructor(private service: ApiService) { }

    ngOnInit() {
        this.get();
    }

    get() {
        this.service.getCustomers(json => {
            if (json) {
                this.data = JSON.stringify(json);

            }
        });
    }
}