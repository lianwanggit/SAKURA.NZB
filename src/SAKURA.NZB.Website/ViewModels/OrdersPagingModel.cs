using System.Collections.Generic;

namespace SAKURA.NZB.Website.ViewModels
{
	public class OrdersPagingModel : BasePagingModel<OrderModel>
	{
		public OrdersPagingModel(IEnumerable<OrderModel> items, int itemsPerPage, int page) : base(items, itemsPerPage, page)
		{
		}
	}
}
