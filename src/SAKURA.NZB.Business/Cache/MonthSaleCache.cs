using Microsoft.Data.Entity;
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
		public int Index => 2;

		public MonthSaleCache(NZBContext context)
		{
			_context = context;
		}

		public void Update()
		{
			var result = new List<MonthSale>();
			var orders = _context.Orders.Include(o => o.Products).Where(o => o.OrderTime.Year == DateTime.Now.Year).ToList();

			foreach (var o in orders)
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
				var profit = income - cost * ExchangeRateCache.AverageRate;

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
				else
				{
					sale.Cost = (float)Math.Round(sale.Cost, 2);
					sale.Income = (float)Math.Round(sale.Income, 2);
					sale.Profit = (float)Math.Round(sale.Profit, 2);
				}
			}

			MonthSaleList = result;
		}
    }
}
