/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/router', "../api.service", '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, api_service_1;
    var YearGroup, MonthGroup, OrderModel, CustomerOrder, OrderProduct, OrdersComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (_1) {}],
        execute: function() {
            YearGroup = (function () {
                function YearGroup(year, monthGroups) {
                    this.year = year;
                    this.monthGroups = monthGroups;
                }
                return YearGroup;
            })();
            MonthGroup = (function () {
                function MonthGroup(month, models) {
                    this.month = month;
                    this.models = models;
                }
                return MonthGroup;
            })();
            OrderModel = (function () {
                function OrderModel(id, orderTime, deliveryTime, receiveTime, orderState, paymentState, recipient, phone, address, customerOrders) {
                    this.id = id;
                    this.orderTime = orderTime;
                    this.deliveryTime = deliveryTime;
                    this.receiveTime = receiveTime;
                    this.orderState = orderState;
                    this.paymentState = paymentState;
                    this.recipient = recipient;
                    this.phone = phone;
                    this.address = address;
                    this.customerOrders = customerOrders;
                }
                return OrderModel;
            })();
            CustomerOrder = (function () {
                function CustomerOrder(customerId, customerName, orderProducts) {
                    this.customerId = customerId;
                    this.customerName = customerName;
                    this.orderProducts = orderProducts;
                }
                return CustomerOrder;
            })();
            OrderProduct = (function () {
                function OrderProduct(productId, productBrand, productName, cost, price, qty) {
                    this.productId = productId;
                    this.productBrand = productBrand;
                    this.productName = productName;
                    this.cost = cost;
                    this.price = price;
                    this.qty = qty;
                }
                return OrderProduct;
            })();
            OrdersComponent = (function () {
                function OrdersComponent(service, router) {
                    this.service = service;
                    this.router = router;
                    this.data = [];
                    //searchList: Customer[] = [];
                    this.filterText = '';
                    this.totalAmount = 0;
                    this._filterText = '';
                }
                OrdersComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                OrdersComponent.prototype.get = function () {
                    var _this = this;
                    var that = this;
                    this.service.getOrders(function (json) {
                        if (json) {
                            var yearGroups = [].ToList();
                            var monthGroups = [].ToList();
                            var orders = [].ToList();
                            var customers = [].ToList();
                            var products = [].ToList();
                            json.forEach(function (c) {
                                c.monthGroups.forEach(function (mg) {
                                    mg.models.forEach(function (om) {
                                        om.customerOrders.forEach(function (co) {
                                            co.orderProducts.forEach(function (op) {
                                                products.Add(new OrderProduct(op.productId, op.productBrand, op.productName, op.cost, op.price, op.qty));
                                            });
                                            customers.Add(new CustomerOrder(co.customerId, co.customerName, products.ToArray()));
                                        });
                                        orders.Add(new OrderModel(om.id, om.orderTime, om.deliveryTime, om.receiveTime, om.orderState, om.paymentState, om.recipient, om.phone, om.address, customers.ToArray()));
                                    });
                                    monthGroups.Add(new MonthGroup(mg.month, orders.ToArray()));
                                });
                                yearGroups.Add(new YearGroup(c.year, monthGroups.ToArray()));
                                _this.data = yearGroups.ToArray();
                            });
                        }
                    });
                };
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
                OrdersComponent.prototype.startsWith = function (str, searchString) {
                    return str.substr(0, searchString.length) === searchString;
                };
                ;
                Object.defineProperty(OrdersComponent.prototype, "diagnoise", {
                    //get amount() { return this.searchList.length; }
                    get: function () { return JSON.stringify(this.data); },
                    enumerable: true,
                    configurable: true
                });
                OrdersComponent = __decorate([
                    core_1.Component({
                        selector: "customers",
                        templateUrl: "./src/app/components/orders/list.html",
                        styleUrls: ["./src/app/components/orders/orders.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [api_service_1.ApiService, router_1.Router])
                ], OrdersComponent);
                return OrdersComponent;
            })();
            exports_1("OrdersComponent", OrdersComponent);
        }
    }
});
//# sourceMappingURL=list.component.js.map