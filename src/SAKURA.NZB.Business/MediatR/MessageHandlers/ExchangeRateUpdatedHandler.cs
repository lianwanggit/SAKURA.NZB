using MediatR;
using SAKURA.NZB.Business.Cache;
using SAKURA.NZB.Business.MediatR.Messages;
using Serilog;

namespace SAKURA.NZB.Business.MediatR.MessageHandlers
{
	public class ExchangeRateUpdatedHandler : INotificationHandler<ExchangeRateUpdated>
	{
		private readonly ILogger _logger = Log.ForContext<ExchangeRateUpdatedHandler>();
		private readonly ICacheRepository _cacheRepository;

		public ExchangeRateUpdatedHandler(ICacheRepository cacheRepository)
		{
			_cacheRepository = cacheRepository;
		}

		public void Handle(ExchangeRateUpdated notification)
		{
			_cacheRepository.UpdateAll();
		}
	}
}
