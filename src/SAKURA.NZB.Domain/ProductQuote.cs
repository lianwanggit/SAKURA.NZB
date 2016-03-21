using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SAKURA.NZB.Domain
{
    public class ProductQuote
    {
		public int Id { get; set; }
		public int ProductId { get; set; }
		public Product Product { get; set; }
		public int SupplierId { get; set; }
		public Supplier Supplier { get; set; }
		[DataType(DataType.Currency)]
		public float Price { get; set; }
	}
}
