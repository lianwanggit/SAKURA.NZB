namespace SAKURA.NZB.Business.Cache
{
	public interface IItemsCache
    {
		void UpdateItem(int id, UpdateItemAction action);
    }

	public enum UpdateItemAction
	{
		Add,
		Replace,
		Remove
	}
}
