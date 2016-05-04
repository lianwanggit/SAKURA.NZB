﻿import {Component, OnInit, EventEmitter, Input, Output} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";

import {ApiService} from "../api.service";
import {BrandIndexerDirective, Item} from "../../directives/brandIndexer.directive";
import {CustomerOrder, OrderProduct, OrderModel} from "./models";
import {Category, Brand, Supplier, Product, Quote} from "../products/models";

@Component({
    selector: "order-products",
    templateUrl: "./src/app/components/orders/orderProducts.html",
	styleUrls: ["./src/app/components/orders/orderProducts.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, BrandIndexerDirective]
})

export class OrderProductsComponent implements OnInit {
	itemSource: Item[];
	selectedCustomerId: string = '';

	@Input() orderModel: OrderModel;
	@Input() exchangeRate: number;
	@Input() viewMode: boolean;

	constructor(private service: ApiService) { }

	ngOnInit() {
		this.getProducts();
	}

	onItemSelected(id: string) {
		if (!this.isLoaded)
			return;

		var coList = this.orderModel.customerOrders.ToList<CustomerOrder>();
		if (coList.All(co => co.customerId.toString() != this.selectedCustomerId))
			this.selectedCustomerId = coList.First().customerId.toString();

		var co = coList.First(co => co.customerId.toString() == this.selectedCustomerId);
		var opList = co.orderProducts.ToList<OrderProduct>();
		var that = this;
		this.service.getProduct(id, json => {
			if (json) {
				var product = new Product(json);

				var op = opList.FirstOrDefault(p => p.productId == product.id);
				if (!op) {
					var lowestCost = 0; 
					if (product.quotes.length)
						lowestCost = product.quotes.ToList<Quote>().Min(q => q.price);
					co.orderProducts.push(new OrderProduct(product.id, product.brand.name, product.brand.name + ' ' + product.name,
						lowestCost, product.price, 1, false, this.exchangeRate));
				}
				else
					op.qty += 1;

				that.onModelChanged(co);
			}
		});
	}

	onRemoveItem(cid: number, pid: number) {
		var co = this.orderModel.customerOrders.ToList<CustomerOrder>().FirstOrDefault(c => c.customerId == cid);
		if (!co) return;

		for (var i = co.orderProducts.length; i--;) {
			if (co.orderProducts[i].productId == pid) {
				co.orderProducts.splice(i, 1);

				this.onModelChanged(co);
				return;
			}
		}
	}

	onSelectCustomer(id: string) {
		this.selectedCustomerId = id;
	}

	onModelChanged(co: CustomerOrder, op: OrderProduct = null) {
		if (op)
			op.calculateProfit(this.exchangeRate);

		co.updateSummary();
		this.orderModel.updateSummary();
		this.orderModel.updateExpressText();
	}

	getProducts() {
		var that = this;

		this.service.getProductsBrief(json => {
			if (json) {
				var list = [].ToList<Item>();
				json.forEach(x => {
					list.Add(new Item(x.id, x.name, x.brand));
				});

				that.itemSource = list.ToArray();
			}
		});
	}

	get isLoaded() { return this.orderModel && this.orderModel.customerOrders && this.orderModel.customerOrders.length; }
	get customerOrders() { return this.isLoaded ? this.orderModel.customerOrders : []; }
}