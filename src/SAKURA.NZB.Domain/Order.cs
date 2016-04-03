using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class Order
    {
		public int Id { get; set; }
		public List<OrderProduct> Products { get; set; }
		[Required]
		public int CustomerId { get; set; }
		public Customer Customer { get; set; }
		public DateTimeOffset? OrderTime { get; set; }
		public DateTimeOffset? DeliveryTime { get; set; }
		public DateTimeOffset? ReceiveTime { get; set; }
		public OrderState OrderState { get; set; }
		public PaymentState PaymentState { get; set; }
		public float? Weight { get; set; }
		[DataType(DataType.Currency)]
		public float? Freight { get; set; }
		public Image Waybill { get; set; }
		[StringLength(100)]
		public string TransitStatus { get; set; }
		[StringLength(255)]
		public string Description { get; set; }
    } 
}
