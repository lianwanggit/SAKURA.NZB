using SAKURA.NZB.Domain;
using System.Collections.Generic;

namespace SAKURA.NZB.Website.Models
{
	public class ProductsPagingModel : BasePagingModel<ProductSummaryModel>
	{
		public ProductsPagingModel(IEnumerable<ProductSummaryModel> items, int itemsPerPage, int page) : base(items, itemsPerPage, page)
		{
		}
	}
}
