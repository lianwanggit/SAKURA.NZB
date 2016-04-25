import {Component, OnInit} from "angular2/core";
import {ApiService} from "./api.service";

class Summary {
	constructor(public customerCount: number, public brandCount: number, public productCount: number, public orderCount: number) { }
}

@Component({
    selector: "dashboard",
    templateUrl: "./src/app/components/dashboard.html",
	styleUrls: ["./src/app/components/dashboard.css"],
	providers: [ApiService]
})
export class DashboardComponent implements OnInit {
    summary: Summary = new Summary(0, 0, 0, 0);

    constructor(private service: ApiService) { }

    ngOnInit() {
		var that = this;

        this.service.getDashboardSummary(json => {
			if (json) {
				that.summary = new Summary(json.customerCount, json.brandCount, json.productCount, json.orderCount);
			}
		});
    }
}