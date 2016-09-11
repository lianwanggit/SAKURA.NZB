using System.Collections.Generic;

namespace SAKURA.NZB.Website.ViewModels
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

	public class BatchWaybillNumberModel
	{
		public List<string> WaybillNumbers { get; set; }
	}

	public class BatchExpressionInfoModel
	{
		public List<LatestExpressInfoModel> ExpressInfoList { get; set; }
	}

	public class LatestExpressInfoModel
	{
		public string WaybillNumber { get; set; }
		public string ExpressInfo { get; set; }
	}
}
