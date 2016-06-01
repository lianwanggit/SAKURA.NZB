using MediatR;
using SAKURA.NZB.Business.Cache;
using SAKURA.NZB.Business.MediatR.Messages;
using Serilog;

namespace SAKURA.NZB.Business.MediatR.MessageHandlers
{
	public class MonthSaleUpdatedHandler : INotificationHandler<MonthSaleUpdated>
	{
		private readonly ILogger _logger = Log.ForContext<MonthSaleUpdatedHandler>();
		private readonly ICacheRepository _cacheRepository;

		public MonthSaleUpdatedHandler(ICacheRepository cacheRepository)
		{
			_cacheRepository = cacheRepository;
		}

		public void Handle(MonthSaleUpdated notification)
		{
			_cacheRepository.UpdateByKey(CacheKey.MonthSale);
		}
	}
}
