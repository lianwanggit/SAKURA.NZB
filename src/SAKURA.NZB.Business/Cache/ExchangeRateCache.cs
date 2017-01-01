using MediatR;
using Microsoft.Data.Entity;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Data;
using Serilog;
using System;
using System.Linq;

namespace SAKURA.NZB.Business.Cache
{
	public class ExchangeRateCache : ICache
	{
		private readonly NZBContext _context;
		private readonly Config _config;
		private readonly IMediator _mediator;

		/// <summary>
		/// Average exchange rate for current year
		/// </summary>
		public static float AverageRate { get; private set; }

		/// <summary>
		/// Counter exchange rate for current year
		/// </summary>
		public static float CounterRate { get; private set; }

		public CacheKey Key => CacheKey.ExchangeRate;

		public ExchangeRateCache(NZBContext context, Config config, IMediator mediator)
		{
			_context = context;
			_config = config;
			_mediator = mediator;
		}

		public void Update()
		{
			float totalNzd = 0;
			float totalCny = 0;
			float averageRate = _config.FixedRateLow;
			var year = DateTime.Now.Year;
			CounterRate = _config.CurrentRate + 0.05f;

			var records = _context.ExchangeHistories.Where(x => x.CreatedTime.Year == year).ToList();			
			foreach (var r in records)
			{
				totalNzd += r.Nzd;
				totalCny += r.Cny;
			}

			if (totalNzd > 0)
			{
				averageRate = (float)Math.Round(totalCny / totalNzd, 4);
			}

			var  totalIncome = 0f;
			foreach (var o in _context.Orders.Include(o => o.Products).Where(o => o.OrderTime.Year == year).ToList()) 
			{
				totalIncome += o.Products.Sum(p => p.Price * p.Qty);			 
			}

			if (totalIncome > 0)
				AverageRate = (averageRate * totalCny + CounterRate * (totalIncome - totalCny)) / totalIncome;
			else
				AverageRate = CounterRate;

			CounterRate = Math.Max(5f, CounterRate);

			Log.Information("Counter Live Rate: {0}", CounterRate);
			Log.Information("Average Rate: {0}", AverageRate);
		}

		public static float GetFixedRateByYear(NZBContext context, int year)
		{
			float totalNzd = 0;
			float totalCny = 0;

			var records = context.ExchangeHistories.Where(x => x.CreatedTime.Year == year).ToList();
			foreach (var r in records)
			{
				totalNzd += r.Nzd;
				totalCny += r.Cny;
			}

			return  totalNzd > 0f ? (float)Math.Round(totalCny / totalNzd, 4) : 5f;
		} 
	}
}
