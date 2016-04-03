using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class OrderProduct
    {
		public int Id { get; set; }
		[Required]
		public int ProductId { get; set; }
		public Product Product { get; set; }
		[DataType(DataType.Currency)]
		public float Cost { get; set; }
		[DataType(DataType.Currency)]
		public float Price { get; set; }
		[Range(1, 100)]
		public int Qty { get; set; }
		public int OrderId { get; set; }
	}
}
