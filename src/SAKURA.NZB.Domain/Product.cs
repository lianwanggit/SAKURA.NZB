using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{

	public class Product
    {
		public int Id { get; set; }

		[Required]
		[StringLength(100)]
		public string Name { get; set; }

		[StringLength(1000)]
		public string Desc { get; set; }

		public int CategoryId { get; set; }
		public Category Category { get; set; }

		public int BrandId { get; set; }
		public Brand Brand { get; set; }

		public List<Image> Images { get; set; }

		public List<ProductQuote> Quotes { get; set; }

		[Required]
		[DataType(DataType.Currency)]
		public float Price { get; set; }

	}
}
