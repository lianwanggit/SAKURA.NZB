using Hangfire;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using Serilog;
using System;
using System.Linq;

namespace SAKURA.NZB.Business.BootTasks
{
	public class DbCleanupBootTask : IBootTask
	{
		private readonly NZBContext _context;
		private readonly IBackgroundJobClient _jobClient;
		public readonly ILogger _logger = Log.ForContext<ExpressTrackBootTask>();

		public DbCleanupBootTask(NZBContext context, IBackgroundJobClient jobClient)
		{
			_context = context;
			_jobClient = jobClient;
		}

		public void Run()
		{
			RecurringJob.AddOrUpdate("db-clean-exchange-rate-task", () => CleanExchangeRate(), Cron.Monthly);
			RecurringJob.AddOrUpdate("db-clean-express-track-task", () => CleanExpressTrack(), Cron.Monthly);
		}

		public void CleanExchangeRate()
		{
			var toBeRemoved = _context.ExchangeRates.Where(e => e.ModifiedTime <= DateTimeOffset.Now.AddYears(-1));
			_context.ExchangeRates.RemoveRange(toBeRemoved);
			_context.SaveChanges();
		}

		public void CleanExpressTrack()
		{
			var toBeRemoved = _context.ExpressTracks.Include(e => e.Details).Where(e => e.ModifiedTime <= DateTimeOffset.Now.AddMonths(-6));
			_context.ExpressTracks.RemoveRange(toBeRemoved);
			_context.SaveChanges();
		}
	}
}
