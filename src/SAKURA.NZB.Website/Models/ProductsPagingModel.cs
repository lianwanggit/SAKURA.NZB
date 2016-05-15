using SAKURA.NZB.Domain;
using System.Collections.Generic;

namespace SAKURA.NZB.Website.Models
{
	public class ProductsPagingModel : BasePagingModel<Product>
	{
		public ProductsPagingModel(IEnumerable<Product> items, int itemsPerPage, int page) : base(items, itemsPerPage, page)
		{
		}
	}
}
