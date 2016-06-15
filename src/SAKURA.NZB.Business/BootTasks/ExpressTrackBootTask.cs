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
		private readonly IExpressDistributor _distributor;
		private readonly IBackgroundJobClient _jobClient;
		public const int seconds = 2;
		public readonly ILogger _logger = Log.ForContext<ExpressTrackBootTask>();

		public ExpressTrackBootTask(NZBContext context, IExpressDistributor distributor, IBackgroundJobClient jobClient)
		{
			_context = context;
			_distributor = distributor;
			_jobClient = jobClient;
		}

		public void Run()
		{		
			var timezone = TimeZoneInfo.FindSystemTimeZoneById("China Standard Time");
			RecurringJob.AddOrUpdate("track-express-info-task1", () => DelayTrack(), Cron.Daily(9, 30), timezone);
			RecurringJob.AddOrUpdate("track-express-info-task2", () => DelayTrack(), Cron.Daily(12, 00), timezone);
			RecurringJob.AddOrUpdate("track-express-info-task3", () => DelayTrack(), Cron.Daily(15, 30), timezone);
		}

		public async void DelayTrack()
		{
			_logger.Information("Start tracking the live express");

			var waybills = _context.Orders.Where(o => !string.IsNullOrEmpty(o.WaybillNumber)
						&& (o.OrderState == Domain.OrderState.Delivered || o.OrderState == Domain.OrderState.Received))
					.Select(o => o.WaybillNumber).ToList();
			//var waybills = new string[] { "NZ1943730", "NZ1685252", "NZ1934339", "NZ1826898" };

			foreach (var wb in waybills)
			{
				_logger.Information("Start tracking the waybill: {0}", wb);

				var result = _distributor.Track(wb.TrimStart());
				if (result == null || string.IsNullOrEmpty(result.WaybillNumber))
				{
					_logger.Warning("Can't track this waybill");
					continue;
				}

				var track = _context.ExpressTracks.Include(e => e.Details).FirstOrDefault(e => e.WaybillNumber == wb);
				if (track == null)
				{
					result.ModifiedTime = DateTimeOffset.Now;
										
					_context.ExpressTracks.Add(result);
					_logger.Information("Added new express track information");
				}
				else
				{
					if (!track.Equals(result))
					{
						_logger.Information("Updated the express track information");
					}

					track.ModifiedTime = DateTimeOffset.Now;
					track.Status = result.Status;
					track.ArrivedTime = result.ArrivedTime;
					track.Recipient = result.Recipient;

					foreach (var r in result.Details)
					{
						if (track.Details.All(x => x.When != r.When))
						{
							track.Details.Add(r);
						}
					}
				}

				_context.SaveChanges();
				await Task.Delay(TimeSpan.FromSeconds(seconds));
			}

			_logger.Information("End tracking the live express");

		}
	}
}
