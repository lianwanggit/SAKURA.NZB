using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class Category
    {
		public int Id { get; set; }
		[StringLength(50)]
		public string Name { get; set; }
		public List<Product> Products { get; set; }
    }
}
