import {Component, OnInit, EventEmitter, Input, Output} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES, ControlGroup, Control, Validators} from "angular2/common";

import {ApiService} from "../api.service";
import {BrandIndexerDirective, Item} from "../../directives/brandIndexer.directive";
import {} from "../customers/edit.component";

@Component({
    selector: "order-product",
    templateUrl: "./src/app/components/orders/orderProducts.html",
	styleUrls: ["./src/app/components/orders/orderProducts.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, BrandIndexerDirective]
})

export class OrderProductsComponent implements OnInit {
	itemSource: Item[];
	selectedId: string = '123';

	constructor(private service: ApiService) { }

	ngOnInit() {
		this.getProducts();
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

	get data() { return JSON.stringify(this.itemSource); }
}