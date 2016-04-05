/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />

import {Component, OnInit} from "angular2/core";
import {CORE_DIRECTIVES, FORM_DIRECTIVES} from "angular2/common";
import {Router, ROUTER_DIRECTIVES} from 'angular2/router';
import {ApiService} from "../api.service";

import '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js';


class YearGroup {
	constructor(public year: number, public monthGroups: MonthGroup[]) { }
}

class MonthGroup {
	constructor(public month: string, public models: OrderModel[]) { }
}

class OrderModel {
	constructor(public id: number, public orderTime: Date, public deliveryTime: Date, public receiveTime: Date,
		public orderState: string, public paymentState: string, public recipient: string, public phone: string,
		public address: string, public customerOrders: CustomerOrder[]) { }
}

class CustomerOrder {
	constructor(public customerId: number, public customerName: string, public orderProducts: OrderProduct[]) { }
}

class OrderProduct {
	constructor(public productId: number, public productBrand: string, public productName: string, public cost: number,
		public price: number, public qty: number) { }
}

@Component({
    selector: "customers",
    templateUrl: "./src/app/components/orders/list.html",
	styleUrls: ["./src/app/components/orders/orders.css"],
    providers: [ApiService],
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, ROUTER_DIRECTIVES]
})
export class OrdersComponent implements OnInit {
	data: YearGroup[] = [];
	//searchList: Customer[] = [];
	filterText = '';
	totalAmount = 0;

	private _filterText = '';

    constructor(private service: ApiService, private router: Router) { }

    ngOnInit() {
        this.get();
    }

	get() {
		var that = this;

		this.service.getOrders(json => {
			if (json) {

				var yearGroups = [].ToList<YearGroup>();
				var monthGroups = [].ToList<MonthGroup>();
				var orders = [].ToList<OrderModel>();
				var customers = [].ToList<CustomerOrder>();
				var products = [].ToList<OrderProduct>();

				json.forEach(c => {				
					c.monthGroups.forEach(mg => {
						mg.models.forEach(om => {
							om.customerOrders.forEach(co => {
								co.orderProducts.forEach(op => {
									products.Add(new OrderProduct(op.productId, op.productBrand, op.productName, op.cost,
										op.price, op.qty));
								});

								customers.Add(new CustomerOrder(co.customerId, co.customerName, products.ToArray()));
							});

							orders.Add(new OrderModel(om.id, om.orderTime, om.deliveryTime, om.receiveTime,
								om.orderState, om.paymentState, om.recipient, om.phone, om.address,
								customers.ToArray()));
						});

						monthGroups.Add(new MonthGroup(mg.month, orders.ToArray()));
					});

					yearGroups.Add(new YearGroup(c.year, monthGroups.ToArray()));
					this.data = yearGroups.ToArray();
				});
			}
		});
	}

	//onClearFilter() {
	//	this.onSearch('');
	//}

	//onSearch(value: string) {
	//	if (this.filterText !== value)
	//		this.filterText = value;

	//	if (this.filterText === this._filterText)
	//		return;

	//	this.searchList = [];
	//	if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
	//		this.searchList = this.customerList.ToList<Customer>()
	//			.Where(x => this.startsWith(x.name, this.filterText) ||
	//				this.startsWith(x.pinyin.toLowerCase(), this.filterText.toLowerCase()) ||
	//				this.startsWith(x.tel, this.filterText))
	//			.OrderBy(x => x.pinyin)
	//			.ToArray();
	//	}

	//	this._filterText = this.filterText;
	//}


	//onEdit(cid: number) {
	//	this.customerList.forEach(x => {
	//		if (x.id == cid && (!this.isListViewMode || x.selected)) {
	//			this.router.navigate(['CEdit', { id: cid }]);
	//			return;
	//		}
	//	});
	//}


	startsWith(str: string, searchString: string) {
		return str.substr(0, searchString.length) === searchString;
	};

	//get amount() { return this.searchList.length; }
	get diagnoise() { return JSON.stringify(this.data); }
}