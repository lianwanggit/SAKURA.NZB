﻿using Hangfire;
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
		}

		public async void DelayTrack()
		{
			_logger.Information("Start tracking the live express");

			var waybills = _context.Orders.Where(o => !string.IsNullOrEmpty(o.WaybillNumber) 
						&& !o.WaybillNumber.StartsWith("ST") && !o.WaybillNumber.StartsWith("NZ") 
						&& !o.WaybillNumber.StartsWith("EF") && !o.WaybillNumber.StartsWith("ZY")
						&& (o.OrderState == Domain.OrderState.Delivered || o.OrderState == Domain.OrderState.Received))
					.Select(o => o.WaybillNumber).ToList();

			foreach (var wb in waybills)
			{
				var result = _expressTracker.Track(wb);
				if (result == null)
				{
					_logger.Warning("Can't track the waybill: {0}", wb);
					continue;
				}

				var track = _context.ExpressTracks.Include(e => e.Details).FirstOrDefault(e => e.WaybillNumber == wb);
				if (track == null)
				{
					result.ModifiedTime = DateTimeOffset.Now;
										
					_context.ExpressTracks.Add(result);
					_logger.Information("Added new express track of waybill: {0}", wb);
				}
				else
				{
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

					_logger.Information("Updated the express track of waybill: {0}", wb);
				}

				_context.SaveChanges();
				await Task.Delay(TimeSpan.FromSeconds(seconds));
			}

			_logger.Information("End tracking the live express");

		}
	}
}
