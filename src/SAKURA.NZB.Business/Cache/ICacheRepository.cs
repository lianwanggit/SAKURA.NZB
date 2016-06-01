namespace SAKURA.NZB.Business.Cache
{
	public interface ICacheRepository
    {
		void UpdateAll();
		void UpdateByKey(CacheKey key);
    }
}
