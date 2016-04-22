import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";

import {ApiService} from "../api.service";
import {CustomerOrder, OrderProduct, OrderModel} from "./models";

class ProductInfo {
	constructor(public id: number, public name: string, public cost: number, public costCny, public price: number, public qty: number,
		public profit: number, public strProfit) {
	}
}

@Component({
    selector: "order-summary",
    templateUrl: "./src/app/components/orders/orderSummary.html",
	styleUrls: ["./src/app/components/orders/orderCustomers.css",
		"./src/app/components/orders/orderInvoice.css"],
	providers: [ApiService],
    directives: [CORE_DIRECTIVES]
})

export class OrderSummaryComponent {
	@Input() orderModel: OrderModel;
	@Input() exchangeRate: number;
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
						op.cost, (op.cost * this.exchangeRate).toFixed(2), op.price, op.qty,
						op.profit, op.strProfit));
			});
		});

		return list.ToArray();
	}

	get isLoaded() { return this.orderModel && this.orderModel.customerOrders && this.orderModel.customerOrders.length; }
}