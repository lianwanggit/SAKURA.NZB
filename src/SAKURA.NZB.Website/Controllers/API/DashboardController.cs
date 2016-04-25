using Microsoft.AspNet.Mvc;
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
			var summary = new { customerCount = _context.Customers.Count(),
				brandCount = _context.Brands.Count(),
				productCount = _context.Products.Count(),
				orderCount = _context.Orders.Count()
			};

			return new ObjectResult(summary);
		}

		[HttpGet("annual-sales")]
		public IActionResult GetAnnualSales()
		{
			var result = new List<MonthSale>(); ;
			foreach (var o in _context.Orders.Include(o => o.Products).Where(o => o.OrderTime.Year == DateTime.Now.Year))
			{
				var month = o.OrderTime.Month;
				var monthName = o.OrderTime.ToString("MMM", CultureInfo.InvariantCulture);
				var cost = 0F;
				var income = 0F;

				foreach (var p in o.Products)
				{
					cost += p.Cost * p.Qty;
					income += p.Price * p.Qty;
				}

				cost += o.Freight ?? 0F;
				var profit = income - cost * _config.GetCurrentRate();

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
					result.Add(new MonthSale {
						Month = month,
						MonthName = monthName,
						Count = 1,
						Cost = cost,
						Income = income,
						Profit = profit
					});
				}
			}

			//return new ObjectResult(result.OrderBy(s => s.Month));

			var r = Enumerable.Range(1, 12).Select(i => new MonthSale {
				Month = i,
				MonthName = (new DateTime(DateTime.Now.Year, i, 1)).ToString("MMM", CultureInfo.InvariantCulture),
				Count = new Random(i).Next(10, 100),
				Cost = new Random(i).Next(500, 1000) + (new Random(i).Next(10, 100)) / 100F,
				Income = new Random(i).Next(1000, 5000) + (new Random(i).Next(10, 100)) / 100F,
				Profit = new Random(i).Next(200, 1000) + (new Random(i).Next(10, 100)) / 100F
			});

			return new ObjectResult(r);
		}
	}

	class MonthSale
	{
		public int Month { get; set; }
		public string MonthName { get; set; }
		public int Count { get; set; }
		public float Cost { get; set; }
		public float Income { get; set; }
		public float Profit { get; set; }
	}
}
