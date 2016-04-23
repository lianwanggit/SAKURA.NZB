System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var Dict, OrderModel, CustomerOrder, OrderProduct, Product;
    function map(order) {
        var o = {
            id: order.id, orderTime: new Date(), deliveryTime: order.deliveryTime, receiveTime: order.receiveTime,
            orderState: order.orderState, paymentState: order.paymentState, waybillNumber: order.waybillNumber, weight: order.weight,
            freight: order.freight, waybill: null, transitStatus: null, description: null, recipient: order.recipient,
            phone: order.phone, address: order.address, sender: order.sender, senderPhone: order.senderPhone, customerOrders: []
        };
        order.customerOrders.forEach(function (co) {
            var c = { customerId: co.customerId, customerName: co.customerName, orderProducts: [] };
            co.orderProducts.forEach(function (op) {
                c.orderProducts.push({
                    productId: op.productId, productBrand: op.productBrand, productName: op.productName, cost: op.cost, price: op.price, qty: op.qty
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
                    this.orderStates['Completed'] = '完成';
                    this.paymentStates['Unpaid'] = '未支付';
                    this.paymentStates['Paid'] = '已支付';
                }
                return Dict;
            }());
            exports_1("Dict", Dict);
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
                    this.isCustomersValid = false;
                    this.updateSummary();
                    this.updateStatus();
                    this.updateExpressText();
                }
                Object.defineProperty(OrderModel.prototype, "deliverable", {
                    get: function () { return this.recipient && this.phone && this.address; },
                    enumerable: true,
                    configurable: true
                });
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
                    this.strTotalProfit = formatCurrency(this.totalProfit, this.totalProfit.toFixed(2));
                };
                OrderModel.prototype.updateExpressText = function () {
                    var that = this;
                    var products = [].ToList();
                    this.customerOrders.forEach(function (co) {
                        co.orderProducts.forEach(function (op) {
                            var p = products.FirstOrDefault(function (x) { return x.id == op.productId; });
                            if (p)
                                p.qty += op.qty;
                            else
                                products.Add(new Product(op.productId, op.productBrand + ' ' + op.productName, op.qty));
                        });
                    });
                    var productsText = '';
                    products.ForEach(function (e, index) { productsText += '  ' + e.name + ' x' + e.qty + '\n'; });
                    this.expressText = '【寄件人】' + this.sender + '\n【寄件人電話】' + this.senderPhone + '\n【訂單內容】\n' + productsText + '【收件人】'
                        + this.recipient + '\n【收件地址】' + this.address + '\n【聯繫電話】' + this.phone;
                };
                Object.defineProperty(OrderModel.prototype, "isProductsValid", {
                    get: function () { return this.customerOrders.length && this.customerOrders.ToList().All(function (co) { return co.isProductsValid; }); },
                    enumerable: true,
                    configurable: true
                });
                Object.defineProperty(OrderModel.prototype, "isValid", {
                    get: function () { return this.isCustomersValid && this.isProductsValid; },
                    enumerable: true,
                    configurable: true
                });
                return OrderModel;
            }());
            exports_1("OrderModel", OrderModel);
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
                function OrderProduct(productId, productBrand, productName, cost, price, qty, exchangeRate) {
                    this.productId = productId;
                    this.productBrand = productBrand;
                    this.productName = productName;
                    this.cost = cost;
                    this.price = price;
                    this.qty = qty;
                    this.exchangeRate = exchangeRate;
                    this.calculateProfit(this.exchangeRate);
                }
                OrderProduct.prototype.calculateProfit = function (rate) {
                    this.profit = (this.price - this.cost * rate) * this.qty;
                    this.strProfit = formatCurrency(this.profit, this.profit.toFixed(2));
                };
                Object.defineProperty(OrderProduct.prototype, "isValid", {
                    get: function () { return this.cost >= 0 && this.price >= 0 && this.qty > 0; },
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
        }
    }
});
//# sourceMappingURL=models.js.map