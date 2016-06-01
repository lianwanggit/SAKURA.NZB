namespace SAKURA.NZB.Business.Cache
{
	public interface ICache
    {
		int Index { get; }
		CacheKey Key { get; }
		void Update();
    }
}
