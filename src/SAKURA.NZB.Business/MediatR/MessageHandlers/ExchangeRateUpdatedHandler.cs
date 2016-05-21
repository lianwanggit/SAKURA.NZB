using MediatR;
using SAKURA.NZB.Business.Cache;
using SAKURA.NZB.Business.MediatR.Messages;
using Serilog;
using System.Collections.Generic;

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
			foreach (var cache in _caches)
			{
				if (cache is MonthSaleCache)
					cache.Update();
			}
		}
	}
}
