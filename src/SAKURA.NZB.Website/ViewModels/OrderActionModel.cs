namespace SAKURA.NZB.Website.ViewModels
{
	public enum OrderAction
	{
		ToConfirmed = 0,
		ToReceived,
		ToCompleted,
		ToPaid
	}

	public class UpdateOrderStatusModel
    {
		public int OrderId { get; set; }
		public string Action { get; set; }
    }

	public class UpdateOrderStatusResultModel
	{
		public int OrderId { get; set; }
		public string OrderState { get; set; }
		public string PaymentState { get; set; }
	}
}
