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

		public static float AverageRate { get; private set; }
		public static float CounterRate { get; private set; }

		public CacheKey Key => CacheKey.ExchangeRate;
		public int Index => 0;

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

			CounterRate = _config.CurrentRate + 0.05f;

			var records = _context.ExchangeHistories.ToList();			
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
			foreach (var o in _context.Orders.Include(o => o.Products).ToList()) 
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
	}
}
