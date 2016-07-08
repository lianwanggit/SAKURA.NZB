namespace SAKURA.NZB.Business.Configuration
{
	public class ConfigKeys
    {
		public static string FixedRateLow = "ExchangeRate.LowLimit";
		public static string FixedRateHigh = "ExchangeRate.HighLimit";
		public static string ApiLayerAccessKey = "currencylayer.AccessKey";
		public static string SenderName = "Sender.Name";
		public static string SenderPhone = "Sender.Phone";
		public static string FreightRate = "FreightRate";

		public static string ExpressTrackerUri_Flyway = "ExpressTrackerUri.Flyway";
		public static string ExpressTrackerCode_Flyway = "ExpressTrackerCode.Flyway";
		public static string ExpressTrackerUri_EfsPost = "ExpressTrackerUri.EFSPost";
		public static string ExpressTrackerUri_Zto = "ExpressTrackerUri.ZTO";
		public static string ExpressTrackerCode_Nzst = "ExpressTrackerCode.NZST";
		public static string ExpressTrackerUri_Nzst = "ExpressTrackerUri.NZST";
		public static string ExpressTrackerUri_Ftd = "ExpressTrackerUri.Ftd";

		public static string ProductItemsPerPage = "ItemsPerPage.Products";
		public static string OrdersItemsPerPage = "ItemsPerPage.Orders";
		public static string ExchangeHistoriesItemsPerPage = "ItemsPerPage.ExchangeHistories";
	}
}
