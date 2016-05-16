declare var moment: any;

export class Dict {
	orderStates = {};
	paymentStates = {};

	constructor() {
		this.orderStates['Created'] = '已创建';
		this.orderStates['Confirmed'] = '已确认';
		this.orderStates['Delivered'] = '已发货';
		this.orderStates['Received'] = '已签收';
		this.orderStates['Completed'] = '已完成';

		this.paymentStates['Unpaid'] = '未支付';
		this.paymentStates['Paid'] = '已支付';
	}
}

export class OrderModel {
	totalCost: number;
	totalPrice: number;
	totalQty: number;
	totalProfit: number;
	strTotalProfit: string;
	statusRate: number;
	statusText: string;
	expressText: string;
	isCustomersValid: boolean = false;
	isExpressValid: boolean = false;

	constructor(public id: number, public orderTime: any, public deliveryTime: Date, public receiveTime: Date,
		public orderState: string, public paymentState: string, public waybillNumber: string, public weight: number,
		public freight: number, public recipient: string, public phone: string, public address: string,
		public sender: string, public senderPhone: string, public exchangeRate: number, public orderStates: Object,
		public customerOrders: CustomerOrder[]) {

		this.updateSummary();
		this.updateStatus();
		this.updateExpressText();
	}

	get deliverable() { return this.recipient && this.phone && this.address; }
	get delivered() { return this.orderState != 'Created' && this.orderState != 'Confirmed'; }
	get hasExpressWaybill() { return this.waybillNumber; }

	updateStatus() {
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
	}

	updateSummary() {
		var list = this.customerOrders.ToList<CustomerOrder>();
		this.totalCost = list.Sum(co => co.totalCost) + this.freight;
		this.totalPrice = list.Sum(co => co.totalPrice);
		this.totalQty = list.Sum(co => co.totalQty);
		this.totalProfit = this.totalPrice - this.totalCost * this.exchangeRate;
		this.strTotalProfit = formatCurrency(this.totalProfit, this.totalProfit.toFixed(2));
	}

	updateExpressText() {
		var that = this;
		var products = [].ToList<Product>();
		this.customerOrders.forEach(co => {
			co.orderProducts.forEach(op => {
				var p = products.FirstOrDefault(x => x.id == op.productId);
				if (p)
					p.qty += op.qty;
				else
					products.Add(new Product(op.productId, op.productName, op.qty));
			});
		});

		var productsText = '';
		products.OrderBy(p => p.name).ForEach((e, index) => { productsText += '  ' + e.name + ' x' + e.qty + '\n'; });

		this.expressText = '【寄件人】' + this.sender + '\n【寄件人電話】' + this.senderPhone + '\n【訂單內容】\n' + productsText + '【收件人】'
			+ this.recipient + '\n【收件地址】' + this.address + '\n【聯繫電話】' + this.phone;
	}

	get isProductsValid() { return this.customerOrders.length && this.customerOrders.ToList<CustomerOrder>().All(co => co.isProductsValid); }
	get isValid() { return this.isCustomersValid && this.isExpressValid && this.isProductsValid; }
}

export class CustomerOrder {
	totalCost: number;
	totalPrice: number;
	totalQty: number;
	totalProfit: number;
	strTotalProfit: string;

	constructor(public customerId: number, public customerName: string, public orderProducts: OrderProduct[]) {
		this.updateSummary();
	}

	updateSummary() {
		var list = this.orderProducts.ToList<OrderProduct>();
		this.totalCost = list.Sum(op => op.cost * op.qty);
		this.totalPrice = list.Sum(op => op.price * op.qty);
		this.totalQty = list.Sum(op => op.qty);
		this.totalProfit = list.Sum(op => op.profit);
		this.strTotalProfit = formatCurrency(this.totalProfit, this.totalProfit.toFixed(2));
	}

	get isProductsValid() { return this.orderProducts.length && this.orderProducts.ToList<OrderProduct>().All(op => op.isValid); }
}

export class OrderProduct {
	profit: number;
	strProfit: string;

	constructor(public productId: number, public productBrand: string, public productName: string, public cost: number,
		public price: number, public qty: number, public purchased: boolean, public exchangeRate: number) {
		this.calculateProfit(this.exchangeRate);
	}

	calculateProfit(rate: number) {
		this.profit = (this.price - this.cost * rate) * this.qty;
		this.strProfit = formatCurrency(this.profit, this.profit.toFixed(2));
	}

	get isValid() {
		return this.productName
			&& !isNaN(this.cost) && this.cost >= 0
			&& !isNaN(this.price) && this.price >= 0
			&& !isNaN(this.qty) && this.qty > 0;
	}
}

export class Product {
	constructor(public id: number, public name: string, public qty: number) { }
}

export class ExpressTrack {
	public isEmpty: boolean = true;

	constructor(public waybillNumber: string, public from: string, public destination: string,
		public itemCount: number, public status: string, public arrivedTime: Date, public recipient: string,
		public details: ExpressTrackRecord[]) {}

	get duration() {
		if (this.details.length) {
			var start = moment(this.details[0].when);
			var end = this.arrivedTime ? moment(this.arrivedTime) : moment();

			var ms = end.diff(start);
			return moment.duration(ms).humanize();
		}

		return "";
	}

	get arrivedTimeDayText() { return this.arrivedTime ? moment(this.arrivedTime).format('MM-DD') : "到达时间" }
	get arrivedTimeText() { return this.arrivedTime ? moment(this.arrivedTime).format('HH:mm') : "" }
	get recipientText() { return this.recipient ? this.recipient : "签收人" }
}

export class ExpressTrackRecord {
	constructor(public when: string, public where: string, public content: string) { }
}

export function map(order: OrderModel) {
	var o = {
		id: order.id, orderTime: order.orderTime, deliveryTime: order.deliveryTime, receiveTime: order.receiveTime,
		orderState: order.orderState, paymentState: order.paymentState, waybillNumber: order.waybillNumber, weight: order.weight,
		freight: order.freight, waybill: null, description: null, recipient: order.recipient,
		phone: order.phone, address: order.address, sender: order.sender, senderPhone: order.senderPhone, customerOrders: []
	};

	order.customerOrders.forEach(co => {
		var c = { customerId: co.customerId, customerName: co.customerName, orderProducts: [] };	
		co.orderProducts.forEach(op => {
			c.orderProducts.push({
				productId: op.productId, productBrand: op.productBrand, productName: op.productName, cost: op.cost, price: op.price, qty: op.qty, purchased: op.purchased
			});
		});

		o.customerOrders.push(c);
	});

	return o;
}

export function formatCurrency(num: number, str: string) {
	return num > 0 ? '+' + str : str;
}