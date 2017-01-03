using SAKURA.NZB.Data;
using System;
using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Business.Cache
{
	public class MonthSaleCache : ICache
	{
		private readonly NZBContext _context;
		public static List<MonthSale> MonthSaleList { get;  private set;}

		public CacheKey Key => CacheKey.MonthSale;

		public MonthSaleCache(NZBContext context)
		{
			_context = context;
		}

		public void Update()
		{
			var result = new List<MonthSale>();

			foreach (var o in OrdersCache.Orders)
			{
				var year = o.OrderTime.Year;
				var month = o.OrderTime.Month;
				var cost = 0F;
				var income = 0F;

				foreach (var p in o.Products)
				{
					cost += (p.Cost * p.Qty);
					income += (p.Price * p.Qty);
				}

				cost += (o.Freight ?? 0F);
				var profit = income - cost * ExchangeRateCache.RateDictionary[year];

				var sale = result.FirstOrDefault(s => s.Month == month && s.Year == year);
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
						Year = year,
						Month = month,
						Count = 1,
						Cost = cost,
						Income = income,
						Profit = profit
					});
				}
			}

			var years = result.GroupBy(x => x.Year).Select(g => g.Key);
			foreach (var year in years)
			{
				var maxMonth = year == DateTime.Now.Year ? DateTime.Now.Month : 12;
				for (var i = 1; i <= maxMonth; i++)
				{
					var sale = result.FirstOrDefault(r => r.Month == i && r.Year == year);
					if (sale == null)
					{
						result.Add(new MonthSale
						{
							Year = year,
							Month = i,
							Count = 0,
							Cost = 0,
							Income = 0,
							Profit = 0
						});
					}
					else
					{
						sale.Cost = (float)Math.Round(sale.Cost, 2);
						sale.Income = (float)Math.Round(sale.Income, 2);
						sale.Profit = (float)Math.Round(sale.Profit, 2);
					}
				}
			}

			MonthSaleList = result;
		}
    }
}
