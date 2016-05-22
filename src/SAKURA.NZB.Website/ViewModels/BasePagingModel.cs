using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Website.ViewModels
{
	public abstract class BasePagingModel<T> : IPagingModel<T>
	{
		protected List<T> _itemList;
		protected int _itemsPerPage;
		protected int _page;

		public BasePagingModel(IEnumerable<T> items, int itemsPerPage, int page)
		{
			_itemList = items.ToList();
			_itemsPerPage = itemsPerPage;
			_page = page;
		}

		public IEnumerable<T> Items
		{
			get
			{
				if (Page > TotalPageCount) return null;
				return GetItemsByPageIndex(Page);
			}
		}

		public IEnumerable<T> NextItems
		{
			get
			{
				if (Page >= TotalPageCount) return null;
				return GetItemsByPageIndex(Page + 1);
			}
		}

		public int Page { get { return _page; } }

		public IEnumerable<T> PrevItems
		{
			get
			{
				if (Page <= 1) return null;
				return GetItemsByPageIndex(Page - 1);
			}
		}

		public int TotalItemCount { get { return _itemList.Count; } }

		public int TotalPageCount
		{
			get
			{
				var multiple = TotalItemCount / ItemsPerPage;
				return (TotalItemCount % ItemsPerPage == 0) ? multiple : multiple + 1;
			}
		}

		public int ItemsPerPage { get { return _itemsPerPage; } }


		private IEnumerable<T> GetItemsByPageIndex(int page)
		{
			var index = ItemsPerPage * (page - 1);
			var last = ItemsPerPage + index - 1;
			var count = last < TotalItemCount ? ItemsPerPage : TotalItemCount - index;

			return _itemList.GetRange(index, count);
		}

	}
}
