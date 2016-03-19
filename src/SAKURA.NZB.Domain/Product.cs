using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{

	public class Product
    {
		public int Id { get; set; }

		[MaxLength(100)]
		public string Name { get; set; }
		[Required]
		public int CategoryId { get; set; }
		public Category category { get; set; }
		public List<Image> Images { get; set; }

		[DataType(DataType.Currency)]
		public float Cost { get; set; }
	}
}
