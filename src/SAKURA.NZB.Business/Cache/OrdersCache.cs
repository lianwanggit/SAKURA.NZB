using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Business.Cache
{
	public class OrdersCache : ICache
	{
		private readonly NZBContext _context;
		public static IList<Order> Orders { get; private set; }

		public CacheKey Key => CacheKey.Orders;
		public int Index => 1;

		public OrdersCache(NZBContext context)
		{
			_context = context;
		}

		public void Update()
		{
			Orders = new List<Order>();
			var orderIds = _context.Orders.Select(x => x.Id).ToList();

			foreach (var id in orderIds)
			{
				var order = _context.Orders
				.Include(o => o.Products)
					.ThenInclude(p => p.Customer)
				.Include(o => o.Products)
					.ThenInclude(p => p.Product)
					.ThenInclude(p => p.Brand)
				.FirstOrDefault(o => o.Id == id);

				if (order != null)
				{
					Orders.Add(order);
				}
			}
		}
	}
}
