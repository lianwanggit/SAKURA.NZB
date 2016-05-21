using MediatR;
using SAKURA.NZB.Business.Cache;
using SAKURA.NZB.Business.MediatR.Messages;
using Serilog;
using System.Collections.Generic;

namespace SAKURA.NZB.Business.MediatR.MessageHandlers
{
	public class OrderUpdatedHandler : INotificationHandler<OrderUpdated>
	{
		private readonly ILogger _logger = Log.ForContext<OrderUpdatedHandler>();
		private readonly IEnumerable<ICache> _caches;

		public OrderUpdatedHandler(IEnumerable<ICache> caches)
		{
			_caches = caches;
		}

		public void Handle(OrderUpdated notification)
		{
			foreach (var cache in _caches)
			{
				if (cache is MonthSaleCache)
					cache.Update();
			}
		}
	}
}
