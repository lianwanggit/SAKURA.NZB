using System.Collections.Generic;

namespace SAKURA.NZB.Website.ViewModels
{
	public class ProductsPagingModel : BasePagingModel<ProductSummaryModel>
	{
		public ProductsPagingModel(IEnumerable<ProductSummaryModel> items, int itemsPerPage, int page) : base(items, itemsPerPage, page)
		{
		}
	}
}
