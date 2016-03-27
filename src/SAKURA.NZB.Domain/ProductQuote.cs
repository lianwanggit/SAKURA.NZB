using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class ProductQuote
    {
		public int Id { get; set; }
		public int ProductId { get; set; }
		public int SupplierId { get; set; }
		public Supplier Supplier { get; set; }

		[DataType(DataType.Currency)]
		public float Price { get; set; }
	}
}
