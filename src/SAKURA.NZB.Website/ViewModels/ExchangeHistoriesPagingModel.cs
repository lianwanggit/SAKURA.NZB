using SAKURA.NZB.Domain;
using System.Collections.Generic;

namespace SAKURA.NZB.Website.ViewModels
{
	public class ExchangeHistoriesPagingModel : BasePagingModel<ExchangeHistoryModel>
	{
		public ExchangeHistoriesPagingModel(IEnumerable<ExchangeHistoryModel> items, int itemsPerPage, int page) : base(items, itemsPerPage, page)
		{
		}
	}
}
