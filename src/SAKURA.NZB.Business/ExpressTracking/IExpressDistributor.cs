using SAKURA.NZB.Domain;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public interface IExpressDistributor
    {
		ExpressTrack Track(string waybillNumber);
	}
}
