/// <reference path="../../../../lib/TypeScript-Linq/Scripts/typings/System/Collections/Generic/List.ts" />
System.register(["angular2/core", "angular2/common", 'angular2/http', 'angular2/router', "../api.service", "./models", "../../validators/numberValidator", '../../directives/clipboard.directive', 'ng2-bootstrap/ng2-bootstrap', '../../../../lib/TypeScript-Linq/Scripts/System/Collections/Generic/List.js'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, common_1, http_1, router_1, api_service_1, models_1, numberValidator_1, clipboard_directive_1, ng2_bootstrap_1;
    var OrderDeliveryModel, LatestExpressInfo, LatestExpressInfoList, OrdersComponent;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (router_1_1) {
                router_1 = router_1_1;
            },
            function (api_service_1_1) {
                api_service_1 = api_service_1_1;
            },
            function (models_1_1) {
                models_1 = models_1_1;
            },
            function (numberValidator_1_1) {
                numberValidator_1 = numberValidator_1_1;
            },
            function (clipboard_directive_1_1) {
                clipboard_directive_1 = clipboard_directive_1_1;
            },
            function (ng2_bootstrap_1_1) {
                ng2_bootstrap_1 = ng2_bootstrap_1_1;
            },
            function (_1) {}],
        execute: function() {
            OrderDeliveryModel = (function () {
                function OrderDeliveryModel(orderId, waybillNumber, weight, freight) {
                    this.orderId = orderId;
                    this.waybillNumber = waybillNumber;
                    this.weight = weight;
                    this.freight = freight;
                }
                return OrderDeliveryModel;
            }());
            LatestExpressInfo = (function () {
                function LatestExpressInfo(waybillNumber, expressInfo) {
                    this.waybillNumber = waybillNumber;
                    this.expressInfo = expressInfo;
                }
                ;
                return LatestExpressInfo;
            }());
            LatestExpressInfoList = (function () {
                function LatestExpressInfoList() {
                    this.expressInfo = [];
                }
                LatestExpressInfoList.prototype.getInfo = function (waybillNumber) {
                    var info = this.expressInfo.ToList()
                        .FirstOrDefault(function (x) { return x.waybillNumber == waybillNumber; });
                    return info == null ? '' : info.expressInfo;
                };
                return LatestExpressInfoList;
            }());
            OrdersComponent = (function () {
                function OrdersComponent(http, router, routeParams) {
                    this.http = http;
                    this.router = router;
                    this.routeParams = routeParams;
                    this.orderList = [].ToList();
                    this.deliveryModel = null;
                    this.expressTrackInfo = null;
                    this.latestExpressInfoList = new LatestExpressInfoList();
                    this.searchList = [];
                    this.filterText = '';
                    this.orderState = '';
                    this.paymentState = '';
                    this.orderStates = (new models_1.Dict()).orderStates;
                    this.orderStateKeys = [];
                    this.paymentStates = (new models_1.Dict()).paymentStates;
                    this.paymentStateKeys = [];
                    this.totalAmount = 0;
                    this.thisYear = moment().year();
                    this.freightRate = window.nzb.express.freightRate;
                    this.page = 1;
                    this.prevItems = [].ToList();
                    this.nextItems = [].ToList();
                    this.itemsPerPage = 0;
                    this.totalItemCount = 0;
                    this.isLoading = true;
                    this.colorSheet = ['bg-red', 'bg-pink', 'bg-purple', 'bg-deeppurple', 'bg-indigo', 'bg-blue', 'bg-teal', 'bg-green', 'bg-orange', 'bg-deeporange', 'bg-brown', 'bg-bluegrey'];
                    this._filterText = '';
                    this._isPrevItemsLoaded = false;
                    this._isNextItemsLoaded = false;
                    this._headers = new http_1.Headers();
                    this.deliveryModel = new OrderDeliveryModel(null, '', null, null);
                    this.expressTrackInfo = new models_1.ExpressTrack(null, null, null, null, null, null, null, []);
                    this.deliveryForm = new common_1.ControlGroup({
                        waybillNumber: new common_1.Control(this.deliveryModel.waybillNumber, common_1.Validators.required),
                        weight: new common_1.Control(this.deliveryModel.weight, numberValidator_1.NumberValidator.unspecified),
                        freight: new common_1.Control(this.deliveryModel.freight, numberValidator_1.NumberValidator.unspecified)
                    });
                    for (var key in this.orderStates) {
                        this.orderStateKeys.push(key);
                    }
                    for (var key in this.paymentStates) {
                        this.paymentStateKeys.push(key);
                    }
                    this._headers.append('Content-Type', 'application/json');
                    var pState = routeParams.get("paymentstate");
                    if (pState)
                        this.paymentState = pState;
                    var oState = routeParams.get("orderstate");
                    if (oState)
                        this.orderState = oState;
                }
                OrdersComponent.prototype.ngOnInit = function () {
                    this.get();
                };
                OrdersComponent.prototype.get = function (loadSearchList) {
                    var _this = this;
                    if (loadSearchList === void 0) { loadSearchList = true; }
                    this._isPrevItemsLoaded = false;
                    this._isNextItemsLoaded = false;
                    var that = this;
                    var url = api_service_1.ORDERS_SEARCH_ENDPOINT + '?page=' + this.page;
                    if (this.filterText)
                        url += '&keyword=' + this.filterText;
                    if (this.orderState)
                        url += '&state=' + this.orderState;
                    if (this.paymentState)
                        url += '&payment=' + this.paymentState;
                    this.http.get(url)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isLoading = false;
                        if (!json)
                            return;
                        that.orderList = [].ToList();
                        that.prevItems = [].ToList();
                        that.nextItems = [].ToList();
                        if (json.items) {
                            json.items.forEach(function (c) {
                                that.orderList.Add(that.map(c));
                            });
                        }
                        if (json.prevItems) {
                            json.prevItems.forEach(function (c) {
                                that.prevItems.Add(that.map(c));
                            });
                            that._isPrevItemsLoaded = true;
                        }
                        if (json.nextItems) {
                            json.nextItems.forEach(function (c) {
                                that.nextItems.Add(that.map(c));
                            });
                            that._isNextItemsLoaded = true;
                        }
                        that.itemsPerPage = json.itemsPerPage;
                        that.totalItemCount = json.totalItemCount;
                        if (loadSearchList)
                            that.addToSearchList(that.orderList);
                        _this.loadLatestExpressInfo(that.orderList.Select(function (o) { return o.waybillNumber; }).ToArray());
                    }, function (error) {
                        _this.isLoading = false;
                        console.log(error);
                    });
                    this.http.get(api_service_1.ORDERS_GET_COUNT_ENDPOINT)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isLoading = false;
                        if (!json)
                            return;
                        _this.totalAmount = json;
                    }, function (error) {
                        _this.isLoading = false;
                        console.log(error);
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
                    if (/^$|^[\u4e00-\u9fa5_a-zA-Z0-9 ]+$/g.test(this.filterText)) {
                        this.page = 1;
                        this.get();
                    }
                    this._filterText = this.filterText;
                };
                OrdersComponent.prototype.onSearchByState = function (state) {
                    if (state !== this.orderState)
                        this.orderState = state;
                    this.page = 1;
                    this.get();
                };
                OrdersComponent.prototype.onSearchByPayment = function (payment) {
                    if (payment !== this.paymentState)
                        this.paymentState = payment;
                    this.page = 1;
                    this.get();
                };
                OrdersComponent.prototype.onDeliverOpen = function (orderId) {
                    this.deliveryModel = new OrderDeliveryModel(orderId, '100001', null, null);
                    this.deliveryForm.controls['waybillNumber'].updateValue(this.deliveryModel.waybillNumber);
                    this.deliveryForm.controls['weight'].updateValue(this.deliveryModel.weight);
                    this.deliveryForm.controls['freight'].updateValue(this.deliveryModel.freight);
                    $('#myModal').modal('show');
                };
                OrdersComponent.prototype.onInputWeight = function (weight) {
                    this.deliveryForm.controls['freight'].updateValue((weight * this.freightRate).toFixed(2));
                };
                OrdersComponent.prototype.onDeliverySubmit = function () {
                    var _this = this;
                    $('#myModal').modal('hide');
                    this.deliveryModel.waybillNumber = this.deliveryForm.value.waybillNumber;
                    this.deliveryModel.weight = this.deliveryForm.value.weight;
                    this.deliveryModel.freight = this.deliveryForm.value.freight;
                    this.http
                        .post(api_service_1.ORDER_DELIVER_ENDPOINT, JSON.stringify(this.deliveryModel), { headers: this._headers })
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        if (!json)
                            return;
                        _this.get();
                    }, function (error) { return console.error(error); });
                };
                OrdersComponent.prototype.onOrderAction = function (orderId, action) {
                    var _this = this;
                    var model = { orderId: orderId, action: action };
                    this.http
                        .post(api_service_1.ORDER_UPDATE_STATUS_ENDPOINT, JSON.stringify(model), { headers: this._headers })
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        if (!json)
                            return;
                        _this.get();
                    }, function (error) { return console.error(error); });
                };
                OrdersComponent.prototype.onOpenExpressTrack = function (waybillNumber) {
                    var _this = this;
                    var that = this;
                    this.expressTrackInfo = new models_1.ExpressTrack(waybillNumber, null, null, null, null, null, null, []);
                    this.http.get(api_service_1.EXPRESS_TRACK_ENDPOINT + waybillNumber)
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        _this.isLoading = false;
                        if (!json)
                            return;
                        that.expressTrackInfo.waybillNumber = json.waybillNumber;
                        that.expressTrackInfo.from = json.from;
                        that.expressTrackInfo.destination = json.destination;
                        that.expressTrackInfo.itemCount = json.itemCount;
                        that.expressTrackInfo.status = json.status;
                        that.expressTrackInfo.isEmpty = false;
                        if (json.arrivedTime)
                            that.expressTrackInfo.arrivedTime = json.arrivedTime;
                        that.expressTrackInfo.recipient = json.recipient;
                        json.details.forEach(function (d) {
                            that.expressTrackInfo.details.push(new models_1.ExpressTrackRecord(moment(d.when).format('YYYY-MM-DD HH:mm'), d.where, d.content));
                        });
                    }, function (error) { return console.log(error); });
                    $('#expressTrackModal').modal('show');
                };
                OrdersComponent.prototype.onPageChanged = function (event) {
                    var loadSearchList = true;
                    this.searchList = [];
                    if (this.page - 1 == event.page && this._isPrevItemsLoaded) {
                        this.addToSearchList(this.prevItems);
                        loadSearchList = false;
                    }
                    if (this.page + 1 == event.page && this._isNextItemsLoaded) {
                        this.addToSearchList(this.nextItems);
                        loadSearchList = false;
                    }
                    this.page = event.page;
                    this.get(loadSearchList);
                };
                ;
                OrdersComponent.prototype.map = function (json) {
                    var monthSale = new models_1.MonthSale(json.monthSale.year, json.monthSale.month, json.monthSale.count, json.monthSale.cost, json.monthSale.income, json.monthSale.profit);
                    var customers = [].ToList();
                    json.customerOrders.forEach(function (co) {
                        var products = [].ToList();
                        co.orderProducts.forEach(function (op) {
                            products.Add(new models_1.OrderProduct(op.productId, op.productBrand, op.productName, op.cost, op.price, op.qty, op.purchased));
                        });
                        customers.Add(new models_1.CustomerOrder(co.customerId, co.customerName, products.ToArray()));
                    });
                    return new models_1.OrderModel(json.id, moment(json.orderTime).format('DD/MM/YYYY'), json.deliveryTime, json.receiveTime, json.orderState, json.paymentState, json.waybillNumber, json.weight, json.freight, json.recipient, json.phone, json.address, monthSale, this.orderStates, customers.ToArray());
                };
                OrdersComponent.prototype.addToSearchList = function (orders) {
                    var list = [].ToList();
                    var month = '';
                    var that = this;
                    orders.ForEach(function (o) {
                        if (o.monthSale.month != month) {
                            var monthSaleItem = new models_1.OrderModel(null, null, null, null, null, null, null, null, null, null, null, null, o.monthSale, null, [], true);
                            list.Add(monthSaleItem);
                            month = o.monthSale.month;
                        }
                        list.Add(o);
                    });
                    this.searchList = list.ToArray();
                };
                OrdersComponent.prototype.loadLatestExpressInfo = function (waybillNumbers) {
                    var _this = this;
                    var that = this;
                    var data = { WaybillNumbers: waybillNumbers };
                    this.http
                        .post(api_service_1.EXPRESS_TRACK_ENDPOINT + 'batchwaybillNumbers', JSON.stringify(data), { headers: this._headers })
                        .map(function (res) { return res.status === 404 ? null : res.json(); })
                        .subscribe(function (json) {
                        if (!json)
                            return;
                        _this.latestExpressInfoList.expressInfo.length = 0;
                        json.expressInfoList.forEach(function (x) {
                            _this.latestExpressInfoList.expressInfo.push(new LatestExpressInfo(x.waybillNumber, x.expressInfo));
                        });
                    }, function (error) { return console.error(error); });
                };
                OrdersComponent = __decorate([
                    core_1.Component({
                        selector: "customers",
                        templateUrl: "./src/app/components/orders/list.html",
                        styleUrls: ["./src/app/components/orders/orders.css"],
                        directives: [common_1.CORE_DIRECTIVES, common_1.FORM_DIRECTIVES, router_1.ROUTER_DIRECTIVES, clipboard_directive_1.ClipboardDirective, ng2_bootstrap_1.PAGINATION_DIRECTIVES]
                    }), 
                    __metadata('design:paramtypes', [http_1.Http, router_1.Router, router_1.RouteParams])
                ], OrdersComponent);
                return OrdersComponent;
            }());
            exports_1("OrdersComponent", OrdersComponent);
        }
    }
});
//# sourceMappingURL=list.component.js.map