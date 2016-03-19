namespace SAKURA.NZB.Domain
{
	public enum OrderState
    {
		Created = 0,
		ToBeConfirmed,
		Confirmed,
		Delivered,
		Transit,
		Received,
		Completed,
		Discarded
    }
}
