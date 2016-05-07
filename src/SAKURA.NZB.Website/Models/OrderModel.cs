using SAKURA.NZB.Domain;
using System;
using System.Collections.Generic;

namespace SAKURA.NZB.Website.Models
{
	public class OrderModel
	{
		public int Id { get; set; }

		public DateTime OrderTime { get; set; }
		public DateTime? DeliveryTime { get; set; }
		public DateTime? ReceiveTime { get; set; }
		public string OrderState { get; set; }
		public string PaymentState { get; set; }
		public string WaybillNumber { get; set; }
		public float? Weight { get; set; }
		public float? Freight { get; set; }
		public Image Waybill { get; set; }
		public string Description { get; set; }
		public string Recipient { get; set; }
		public string Phone { get; set; }
		public string Address { get; set; }

		public string Sender { get; set; }
		public string SenderPhone { get; set; }

		public List<CustomerOrderMode> CustomerOrders { get; set; }
	}

	public class CustomerOrderMode
	{
		public int CustomerId { get; set; }
		public string CustomerName { get; set; }

		public List<OrderProductModel> OrderProducts { get; set; }
	}

	public class OrderProductModel
	{
		public int ProductId { get; set; }
		public string ProductBrand { get; set; }
		public string ProductName { get; set; }
		public float Cost { get; set; }
		public float Price { get; set; }
		public int Qty { get; set; }
		public bool Purchased { get; set; }
	}
}
