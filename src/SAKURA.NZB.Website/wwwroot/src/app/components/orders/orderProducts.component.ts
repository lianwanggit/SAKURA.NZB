import {Component, OnInit, EventEmitter, Input, Output, OnChanges} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";

import {ApiService} from "../api.service";
import {BrandIndexerDirective, Item} from "../../directives/brandIndexer.directive";
import {CustomerOrder, OrderProduct, OrderModel} from "./list.component";
import {Category, Brand, Supplier, Product, Quote} from "../products/models";

@Component({
    selector: "order-product",
    templateUrl: "./src/app/components/orders/orderProducts.html",
	styleUrls: ["./src/app/components/orders/orderCustomers.css",
		"./src/app/components/orders/orderProducts.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, BrandIndexerDirective]
})

export class OrderProductsComponent implements OnInit, OnChanges {
	itemSource: Item[];
	selectedCustomerId: string = '';

	@Input() customerOrders: CustomerOrder[];
	constructor(private service: ApiService) { }

	ngOnInit() {
		this.getProducts();
	}

	ngOnChanges(changes: { [propName: string]: SimpleChange }) {
		if (this.customerOrders) {

		}
		console.log(JSON.stringify(changes));
	}

	onItemSelected(id: string) {
		if (!this.customerOrders || !this.customerOrders.length)
			return;

		var coList = this.customerOrders.ToList<CustomerOrder>();
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
					var lowestCost = null; 
					if (product.quotes.length)
						lowestCost = product.quotes.ToList<Quote>().Min(q => q.price);
					co.orderProducts.push(new OrderProduct(product.id, product.brand.name, product.name, lowestCost, product.price, 1, 0));
				}
				else
					op.qty += 1;		
			}
		});
	}

	onSelectCustomer(id: string) {
		this.selectedCustomerId = id;
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

	getFirstCustomer() {

	}

	get data() { return JSON.stringify(this.customerOrders); }
}