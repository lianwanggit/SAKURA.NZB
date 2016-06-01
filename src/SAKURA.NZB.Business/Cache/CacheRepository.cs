using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Business.Cache
{
	public class CacheRepository : ICacheRepository
	{
		private readonly IEnumerable<ICache> _caches;

		public CacheRepository(IEnumerable<ICache> caches)
		{
			_caches = caches;
		}

		public void UpdateAll()
		{
			var orderedCaches = _caches.OrderBy(c => c.Index).ToList();
			foreach (var cache in orderedCaches)
			{
				cache.Update();
			}
		}

		public void UpdateByKey(CacheKey key)
		{
			var cache = _caches.FirstOrDefault(c => c.Key == key);
			if (cache != null)
			{
				cache.Update();
			}
		}
	}
}
