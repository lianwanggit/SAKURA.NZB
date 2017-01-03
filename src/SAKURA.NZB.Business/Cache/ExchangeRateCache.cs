using MediatR;
using Microsoft.Data.Entity;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Business.Cache
{
	public class ExchangeRateCache : ICache
	{
		private readonly NZBContext _context;
		private readonly Config _config;
		private readonly IMediator _mediator;

		/// <summary>
		/// Counter exchange rate for current year
		/// </summary>
		public static float CounterRate {
			get
			{
				var thisYear = DateTime.Now.Year;
				if (RateDictionary != null && RateDictionary.ContainsKey(thisYear))
					return RateDictionary[thisYear];

				return 5f;
			}
		}

		public static Dictionary<int, float> RateDictionary { get; set; }

		public CacheKey Key => CacheKey.ExchangeRate;

		public ExchangeRateCache(NZBContext context, Config config, IMediator mediator)
		{
			_context = context;
			_config = config;
			_mediator = mediator;
		}

		public void Update()
		{
			RateDictionary = new Dictionary<int, float>();

			var thisYear = DateTime.Now.Year;
			var histories = _context.ExchangeHistories.ToList();
			var years = histories.GroupBy(x => x.CreatedTime.Year).Select(x => x.Key).ToList();
			
			foreach (var year in years)
			{
				var rate = 5f;
				var records = histories.Where(x => x.CreatedTime.Year == year);

				if (year == thisYear)
					rate = CalculateFloatingRate(records);
				else
					rate = CalculateHistoricalRate(records);

				RateDictionary.Add(year, rate);
			}

			if (!RateDictionary.ContainsKey(thisYear))
			{
				var rate = _config.CurrentRate + 0.15f;
				RateDictionary.Add(thisYear, rate);
			}

			Log.Information("Exchange Rate:");
			foreach (var kvp in RateDictionary)
			{
				Log.Information("Year: {0} Rate: {1}", kvp.Key, kvp.Value);
			}
		}

		private float CalculateFloatingRate(IEnumerable<ExchangeHistory> records)
		{
			float totalNzd = 0;
			float totalCny = 0;
			float floatingRate = _config.CurrentRate + 0.15f;
			float pastRate = 0;
			var year = DateTime.Now.Year;
			float averageRate = 5f;

			foreach (var r in records)
			{
				totalNzd += r.Nzd;
				totalCny += r.Cny;
			}

			if (totalNzd > 0)
			{
				pastRate = (float)Math.Round(totalCny / totalNzd, 4);
			}

			var totalCost = 0f;
			foreach (var o in _context.Orders.Include(o => o.Products).Where(o => o.OrderTime.Year == year).ToList())
			{
				totalCost += o.Products.Sum(p => p.Cost * p.Qty);
			}

			if (totalCost > totalNzd)
				averageRate = (pastRate * totalNzd + floatingRate * (totalCost - totalNzd)) / totalCost;
			else
				averageRate = pastRate;

			return averageRate;
		}

		private float CalculateHistoricalRate(IEnumerable<ExchangeHistory> records)
		{
			float totalNzd = 0;
			float totalCny = 0;

			foreach (var r in records)
			{
				totalNzd += r.Nzd;
				totalCny += r.Cny;
			}

			return totalNzd > 0f ? (totalCny / totalNzd) : 5f;
		}
	}
}
