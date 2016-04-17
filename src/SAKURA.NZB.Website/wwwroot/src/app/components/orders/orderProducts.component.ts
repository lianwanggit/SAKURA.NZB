import {Component, OnInit, EventEmitter, Input, Output, OnChanges} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";

import {ApiService} from "../api.service";
import {BrandIndexerDirective, Item} from "../../directives/brandIndexer.directive";
import {CustomerOrder, OrderModel} from "./list.component";

@Component({
    selector: "order-product",
    templateUrl: "./src/app/components/orders/orderProducts.html",
	styleUrls: ["./src/app/components/orders/orderCustomers.css",
		"./src/app/components/orders/orderProducts.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, BrandIndexerDirective]
})

export class OrderProductsComponent implements OnInit, OnChanges  {
	itemSource: Item[];
	selectedId: string = '123';

	@Input() customerOrders: CustomerOrder[];
	constructor(private service: ApiService) { }

	ngOnInit() {
		this.getProducts();
	}

	ngOnChanges(changes: { [propName: string]: SimpleChange }) {
		
	}

	onItemSelected(id: string) {
		this.selectedId = id;
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

	get data() { return JSON.stringify(this.customerOrders); }
}