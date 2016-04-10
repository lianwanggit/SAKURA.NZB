namespace SAKURA.NZB.Website.Models
{
	public class OrderDeliveryModel
    {
		public int OrderId { get; set; }
		public string WaybillNumber { get; set; }
		public float? Weight { get; set; }
		public float? Freight { get; set; }
	}

	public class OrderDeliveryResultModel
	{
		public int OrderId { get; set; }
		public string WaybillNumber { get; set; }
		public float? Weight { get; set; }
		public float? Freight { get; set; }
		public string OrderState { get; set; }
	}
}
