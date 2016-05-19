using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Business.Sale;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class DashboardController : Controller
	{
		private readonly NZBContext _context;
		private readonly Config _config;
		private readonly float _exchangeRate;
		private readonly MonthSaleCalculator _monthSaleCalculator;

		public DashboardController(NZBContext context, Config config, MonthSaleCalculator monthSaleCalculator)
		{
			_context = context;
			_config = config;
			_exchangeRate = _config.GetCurrentRate();
			_monthSaleCalculator = monthSaleCalculator;
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
					yesterdayProfit += (income - cost * _exchangeRate);
				}

				if (o.OrderTime.Date == today)
				{
					todayProfit += (income - cost * _exchangeRate);
				}
			}

			totalProfit = totalIncome - totalCost * _exchangeRate;
			profitIncrement = todayProfit - yesterdayProfit;
			profitIncrementRate = Math.Abs(yesterdayProfit == 0 ? 0 : profitIncrement / yesterdayProfit);

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
			return new ObjectResult(_monthSaleCalculator.Aggregate().OrderBy(s => s.Month));
		}

		[HttpGet("top-sale-products")]
		public IActionResult GetTopSaleProducts()
		{
			var orders = _context.Orders.Include(o => o.Products).ThenInclude(p => p.Product).ThenInclude(p => p.Brand).ToList();
			var result = from o in orders
						 from op in o.Products
						 group op by op.Product into pg
						 select new { ProductName = string.Concat(pg.Key.Brand.Name, ' ', pg.Key.Name), Count = pg.Sum(x => x.Qty) };

			return new ObjectResult(result.OrderByDescending(r => r.Count).Take(10));
		}

		[HttpGet("top-sale-brands")]
		public IActionResult GetTopSaleBrands()
		{
			var orders = _context.Orders.Include(o => o.Products).ThenInclude(p => p.Product).ThenInclude(p => p.Brand).ToList();
			var result = from o in orders
						 from op in o.Products
						 group op by op.Product.Brand into bg
						 select new { BrandName = bg.Key.Name, Count = (float)Math.Round(bg.Sum(x => x.Qty * (x.Price - x.Cost * _exchangeRate)), 2) };

			return new ObjectResult(result.OrderByDescending(r => r.Count).Take(10));
		}

		[HttpGet("past-30days-profit")]
		public IActionResult GetPast30DaysProfit()
		{
			var orders = _context.Orders.Include(o => o.Products).ToList();
			var dates = Enumerable.Range(1, 30).Select(i => DateTimeOffset.Now.Date.AddDays(i - 30));

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
					profit += (income - cost * _exchangeRate);
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
				result.Add(new DayExchange { Date = d.ToShortDateString(), Exchange = (float)Math.Round(rate?.NZDCNY ?? 0F, 4) });
			}

			return new ObjectResult(result);
		}

		[HttpGet("order-status")]
		public IActionResult GetOrderStatus()
		{
			var orders = _context.Orders.GroupBy(o => o.OrderState).Select(g => new { Status = g.Key.ToString(), Count = g.Count() }).ToList();
			var result = Enum.GetNames(typeof(OrderState)).Select(s => new { Status = s,
				Count = orders.FirstOrDefault(o => o.Status == s)?.Count ?? 0 });

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
