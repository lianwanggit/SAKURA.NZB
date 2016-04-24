import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";

import {ApiService} from "../api.service";
import {CustomerOrder, OrderProduct, OrderModel} from "./models";

class ProductInfo {
	totalCost: number;
	constructor(public id: number, public name: string, public cost: number, public qty: number, public purchased: boolean) {
		this.totalCost = this.purchased ? 0 : this.cost * this.qty;
	}
}

@Component({
    selector: "order-invoice",
    templateUrl: "./src/app/components/orders/orderInvoice.html",
	styleUrls: ["./src/app/components/orders/orderInvoice.css"],
	providers: [ApiService],
    directives: [CORE_DIRECTIVES]
})

export class OrderInvoiceComponent {
	@Input() orderModel: OrderModel;
	totalCost: string;

	constructor(private service: ApiService) { }

	onPurchasedChanged(id: string) {
		this.orderModel.customerOrders.forEach(co => {
			co.orderProducts.forEach(op => {
				if (op.productId.toString() == id) {
					op.purchased = !op.purchased;
					return;
				}
			});
		});
	}

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
						op.cost, op.qty, op.purchased));
			});
		});

		this.totalCost = (list.Sum(p => p.totalCost) + this.orderModel.freight).toFixed(2);
		return list.OrderBy(p => p.name).ToArray();
	}
}