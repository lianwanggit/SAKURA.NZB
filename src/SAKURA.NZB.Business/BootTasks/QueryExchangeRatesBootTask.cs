﻿using Hangfire;
using SAKURA.NZB.Business.ExchangeRate;

namespace SAKURA.NZB.Business.BootTasks
{
	public class QueryExchangeRatesBootTask : IBootTask
	{
		private readonly CurrencyLayerService _service;
		private readonly IBackgroundJobClient _jobClient;

		public QueryExchangeRatesBootTask(CurrencyLayerService service, IBackgroundJobClient jobClient)
		{
			_service = service;
			_jobClient = jobClient;
		}

		public void Run()
		{
			_service.LiveRequest();
			RecurringJob.AddOrUpdate("query-live-currency-rates-task", () => _service.LiveRequest(), Cron.Hourly);
		}
	}
}