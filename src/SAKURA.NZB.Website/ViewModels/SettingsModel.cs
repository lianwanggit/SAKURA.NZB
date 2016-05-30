namespace SAKURA.NZB.Website.ViewModels
{
	public class SettingsModel
	{
		public float FixedRateLow { get; set; }
		public float FixedRateHigh { get; set; }
		public string ApiLayerAccessKey { get; set; }
		public string SenderName { get; set; }
		public string SenderPhone { get; set; }
		public float FreightRate { get; set; }

		public string FlywayUri { get; set; }
		public string FlywayCode { get; set; }
		public string EfsPostUri { get; set; }
		public string NzstCode { get; set; }
		public string NzstUri { get; set; }
		public string FtdUri { get; set; }

		public int ProductItemsPerPage { get; set; }
		public int OrdersItemsPerPage { get; set; }
		public int ExchangeHistoriesItemsPerPage { get; set; }
	}
}
