using SAKURA.NZB.Data;
using System.Linq;

namespace SAKURA.NZB.Core.Hangfire
{
	public class HangfireHelper
	{
		private readonly NZBContext _context;

		public HangfireHelper(NZBContext context)
		{
			_context = context;
		}

		public void ConfirmHangfireConfigured()
		{
			var count = _context.Customers.ToList();
		}
	}
}
