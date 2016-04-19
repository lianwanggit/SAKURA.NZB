import {Component, Input, OnInit, OnChanges} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";

import {ApiService} from "../api.service";
import {CustomerOrder, OrderProduct, OrderModel} from "./list.component";

class SenderInfo {
	constructor(public sender: string, public senderPhone: string) { }
}

@Component({
    selector: "order-invoice",
    templateUrl: "./src/app/components/orders/orderInvoice.html",
	styleUrls: ["./src/app/components/orders/orderCustomers.css",
		"./src/app/components/orders/orderInvoice.css"],
	providers: [ApiService],
    directives: [CORE_DIRECTIVES]
})

export class OrderInvoiceComponent implements OnInit, OnChanges {
	senderInfo = new SenderInfo(null, null);
	@Input() orderModel: OrderModel;

	constructor(private service: ApiService) { }

	ngOnInit() {
		var that = this;
	}

	ngOnChanges() {
		if (this.orderModel) {
			console.log(JSON.stringify(this.orderModel));
		}
	}
}