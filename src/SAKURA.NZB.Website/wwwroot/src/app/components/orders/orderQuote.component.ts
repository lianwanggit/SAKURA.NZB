import {Component, Input} from "angular2/core";
import {CORE_DIRECTIVES} from "angular2/common";

import {CustomerOrder, OrderProduct, OrderModel} from "./models";

class ProductInfo {
	totalPrice: number;
	constructor(public id: number, public name: string, public price: number, public qty: number) {
		this.totalPrice = this.price * this.qty;
	}
}

@Component({
    selector: "order-quote",
    templateUrl: "./src/app/components/orders/orderQuote.html",
	styleUrls: ["./src/app/components/orders/orderQuote.css"],
    directives: [CORE_DIRECTIVES]
})

export class OrderQuoteComponent {
	@Input() orderModel: OrderModel;
	totalPrice: string;

	constructor() { }

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
					list.Add(new ProductInfo(op.productId, op.productName, op.price, op.qty));
			});
		});

		this.totalPrice = (list.Sum(p => p.totalPrice)).toFixed(2);
		return list.OrderBy(p => p.name).ToArray();
	}
}