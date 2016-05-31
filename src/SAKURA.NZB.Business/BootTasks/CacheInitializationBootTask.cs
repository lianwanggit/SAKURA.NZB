using SAKURA.NZB.Business.Cache;
using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Business.BootTasks
{
	public class CacheInitializationBootTask : IBootTask
	{
		private readonly IEnumerable<ICache> _caches;

		public CacheInitializationBootTask(IEnumerable<ICache> caches)
		{
			_caches = caches;
		}

		public void Run()
		{
			var orderedCaches = _caches.OrderBy(c => c.Index).ToList();
			foreach (var cache in orderedCaches)
			{
				cache.Update();
			}
		}
	}
}
