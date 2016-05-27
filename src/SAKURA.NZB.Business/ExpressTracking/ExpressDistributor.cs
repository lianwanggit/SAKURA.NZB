using SAKURA.NZB.Domain;
using System.Collections.Generic;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public class ExpressDistributor : IExpressDistributor
    {
		private readonly IEnumerable<IExpressTracker> _tracker;

		public ExpressDistributor(IEnumerable<IExpressTracker> tracker)
		{
			_tracker = tracker;
		}

		public ExpressTrack Track(string waybillNumber)
		{
			foreach (var t in _tracker)
			{
				if (waybillNumber.StartsWith(t.Prefix, System.StringComparison.OrdinalIgnoreCase))
				{
					return t.Track(waybillNumber);
				}
			}

			return null;
		}
	}
}
