using Hangfire;
using Microsoft.Data.Entity;
using SAKURA.NZB.Business.ExpressTracking;
using SAKURA.NZB.Data;
using Serilog;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace SAKURA.NZB.Business.BootTasks
{
	public class ExpressTrackBootTask : IBootTask
	{
		private readonly NZBContext _context;
		private readonly FlywayExpressTracker _expressTracker;
		private readonly IBackgroundJobClient _jobClient;
		public const int seconds = 5;
		public readonly ILogger _logger = Log.ForContext<ExpressTrackBootTask>();

		public ExpressTrackBootTask(NZBContext context, FlywayExpressTracker expressTracker, IBackgroundJobClient jobClient)
		{
			_context = context;
			_expressTracker = expressTracker;
			_jobClient = jobClient;
		}

		public void Run()
		{
			var timezone = TimeZoneInfo.FindSystemTimeZoneById("China Standard Time");
			RecurringJob.AddOrUpdate("track-express-info-task1", () => DelayTrack(), Cron.Daily(9, 30), timezone);
			RecurringJob.AddOrUpdate("track-express-info-task2", () => DelayTrack(), Cron.Daily(12, 00), timezone);
			RecurringJob.AddOrUpdate("track-express-info-task3", () => DelayTrack(), Cron.Daily(15, 30), timezone);
			RecurringJob.AddOrUpdate("track-express-info-task4", () => DelayTrack(), Cron.Daily(18, 00), timezone);
		}

		public async void DelayTrack()
		{
			var waybills = _context.Orders.Where(o => !string.IsNullOrEmpty(o.WaybillNumber)
						&& (o.OrderState == Domain.OrderState.Delivered || o.OrderState == Domain.OrderState.Received))
					.Select(o => o.WaybillNumber).ToList();

			foreach (var wb in waybills)
			{
				var result = _expressTracker.Track(wb);
				if (result == null)
				{
					_logger.Warning($"Can't track the waybill: {wb}");
					continue;
				}

				var track = _context.ExpressTracks.Include(e => e.Details).FirstOrDefault(e => e.WaybillNumber == wb);
				if (track == null)
				{
					result.ModifiedTime = DateTimeOffset.Now;
										
					_context.ExpressTracks.Add(result);
					_logger.Information($"Added new express track of waybill: {wb}");
				}
				else
				{
					foreach (var r in result.Details)
					{
						if (track.Details.All(x => x.When != r.When))
						{
							track.Details.Add(r);
							_logger.Information($"Added new express track record of waybill: {wb}");
						}
					}
				}

				_context.SaveChanges();
				await Task.Delay(TimeSpan.FromSeconds(seconds));
			}
		}
	}
}
