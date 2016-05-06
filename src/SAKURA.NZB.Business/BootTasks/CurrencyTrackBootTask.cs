using Hangfire;
using SAKURA.NZB.Business.CurrencyTracking;
using SAKURA.NZB.Data;
using Serilog;
using System;
using System.Linq;

namespace SAKURA.NZB.Business.BootTasks
{
	public class CurrencyTrackBootTask : IBootTask
	{
		private readonly NZBContext _context;
		private readonly CurrencyLayerTracker _service;
		private readonly IBackgroundJobClient _jobClient;
		private readonly ILogger _logger = Log.ForContext<CurrencyTrackBootTask>();

		public CurrencyTrackBootTask(NZBContext context, CurrencyLayerTracker service, IBackgroundJobClient jobClient)
		{
			_context = context;
			_service = service;
			_jobClient = jobClient;
		}

		public void Run()
		{
			RecurringJob.AddOrUpdate("track-live-currency-rates-task", () => Track(), Cron.Hourly);
		}

		public void Track()
		{
			var result = _service.Query();
			var ratesToday = _context.ExchangeRates.FirstOrDefault(x => x.ModifiedTime.Date == DateTimeOffset.Now.Date);

			if (ratesToday != null)
			{
				ratesToday.USDCNY = result.quotes.USDCNY;
				ratesToday.USDNZD = result.quotes.USDNZD;
			}
			else
			{
				ratesToday = new Domain.ExchangeRate
				{
					USDCNY = result.quotes.USDCNY,
					USDNZD = result.quotes.USDNZD,
					Source = _service.Source
				};

				_context.ExchangeRates.Add(ratesToday);
			}

			ratesToday.NZDCNY = ratesToday.USDCNY / ratesToday.USDNZD;
			ratesToday.ModifiedTime = DateTimeOffset.Now;

			_context.SaveChanges();
			_logger.Information($"Updated currency exchange rate. NZD - CNY: {ratesToday.NZDCNY}");
		}
	}
}
