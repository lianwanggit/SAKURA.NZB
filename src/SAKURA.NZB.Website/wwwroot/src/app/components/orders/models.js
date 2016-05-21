System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Dict, OrderModel, MonthSale, CustomerOrder, OrderProduct, Product, ExpressTrack, ExpressTrackRecord;
    function map(order) {
        var o = {
            id: order.id, orderTime: order.orderTime, deliveryTime: order.deliveryTime, receiveTime: order.receiveTime,
            orderState: order.orderState, paymentState: order.paymentState, waybillNumber: order.waybillNumber, weight: order.weight,
            freight: order.freight, waybill: null, description: null, recipient: order.recipient,
            phone: order.phone, address: order.address, monthSale: null, customerOrders: []
        };
        order.customerOrders.forEach(function (co) {
            var c = { customerId: co.customerId, customerName: co.customerName, orderProducts: [] };
            co.orderProducts.forEach(function (op) {
                c.orderProducts.push({
                    productId: op.productId, productBrand: op.productBrand, productName: op.productName, cost: op.cost, price: op.price, qty: op.qty, purchased: op.purchased
                });
            });
            o.customerOrders.push(c);
        });
        return o;
    }
    exports_1("map", map);
    function formatCurrency(num, str) {
        return num > 0 ? '+' + str : str;
    }
    exports_1("formatCurrency", formatCurrency);
    return {
        setters:[],
        execute: function() {
            Dict = (function () {
                function Dict() {
                    this.orderStates = {};
                    this.paymentStates = {};
                    this.orderStates['Created'] = '已创建';
                    this.orderStates['Confirmed'] = '已确认';
                    this.orderStates['Delivered'] = '已发货';
                    this.orderStates['Received'] = '已签收';
                    this.orderStates['Completed'] = '已完成';
                    this.paymentStates['Unpaid'] = '未支付';
                    this.paymentStates['Paid'] = '已支付';
                }
                return Dict;
            }());
            exports_1("Dict", Dict);
            OrderModel = (function () {
                function OrderModel(id, orderTime, deliveryTime, receiveTime, orderState, paymentState, waybillNumber, weight, freight, recipient, phone, address, monthSale, orderStates, customerOrders, isMonthSaleItem) {
                    if (isMonthSaleItem === void 0) { isMonthSaleItem = false; }
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
                    this.monthSale = monthSale;
                    this.orderStates = orderStates;
                    this.customerOrders = customerOrders;
                    this.isMonthSaleItem = isMonthSaleItem;
                    this.isCustomersValid = false;
                    this.isExpressValid = false;
                    if (!isMonthSaleItem) {
                        this.updateSummary();
                        this.updateStatus();
                        this.updateExpressText();
                    }
                }
                Object.defineProperty(OrderModel.prototype, "deliverable", {
                    get: function () { return this.recipient && this.phone && this.address; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderModel.prototype, "delivered", {
                    get: function () { return this.orderState != 'Created' && this.orderState != 'Confirmed'; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderModel.prototype, "hasExpressWaybill", {
                    get: function () { return this.waybillNumber; },
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
                    var list = this.customerOrders.ToList();
                    this.totalCost = list.Sum(function (co) { return co.totalCost; }) + this.freight;
                    this.totalPrice = list.Sum(function (co) { return co.totalPrice; });
                    this.totalQty = list.Sum(function (co) { return co.totalQty; });
                    this.totalProfit = this.totalPrice - this.totalCost * window.nzb.rate.live;
                    this.strTotalProfit = formatCurrency(this.totalProfit, this.totalProfit.toFixed(2));
                };
                OrderModel.prototype.updateExpressText = function () {
                    var that = this;
                    var products = [].ToList();
                    this.customerOrders.forEach(function (co) {
                        co.orderProducts.forEach(function (op) {
                            var p = products.FirstOrDefault(function (x) { return x.id == op.productId && x.name == op.productName; });
                            if (p)
                                p.qty += op.qty;
                            else
                                products.Add(new Product(op.productId, op.productName, op.qty));
                        });
                    });
                    var productsText = '';
                    products.OrderBy(function (p) { return p.name; }).ForEach(function (e, index) { productsText += '  ' + e.name + ' x' + e.qty + '\n'; });
                    this.expressText = '【寄件人】' + window.nzb.express.sender + '\n【寄件人電話】' + window.nzb.express.senderPhone + '\n【訂單內容】\n' + productsText + '【收件人】'
                        + this.recipient + '\n【收件地址】' + this.address + '\n【聯繫電話】' + this.phone;
                };
                Object.defineProperty(OrderModel.prototype, "isProductsValid", {
                    get: function () { return this.customerOrders.length && this.customerOrders.ToList().All(function (co) { return co.isProductsValid; }); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderModel.prototype, "isValid", {
                    get: function () { return this.isCustomersValid && this.isExpressValid && this.isProductsValid; },
                    enumerable: true,
                    configurable: true
                });
                return OrderModel;
            }());
            exports_1("OrderModel", OrderModel);
            MonthSale = (function () {
                function MonthSale(month, count, cost, income, profit) {
                    this.count = count;
                    this.cost = cost;
                    this.income = income;
                    this.profit = profit;
                    this.month = moment().month(month - 1).format('MMMM');
                }
                return MonthSale;
            }());
            exports_1("MonthSale", MonthSale);
            CustomerOrder = (function () {
                function CustomerOrder(customerId, customerName, orderProducts) {
                    this.customerId = customerId;
                    this.customerName = customerName;
                    this.orderProducts = orderProducts;
                    this.updateSummary();
                }
                CustomerOrder.prototype.updateSummary = function () {
                    var list = this.orderProducts.ToList();
                    this.totalCost = list.Sum(function (op) { return op.cost * op.qty; });
                    this.totalPrice = list.Sum(function (op) { return op.price * op.qty; });
                    this.totalQty = list.Sum(function (op) { return op.qty; });
                    this.totalProfit = list.Sum(function (op) { return op.profit; });
                    this.strTotalProfit = formatCurrency(this.totalProfit, this.totalProfit.toFixed(2));
                };
                Object.defineProperty(CustomerOrder.prototype, "isProductsValid", {
                    get: function () { return this.orderProducts.length && this.orderProducts.ToList().All(function (op) { return op.isValid; }); },
                    enumerable: true,
                    configurable: true
                });
                return CustomerOrder;
            }());
            exports_1("CustomerOrder", CustomerOrder);
            OrderProduct = (function () {
                function OrderProduct(productId, productBrand, productName, cost, price, qty, purchased) {
                    this.productId = productId;
                    this.productBrand = productBrand;
                    this.productName = productName;
                    this.cost = cost;
                    this.price = price;
                    this.qty = qty;
                    this.purchased = purchased;
                    this.calculateProfit();
                }
                OrderProduct.prototype.calculateProfit = function () {
                    this.profit = (this.price - this.cost * window.nzb.rate.live) * this.qty;
                    this.strProfit = formatCurrency(this.profit, this.profit.toFixed(2));
                };
                Object.defineProperty(OrderProduct.prototype, "isValid", {
                    get: function () {
                        return this.productName
                            && !isNaN(this.cost) && this.cost >= 0
                            && !isNaN(this.price) && this.price >= 0
                            && !isNaN(this.qty) && this.qty > 0;
                    },
                    enumerable: true,
                    configurable: true
                });
                return OrderProduct;
            }());
            exports_1("OrderProduct", OrderProduct);
            Product = (function () {
                function Product(id, name, qty) {
                    this.id = id;
                    this.name = name;
                    this.qty = qty;
                }
                return Product;
            }());
            exports_1("Product", Product);
            ExpressTrack = (function () {
                function ExpressTrack(waybillNumber, from, destination, itemCount, status, arrivedTime, recipient, details) {
                    this.waybillNumber = waybillNumber;
                    this.from = from;
                    this.destination = destination;
                    this.itemCount = itemCount;
                    this.status = status;
                    this.arrivedTime = arrivedTime;
                    this.recipient = recipient;
                    this.details = details;
                    this.isEmpty = true;
                }
                Object.defineProperty(ExpressTrack.prototype, "duration", {
                    get: function () {
                        if (this.details.length) {
                            var start = moment(this.details[0].when);
                            var end = this.arrivedTime ? moment(this.arrivedTime) : moment();
                            var ms = end.diff(start);
                            return moment.duration(ms).humanize();
                        }
                        return "";
                    },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExpressTrack.prototype, "arrivedTimeDayText", {
                    get: function () { return this.arrivedTime ? moment(this.arrivedTime).format('MM-DD') : "到达时间"; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExpressTrack.prototype, "arrivedTimeText", {
                    get: function () { return this.arrivedTime ? moment(this.arrivedTime).format('HH:mm') : ""; },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(ExpressTrack.prototype, "recipientText", {
                    get: function () { return this.recipient ? this.recipient : "签收人"; },
                    enumerable: true,
                    configurable: true
                });
                return ExpressTrack;
            }());
            exports_1("ExpressTrack", ExpressTrack);
            ExpressTrackRecord = (function () {
                function ExpressTrackRecord(when, where, content) {
                    this.when = when;
                    this.where = where;
                    this.content = content;
                }
                return ExpressTrackRecord;
            }());
            exports_1("ExpressTrackRecord", ExpressTrackRecord);
        }
    }
});
//# sourceMappingURL=models.js.map