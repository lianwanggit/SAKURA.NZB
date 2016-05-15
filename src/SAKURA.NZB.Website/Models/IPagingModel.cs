using System.Collections.Generic;

namespace SAKURA.NZB.Website.Models
{
	public interface IPagingModel<T>
    {
		int TotalItemCount { get; }
		int TotalPageCount { get; }
		int Page { get; }
		int ItemsPerPage { get; }

		IEnumerable<T> PrevItems { get; }

		IEnumerable<T> NextItems { get; }

		IEnumerable<T> Items { get; }
    }
}
