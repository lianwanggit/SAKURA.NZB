﻿using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Data;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class DashboardController : Controller
	{
		private NZBContext _context;
		private Config _config;

		public DashboardController(NZBContext context, Config config)
		{
			_context = context;
			_config = config;
		}

		[HttpGet("summary")]
		public IActionResult GetSummary()
		{
			var totalCost = 0F;
			var totalIncome = 0F;
			var totalProfit = 0F;
			var unpaidCount = 0;
			var unpaidAmount = 0F;
			var yesterdayProfit = 0F;
			var todayProfit = 0F;
			var profitIncrementRate = 0F;
			var profitIncrement = 0F;

			var today = DateTimeOffset.Now.Date;
			var yesterday = DateTimeOffset.Now.Date.AddDays(-1);
			var rate = _config.GetCurrentRate();

			foreach (var o in _context.Orders.Include(o => o.Products))
			{
				var cost = 0F;
				var income = 0F;
				foreach (var p in o.Products)
				{
					cost += (p.Cost * p.Qty);
					income += (p.Price * p.Qty);
				}

				totalCost += (cost + (o.Freight ?? 0F));
				totalIncome += income;

				if (o.PaymentState == Domain.PaymentState.Unpaid)
				{
					unpaidCount += 1;
					unpaidAmount += income;
				}

				if (o.OrderTime.Date == yesterday)
				{
					yesterdayProfit += (income - cost * rate);
				}

				if (o.OrderTime.Date == today)
				{
					todayProfit += (income - cost * rate);
				}
			}

			totalProfit = totalIncome - totalCost * rate;
			profitIncrement = todayProfit - yesterdayProfit;
			profitIncrementRate = Math.Abs(yesterdayProfit == 0 ? 1 : profitIncrement / yesterdayProfit);

			var todayExchange = (float)Math.Round(_context.ExchangeRates.FirstOrDefault(r => r.ModifiedTime.Date == today)?.NZDCNY ?? 0, 4);
			var yesterdayExchange =  (float)Math.Round(_context.ExchangeRates.FirstOrDefault(r => r.ModifiedTime.Date == yesterday)?.NZDCNY ?? 0, 4);
			var exchangeIncrement = todayExchange - yesterdayExchange;
			var exchangeIncrementRate = Math.Abs(yesterdayExchange == 0 ? 0 : exchangeIncrement / yesterdayExchange);
			
			var summary = new
			{
				customerCount = _context.Customers.Count(),
				brandCount = _context.Brands.Count(),
				productCount = _context.Products.Count(),
				orderCount = _context.Orders.Count(),
				totalCost = currencyToNzd(totalCost),
				totalIncome = currencyToCny(totalIncome),
				totalProfit = currencyToCny(totalProfit),
				unpaidCount = unpaidCount,
				unpaidAmount = currencyToCny(unpaidAmount),
				todayProfit = currencyToCny(todayProfit),
				profitIncrementRate = percentToString(profitIncrementRate),
				profitIncrement = profitIncrement,
				todayExchange = todayExchange,
				exchangeIncrement = exchangeIncrement,
				exchangeIncrementRate = percentToString(exchangeIncrementRate)
			};

			return new ObjectResult(summary);
		}

		[HttpGet("annual-sales")]
		public IActionResult GetAnnualSales()
		{
			var result = new List<MonthSale>();
			var rate = _config.GetCurrentRate();

			foreach (var o in _context.Orders.Include(o => o.Products).Where(o => o.OrderTime.Year == DateTime.Now.Year))
			{
				var month = o.OrderTime.Month;
				var cost = 0F;
				var income = 0F;

				foreach (var p in o.Products)
				{
					cost += (p.Cost * p.Qty);
					income += (p.Price * p.Qty);
				}

				cost += (o.Freight ?? 0F);
				var profit = (income - cost * rate);

				var sale = result.FirstOrDefault(s => s.Month == month);
				if (sale != null)
				{
					sale.Count += 1;
					sale.Cost += cost;
					sale.Income += income;
					sale.Profit += profit;
				}
				else
				{
					result.Add(new MonthSale
					{
						Month = month,
						Count = 1,
						Cost = cost,
						Income = income,
						Profit = profit
					});
				}
			}

			for (var i = 1; i <= DateTime.Now.Month; i++)
			{
				var sale = result.FirstOrDefault(r => r.Month == i);
				if (sale == null)
				{
					result.Add(new MonthSale
					{
						Month = i,
						Count = 0,
						Cost = 0,
						Income = 0,
						Profit = 0
					});
				}
			}

			return new ObjectResult(result.OrderBy(s => s.Month));
		}

		[HttpGet("top-sales")]
		public IActionResult GetTopSales()
		{
			var orders = _context.Orders.Include(o => o.Products).ThenInclude(p => p.Product).ThenInclude(p => p.Brand).ToList();
			var result = from o in orders
						 from op in o.Products
						 group op by op.Product into pg
						 select new { ProductName = string.Concat(pg.Key.Brand.Name, ' ', pg.Key.Name), Count = pg.Sum(x => x.Qty) };

			return new ObjectResult(result.OrderByDescending(r => r.Count).Take(10));
		}

		[HttpGet("past-30days-profit")]
		public IActionResult GetPast30DaysProfit()
		{
			var orders = _context.Orders.Include(o => o.Products).ToList();
			var dates = Enumerable.Range(1, 30).Select(i => DateTimeOffset.Now.Date.AddDays(i - 30));
			var rate = _config.GetCurrentRate();

			var result = new List<DaySale>();
			foreach (var d in dates)
			{
				var profit = 0F;
				var count = 0;
				foreach (var o in orders.Where(o => o.OrderTime.Date == d))
				{
					var cost = 0F;
					var income = 0F;

					foreach (var p in o.Products)
					{
						cost += (p.Cost * p.Qty);
						income += (p.Price * p.Qty);
					}

					count += 1;
					cost += (o.Freight ?? 0F);
					profit += (income - cost * rate);
				}

				result.Add(new DaySale { Date = d.ToShortDateString(), OrderCount = count, Profit = (float)Math.Round(profit, 2) });
			}

			return new ObjectResult(result);
		}

		[HttpGet("past-30days-exchange")]
		public IActionResult GetPast30DaysExchange()
		{
			var rates = _context.ExchangeRates.ToList();
			var dates = Enumerable.Range(1, 30).Select(i => DateTimeOffset.Now.Date.AddDays(i - 30));

			var result = new List<DayExchange>();
			foreach (var d in dates)
			{
				var rate = rates.FirstOrDefault(r => r.ModifiedTime.Date == d);
				result.Add(new DayExchange { Date = d.ToShortDateString(), Exchange = (float)Math.Round(rate.NZDCNY, 4) });
			}

			return new ObjectResult(result);
		}

		private Func<float, string> currencyToNzd = (f) => { return f.ToString("C", CultureInfo.CreateSpecificCulture("en-NZ")); };
		private Func<float, string> currencyToCny = (f) =>
		{
			var ci = CultureInfo.CreateSpecificCulture("zh-CN");
			ci.NumberFormat.CurrencyNegativePattern = 1;
			return f.ToString("C", ci);
		};
		private Func<float, string> percentToString => (f) =>
		{
			var nfi = new CultureInfo("en-US", false).NumberFormat;
			return f.ToString("P", nfi);
		};
	}

	class MonthSale
	{
		public int Month { get; set; }
		public int Count { get; set; }
		public float Cost { get; set; }
		public float Income { get; set; }
		public float Profit { get; set; }
	}

	class DaySale
	{
		public string Date { get; set; }
		public int OrderCount { get; set; }
		public float Profit { get; set; }
	}

	class DayExchange
	{
		public string Date { get; set; }
		public float Exchange { get; set; }
	}
}
