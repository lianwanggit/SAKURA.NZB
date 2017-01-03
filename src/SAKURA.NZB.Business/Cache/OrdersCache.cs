using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System.Collections.Generic;
using System.Linq;
using System;
using Serilog;

namespace SAKURA.NZB.Business.Cache
{
	public class OrdersCache : ICache, IItemsCache
	{
		private readonly NZBContext _context;
		private readonly ILogger _logger = Log.ForContext<OrdersCache>();

		public static IList<Order> Orders { get; private set; }

		public CacheKey Key => CacheKey.Orders;

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
				var order = FindOrderById(_context, id);
				if (order != null)
				{
					Orders.Add(order);
				}
			}
		}

		public void UpdateItem(int id, UpdateItemAction action)
		{
			Order order;
			switch (action)
			{
				case UpdateItemAction.Add:
					order = FindOrderById(_context, id);
					if (order == null)
					{
						_logger.Warning($"Can't add new item to Orders Cache, the order id {id} doesn't exist in database");
						return;
					}

					Orders.Add(order);
					break;
				case UpdateItemAction.Remove:
					order = Orders.FirstOrDefault(x => x.Id == id);
					if (order == null)
					{
						_logger.Warning($"Can't remove item from Orders Cache, the order id {id} doesn't exist in cache");
						return;
					}

					Orders.Remove(order);
					break;
				case UpdateItemAction.Replace:
					order = FindOrderById(_context, id);
					if (order == null)
					{
						_logger.Warning($"Can't update item of Orders Cache, the order id {id} doesn't exist in database");
						return;
					}

					var oldOrder = Orders.FirstOrDefault(x => x.Id == id);
					if (oldOrder == null)
					{
						_logger.Warning($"Can't update item of Orders Cache, the order id {id} doesn't exist in cache");
						return;
					}

					Orders.Remove(oldOrder);
					Orders.Add(order);
					break;
			}
		}

		private Func<NZBContext, int, Order> FindOrderById = (context, id) =>
		{
			return context.Orders
						.Include(o => o.Products)
							.ThenInclude(p => p.Customer)
						.Include(o => o.Products)
							.ThenInclude(p => p.Product)
							.ThenInclude(p => p.Brand)
						.FirstOrDefault(o => o.Id == id);
		};
	}
}
