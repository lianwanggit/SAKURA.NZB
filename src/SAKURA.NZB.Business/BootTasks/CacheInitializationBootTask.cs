using SAKURA.NZB.Business.Cache;

namespace SAKURA.NZB.Business.BootTasks
{
	public class CacheInitializationBootTask : IBootTask
	{
		private readonly ICacheRepository _cacheRepository;

		public CacheInitializationBootTask(ICacheRepository cacheRepository)
		{
			_cacheRepository = cacheRepository;
		}

		public void Run()
		{
			_cacheRepository.UpdateAll();
		}
	}
}
