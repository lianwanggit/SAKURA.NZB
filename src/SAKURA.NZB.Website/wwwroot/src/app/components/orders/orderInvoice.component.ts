import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";

import {ApiService} from "../api.service";
import {CustomerOrder, OrderProduct, OrderModel} from "./list.component";

class ProductInfo {
	constructor(public id: number, public name: string, public cost: number, public qty: number) { }
}

@Component({
    selector: "order-invoice",
    templateUrl: "./src/app/components/orders/orderInvoice.html",
	styleUrls: ["./src/app/components/orders/orderCustomers.css",
		"./src/app/components/orders/orderInvoice.css"],
	providers: [ApiService],
    directives: [CORE_DIRECTIVES]
})

export class OrderInvoiceComponent {
	@Input() orderModel: OrderModel;

	constructor(private service: ApiService) { }

	get productList() {
		if (!this.orderModel || !this.orderModel.customerOrders)
			return [];

		var list = [].ToList<ProductInfo>();
		this.orderModel.customerOrders.forEach(co => {
			co.orderProducts.forEach(op => {
				var p = list.FirstOrDefault(l => l.id == op.productId);
				if (p)
					p.qty += op.qty;
				else
					list.Add(new ProductInfo(op.productId, op.productBrand + ' ' + op.productName,
						op.cost, op.qty));
			});
		});

		return list.ToArray();
	}

}