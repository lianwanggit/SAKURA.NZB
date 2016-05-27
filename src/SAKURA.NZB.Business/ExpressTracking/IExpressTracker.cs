using SAKURA.NZB.Domain;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public interface IExpressTracker
    {		 
		string Prefix { get; }
		ExpressTrack Track(string waybillNumber);
	}
}
