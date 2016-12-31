namespace SAKURA.NZB.Business.Cache
{
	public interface ICache
    {
		CacheKey Key { get; }
		void Update();
    }
}
