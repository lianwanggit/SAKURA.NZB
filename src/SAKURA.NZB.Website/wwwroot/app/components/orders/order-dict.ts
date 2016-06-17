export class OrderDict {
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