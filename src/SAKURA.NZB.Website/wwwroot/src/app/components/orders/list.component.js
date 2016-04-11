/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/router', "../api.service", '../../directives/clipboard.directive', '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js', 'moment'], function(exports_1) {
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, router_1, api_service_1, clipboard_directive_1, moment_1;
    var Dict, YearGroup, MonthGroup, OrderModel, CustomerOrder, OrderProduct, OrderDeliveryModel, OrdersComponent;
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
            function (clipboard_directive_1_1) {
                clipboard_directive_1 = clipboard_directive_1_1;
            },
            function (_1) {},
            function (moment_1_1) {
                moment_1 = moment_1_1;
            }],
        execute: function() {
            Dict = (function () {
                function Dict() {
                    this.orderStates = {};
                    this.paymentStates = {};
                    this.orderStates['Created'] = '已创建';
                    this.orderStates['Confirmed'] = '已确认';
                    this.orderStates['Delivered'] = '已发货';
                    this.orderStates['Received'] = '已签收';
                    this.orderStates['Completed'] = '完成';
                    this.paymentStates['Unpaid'] = '未支付';
                    this.paymentStates['Paid'] = '已支付';
                }
                return Dict;
            })();
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
                    this.updateSummary();
                }
                MonthGroup.prototype.updateSummary = function () {
                    var list = this.models.ToList();
                    this.totalCost = (list.Sum(function (om) { return om.totalCost; })).toFixed(2);
                    this.totalPrice = (list.Sum(function (om) { return om.totalPrice; })).toFixed(2);
                    this.totalProfit = (list.Sum(function (om) { return om.totalProfit; })).toFixed(2);
                };
                return MonthGroup;
            })();
            OrderModel = (function () {
                function OrderModel(id, orderTime, deliveryTime, receiveTime, orderState, paymentState, waybillNumber, weight, freight, recipient, phone, address, sender, senderPhone, exchangeRate, orderStates, customerOrders) {
                    this.id = id;
                    this.orderTime = orderTime;
                    this.deliveryTime = deliveryTime;
                    this.receiveTime = receiveTime;
                    this.orderState = orderState;
                    this.paymentState = paymentState;
                    this.waybillNumber = waybillNumber;
                    this.weight = weight;
                    this.freight = freight;
                    this.recipient = recipient;
                    this.phone = phone;
                    this.address = address;
                    this.sender = sender;
                    this.senderPhone = senderPhone;
                    this.exchangeRate = exchangeRate;
                    this.orderStates = orderStates;
                    this.customerOrders = customerOrders;
                    this.updateSummary();
                    this.updateStatus();
                    var that = this;
                    var products = '';
                    this.customerOrders.forEach(function (co) {
                        co.orderProducts.forEach(function (op) {
                            products += ' ' + op.productBrand + ' ' + op.productName + ' x' + op.qty + '\n';
                        });
                    });
                    this.expressText = '【寄件人】' + this.sender + '\n【寄件人電話】' + this.senderPhone + '\n【訂單內容】\n' + products + '【收件人】'
                        + this.recipient + '\n【收件地址】' + this.address + '\n【聯繫電話】' + this.phone;
                }
                Object.defineProperty(OrderModel.prototype, "delivered", {
                    get: function () { return this.waybillNumber && this.weight && this.freight; },
                    enumerable: true,
                    configurable: true
                });
                OrderModel.prototype.updateStatus = function () {
                    var seed = this.paymentState == 'Paid' ? 20 : 0;
                    this.statusText = this.orderStates[this.orderState];
                    switch (this.orderState) {
                        case 'Created':
                            this.statusRate = 0 + seed;
                            break;
                        case 'Confirmed':
                            this.statusRate = 30 + seed;
                            break;
                        case 'Delivered':
                            this.statusRate = 50 + seed;
                            break;
                        case 'Received':
                            this.statusRate = 75 + seed;
                            break;
                        case 'Completed':
                            this.statusRate = 100;
                            break;
                        default:
                            this.statusRate = 0;
                            this.statusText = '未知';
                    }
                };
                OrderModel.prototype.updateSummary = function () {
                    var freightCost = 0;
                    if (this.freight)
                        freightCost = this.freight * this.exchangeRate;
                    var list = this.customerOrders.ToList();
                    this.totalCost = list.Sum(function (co) { return co.totalCost; });
                    this.totalPrice = list.Sum(function (co) { return co.totalPrice; });
                    this.totalQty = list.Sum(function (co) { return co.totalQty; });
                    this.totalProfit = list.Sum(function (co) { return co.totalProfit; }) - freightCost;
                    this.strTotalProfit = this.totalProfit.toFixed(2);
                };
                return OrderModel;
            })();
            CustomerOrder = (function () {
                function CustomerOrder(customerId, customerName, orderProducts) {
                    this.customerId = customerId;
                    this.customerName = customerName;
                    this.orderProducts = orderProducts;
                    var list = this.orderProducts.ToList();
                    this.totalCost = list.Sum(function (op) { return op.cost * op.qty; });
                    this.totalPrice = list.Sum(function (op) { return op.price * op.qty; });
                    this.totalQty = list.Sum(function (op) { return op.qty; });
                    this.totalProfit = list.Sum(function (op) { return op.profit; });
                    this.strTotalProfit = this.totalProfit.toFixed(2);
                }
                return CustomerOrder;
            })();
            OrderProduct = (function () {
                function OrderProduct(productId, productBrand, productName, cost, price, qty, exchangeRate) {
                    this.productId = productId;
                    this.productBrand = productBrand;
                    this.productName = productName;
                    this.cost = cost;
                    this.price = price;
                    this.qty = qty;
                    this.exchangeRate = exchangeRate;
                    this.profit = (this.price - this.cost * this.exchangeRate) * this.qty;
                    this.strProfit = this.profit.toFixed(2);
                }
                return OrderProduct;
            })();
            OrderDeliveryModel = (function () {
                function OrderDeliveryModel(orderId, waybillNumber, weight, freight) {
                    this.orderId = orderId;
                    this.waybillNumber = waybillNumber;
                    this.weight = weight;
                    this.freight = freight;
                }
                return OrderDeliveryModel;
            })();
            OrdersComponent = (function () {
                function OrdersComponent(service, router) {
                    this.service = service;
                    this.router = router;
                    this.data = [];
                    this.deliveryModel = null;
                    this.filteredData = [];
                    this.filterText = '';
                    this.orderState = '';
                    this.paymentState = '';
                    this.orderStates = (new Dict()).orderStates;
                    this.orderStateKeys = [];
                    this.paymentStates = (new Dict()).paymentStates;
                    this.paymentStateKeys = [];
                    this.totalAmount = 0;
                    this.amount = 0;
                    this.thisYear = moment_1.default().year();
                    this._filterText = '';
                    this.colorSheet = ['bg-red', 'bg-pink', 'bg-purple', 'bg-deeppurple', 'bg-indigo', 'bg-blue', 'bg-teal', 'bg-green', 'bg-orange', 'bg-deeporange', 'bg-brown', 'bg-bluegrey'];
                    this.deliveryModel = new OrderDeliveryModel(null, '', null, null);
                    this.deliveryForm = new common_1.ControlGroup({
                        waybillNumber: new common_1.Control(this.deliveryModel.waybillNumber, common_1.Validators.required),
                        weight: new common_1.Control(this.deliveryModel.weight, common_1.Validators.required),
                        freight: new common_1.Control(this.deliveryModel.freight, common_1.Validators.required),
                    });
                    for (var key in this.orderStates) {
                        this.orderStateKeys.push(key);
                    }
                    for (var key in this.paymentStates) {
                        this.paymentStateKeys.push(key);
                    }
                }
                OrdersComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                OrdersComponent.prototype.get = function () {
                    var that = this;
                    this.service.getLatestExchangeRates(function (json) {
                        if (json) {
                            that.fixedRateHigh = json.fixedRateHigh;
                            that.fixedRateLow = json.fixedRateLow;
                            that.currentRate = json.currentRate.toFixed(2);
                            that.loadOrders();
                        }
                    });
                };
                OrdersComponent.prototype.loadOrders = function () {
                    var that = this;
                    this.service.getOrders(function (json) {
                        if (json)
                            that.map(json, that, true);
                    });
                };
                OrdersComponent.prototype.onClearFilter = function () {
                    this.onSearchByKeyword('');
                };
                OrdersComponent.prototype.onSearchByKeyword = function (value) {
                    if (this.filterText !== value)
                        this.filterText = value;
                    if (this.filterText === this._filterText)
                        return;
                    if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText))
                        this.onSearch(this.orderState, this.paymentState);
                    this._filterText = this.filterText;
                };
                OrdersComponent.prototype.onSearch = function (orderState, paymentState) {
                    var that = this;
                    this.service.getSearchOrders(this.filterText, orderState, paymentState, function (json) {
                        if (json)
                            that.map(json, that, false);
                    });
                };
                //onEdit(cid: number) {
                //	this.customerList.forEach(x => {
                //		if (x.id == cid && (!this.isListViewMode || x.selected)) {
                //			this.router.navigate(['CEdit', { id: cid }]);
                //			return;
                //		}
                //	});
                //}
                OrdersComponent.prototype.onDeliverOpen = function (orderId) {
                    this.deliveryModel = new OrderDeliveryModel(orderId, '', null, null);
                    this.deliveryForm.controls['waybillNumber'].updateValue(this.deliveryModel.waybillNumber);
                    this.deliveryForm.controls['weight'].updateValue(this.deliveryModel.weight);
                    this.deliveryForm.controls['freight'].updateValue(this.deliveryModel.freight);
                    $('#myModal').modal('show');
                };
                OrdersComponent.prototype.onDeliverySubmit = function () {
                    var _this = this;
                    $('#myModal').modal('hide');
                    this.deliveryModel.waybillNumber = this.deliveryForm.value.waybillNumber;
                    this.deliveryModel.weight = this.deliveryForm.value.weight;
                    this.deliveryModel.freight = this.deliveryForm.value.freight;
                    this.service.PostDeliverOrder(JSON.stringify(this.deliveryModel), function (json) {
                        if (json) {
                            var id = json.orderId;
                            var orderState = json.orderState;
                            var waybillNumber = json.waybillNumber;
                            var weight = json.weight;
                            var freight = json.freight;
                            _this.data.forEach(function (yg) {
                                yg.monthGroups.forEach(function (mg) {
                                    var found = false;
                                    mg.models.forEach(function (om) {
                                        if (om.id == id) {
                                            om.orderState = orderState;
                                            om.waybillNumber = waybillNumber;
                                            om.weight = weight;
                                            om.freight = freight;
                                            om.updateSummary();
                                            om.updateStatus();
                                            found = true;
                                        }
                                    });
                                    if (found) {
                                        mg.updateSummary();
                                        return;
                                    }
                                });
                            });
                        }
                        ;
                    });
                };
                OrdersComponent.prototype.onOrderAction = function (orderId, action) {
                    var _this = this;
                    var model = { orderId: orderId, action: action };
                    this.service.PostUpdateOrderStatus(JSON.stringify(model), function (json) {
                        if (json) {
                            var id = json.orderId;
                            var orderState = json.orderState;
                            var paymentState = json.paymentState;
                            _this.data.forEach(function (yg) {
                                yg.monthGroups.forEach(function (mg) {
                                    mg.models.forEach(function (om) {
                                        if (om.id == id) {
                                            om.paymentState = paymentState;
                                            om.orderState = orderState;
                                            om.updateStatus();
                                            return;
                                        }
                                    });
                                });
                            });
                        }
                        ;
                    });
                };
                OrdersComponent.prototype.map = function (json, that, initial) {
                    var yearGroups = [].ToList();
                    var orderCount = 0;
                    that.data = [];
                    json.forEach(function (c) {
                        var monthGroups = [].ToList();
                        c.monthGroups.forEach(function (mg) {
                            var orders = [].ToList();
                            mg.models.forEach(function (om) {
                                var customers = [].ToList();
                                om.customerOrders.forEach(function (co) {
                                    var products = [].ToList();
                                    co.orderProducts.forEach(function (op) {
                                        products.Add(new OrderProduct(op.productId, op.productBrand, op.productName, op.cost, op.price, op.qty, that.currentRate));
                                    });
                                    customers.Add(new CustomerOrder(co.customerId, co.customerName, products.ToArray()));
                                });
                                orders.Add(new OrderModel(om.id, moment_1.default(om.orderTime).format('YYYY-MM-DD'), om.deliveryTime, om.receiveTime, om.orderState, om.paymentState, om.waybillNumber, om.weight, om.freight, om.recipient, om.phone, om.address, om.sender, om.senderPhone, that.currentRate, that.orderStates, customers.ToArray()));
                                orderCount += 1;
                            });
                            monthGroups.Add(new MonthGroup(mg.month, orders.ToArray()));
                        });
                        yearGroups.Add(new YearGroup(c.year, monthGroups.ToArray()));
                        that.data = yearGroups.ToArray();
                    });
                    if (initial)
                        that.totalAmount = orderCount;
                    that.amount = orderCount;
                };
                Object.defineProperty(OrdersComponent.prototype, "diagnoise", {
                    get: function () { return JSON.stringify(this.filterText + this.orderState + this.paymentState); },
                    enumerable: true,
                    configurable: true
                });
                OrdersComponent = __decorate([
                    core_1.Component({
                        selector: "customers",
                        templateUrl: "./src/app/components/orders/list.html",
                        styleUrls: ["./src/app/components/orders/orders.css"],
                        providers: [api_service_1.ApiService],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES, clipboard_directive_1.ClipboardDirective]
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