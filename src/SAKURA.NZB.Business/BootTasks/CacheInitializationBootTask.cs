using SAKURA.NZB.Business.Cache;
using System.Collections.Generic;

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
			foreach (var cache in _caches)
			{
				cache.Update();
			}
		}
	}
}
