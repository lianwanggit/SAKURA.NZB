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
				var prefixArray = t.Prefix.Split(new char[] { '|' });
				foreach (var prefix in prefixArray)
				{
					if (waybillNumber.StartsWith(prefix, System.StringComparison.OrdinalIgnoreCase))
					{
						return t.Track(waybillNumber);
					}
				}				
			}

			return null;
		}
	}
}
