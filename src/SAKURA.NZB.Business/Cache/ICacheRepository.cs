namespace SAKURA.NZB.Business.Cache
{
	public interface ICacheRepository
    {
		void UpdateAll();
		void UpdateByKey(CacheKey key);
		void UpdateItemByKey(CacheKey key, int id, UpdateItemAction action);

	}
}
