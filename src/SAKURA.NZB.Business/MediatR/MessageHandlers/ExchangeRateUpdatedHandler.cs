using MediatR;
using SAKURA.NZB.Business.Cache;
using SAKURA.NZB.Business.MediatR.Messages;
using Serilog;
using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Business.MediatR.MessageHandlers
{
	public class ExchangeRateUpdatedHandler : INotificationHandler<ExchangeRateUpdated>
	{
		private readonly ILogger _logger = Log.ForContext<ExchangeRateUpdatedHandler>();
		private readonly IEnumerable<ICache> _caches;

		public ExchangeRateUpdatedHandler(IEnumerable<ICache> caches)
		{
			_caches = caches;
		}

		public void Handle(ExchangeRateUpdated notification)
		{
			var orderedCaches = _caches.OrderBy(c => c.Order).ToList();
			foreach (var cache in orderedCaches)
			{
				cache.Update();
			}
		}
	}
}
