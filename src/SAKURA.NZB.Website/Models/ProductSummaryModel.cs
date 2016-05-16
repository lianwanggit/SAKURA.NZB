namespace SAKURA.NZB.Website.Models
{
	public class ProductSummaryModel
    {
		public int Id { get; set; }
		public string Name { get; set; }
		public string Category { get; set; }
		public string Brand { get; set; }
		public float? Quote { get; set; }
		public float Price { get; set; }

		public float? SoldHighPrice { get; set; }
		public float? SoldLowPrice { get; set; }
		public int? SoldCount { get; set; }
	}
}
