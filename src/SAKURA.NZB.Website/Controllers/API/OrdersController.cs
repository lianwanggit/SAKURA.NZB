using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System;
using System.Collections.Generic;
using System.Globalization;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Website.ViewModels;
using System.Web.Http;
using SAKURA.NZB.Business.Cache;
using MediatR;
using SAKURA.NZB.Business.MediatR.Messages;

namespace SAKURA.NZB.Website.Controllers
{
	[Route("api/[controller]")]
	public class OrdersController : Controller
	{
		private readonly NZBContext _context;
		private readonly int _itemsPerPage;
		private readonly IMediator _mediator;
		private readonly ICacheRepository _cacheRepository;

		public OrdersController(NZBContext context, Config config, IMediator mediator, ICacheRepository cacheRepository)
		{
			_context = context;
			_itemsPerPage = config.OrdersItemsPerPage;
			_mediator = mediator;
			_cacheRepository = cacheRepository;
		}

		[HttpGet]
		public IActionResult Get()
		{
			var models = (from o in OrdersCache.Orders
						  orderby o.Products.FirstOrDefault()?.Customer.NamePinYin
						  orderby o.OrderTime descending
						  select MapTo(o)).ToList();

			var groupedModels = from m in models
								group m by m.OrderTime.Year into yg
								select
								new
								{
									Year = yg.Key,
									MonthGroups =
										from o in yg
										group o by o.OrderTime.ToString("MMMM", CultureInfo.InvariantCulture) into mg
										select new { Month = mg.Key, Models = mg }
								};

			return new ObjectResult(groupedModels);
		}

		[HttpGet("get-latest-by-product/{id:int}")]
		public IActionResult GetLatestByProduct(int? id)
		{
			var order = (from o in OrdersCache.Orders
						 from p in o.Products
						 where p.ProductId == id
						 orderby o.OrderTime descending
						 select new
						 {
							 Waybill = o.WaybillNumber,
							 Customer = p.Customer.FullName.Trim(),
							 OrderTime = o.OrderTime.ToString("d")
						 }).FirstOrDefault();

			if (order == null)
				return new HttpNotFoundResult();

			return new ObjectResult(order);
		}

		[HttpGet("search")]
		public IActionResult Search([FromUri]SearchOptions options)
		{
			Func<Order, bool> statePredicate = (p) => true;
			if (!string.IsNullOrEmpty(options.state))
			{
				statePredicate = (o) => o.OrderState.ToString() == options.state;
			}

			Func<Order, bool> paymentPredicate = (p) => true;
			if (!string.IsNullOrEmpty(options.payment))
			{
				paymentPredicate = (o) => o.PaymentState.ToString() == options.payment;
			}

			Func<Order, bool> keywordPredicate = (p) => true;
			if (!string.IsNullOrEmpty(options.keyword))
			{
				keywordPredicate = (o) => (!string.IsNullOrEmpty(o.WaybillNumber) && o.WaybillNumber.StartsWith(options.keyword))
									|| o.Products.Any(p => p.Product.Brand.Name.ToLower().StartsWith(options.keyword.ToLower()))
									|| o.Products.Any(p => p.Customer.NamePinYin.ToLower().StartsWith(options.keyword.ToLower()));
			}

			var orders = OrdersCache.Orders
				.Where(o => keywordPredicate(o) && statePredicate(o) && paymentPredicate(o))
				.OrderByDescending(o => o.OrderTime)
				.ThenBy(o => o.Products.First().Customer.NamePinYin)
				.ToList();

			var monthSaleSummary = MonthSaleCache.MonthSaleList;
			var models = new List<OrderModel>();
			orders.ForEach(o =>
			{
				var model = MapTo(o);
				model.MonthSale = monthSaleSummary.First(ms => ms.Month == model.OrderTime.Month);
				models.Add(model);
			});

			return new ObjectResult(new OrdersPagingModel(models.ToList(), _itemsPerPage, options.page.GetValueOrDefault()));
		}

		[HttpGet("{id:int}", Name = "GetOrder")]
		public IActionResult Get(int? id)
		{
			if (id == null)
				return HttpNotFound();

			var item = _context.Orders
				.Include(o => o.Products)
					.ThenInclude(p => p.Customer)
				.Include(o => o.Products)
					.ThenInclude(p => p.Product)
					.ThenInclude(p => p.Brand)
				.Where(o => o.Id == id)
				.Single();

			if (item == null)
				return HttpNotFound();

			return new ObjectResult(MapTo(item));
		}

		[HttpPost("update-order-status")]
		public IActionResult UpdateOrderStatus([FromBody]UpdateOrderStatusModel model)
		{
			var item = _context.Orders.FirstOrDefault(x => x.Id == model.OrderId);
			if (item == null)
			{
				return HttpNotFound();
			}

			OrderAction oa;
			if (!Enum.TryParse(model.Action, out oa))
				return HttpBadRequest();

			switch (oa)
			{
				case OrderAction.ToConfirmed:
					if (item.OrderState != OrderState.Created)
						return HttpBadRequest();
					item.OrderState = OrderState.Confirmed;
					break;
				case OrderAction.ToReceived:
					if (item.OrderState != OrderState.Delivered)
						return HttpBadRequest();
					item.ReceiveTime = DateTimeOffset.Now;
					item.OrderState = OrderState.Received;
					break;
				case OrderAction.ToCompleted:
					if (item.OrderState != OrderState.Received || item.PaymentState != PaymentState.Paid)
						return HttpBadRequest();
					item.CompleteTime = DateTimeOffset.Now;
					item.OrderState = OrderState.Completed;
					break;
				case OrderAction.ToPaid:
					if (item.PaymentState != PaymentState.Unpaid)
						return HttpBadRequest();
					item.PayTime = DateTimeOffset.Now;
					item.PaymentState = PaymentState.Paid;
					break;
				default:
					return HttpBadRequest();
			}

			_context.SaveChanges();
			_cacheRepository.UpdateByKey(CacheKey.Orders);

			return new ObjectResult(new UpdateOrderStatusResultModel
			{
				OrderId = item.Id,
				OrderState = item.OrderState.ToString(),
				PaymentState = item.PaymentState.ToString()
			});
		}

		[HttpPost]
		public IActionResult Post([FromBody]OrderModel model)
		{
			if (model == null)
				return HttpBadRequest();

			if (!Validate(model))
				return HttpBadRequest();

			_context.Orders.Add(Map(model));
			_context.SaveChanges();

			_cacheRepository.UpdateByKey(CacheKey.Orders);
			_mediator.Publish(new MonthSaleUpdated());

			return CreatedAtRoute("GetOrder", new { controller = "Orders", id = model.Id }, model);
		}

		[HttpPost("deliver")]
		public IActionResult Deliver([FromBody]OrderDeliveryModel model)
		{
			var item = _context.Orders.FirstOrDefault(x => x.Id == model.OrderId);
			if (item == null)
			{
				return HttpNotFound();
			}

			item.WaybillNumber = model.WaybillNumber;
			item.Weight = model.Weight;
			item.Freight = model.Freight;
			item.OrderState = OrderState.Delivered;
			item.DeliveryTime = DateTimeOffset.Now;

			_context.SaveChanges();

			_cacheRepository.UpdateByKey(CacheKey.Orders);
			_mediator.Publish(new MonthSaleUpdated());

			return new ObjectResult(new OrderDeliveryResultModel
			{
				OrderId = item.Id,
				WaybillNumber = item.WaybillNumber,
				Weight = item.Weight,
				Freight = item.Freight,
				OrderState = item.OrderState.ToString()
			});
		}

		[HttpPut("{id:int}")]
		public IActionResult Put(int? id, [FromBody]OrderModel model)
		{
			if (model == null || model.Id != id)
				return HttpBadRequest();

			if (!Validate(model))
				return HttpBadRequest();

			var item = _context.Orders.Include(o => o.Products).FirstOrDefault(x => x.Id == id);
			if (item == null)
			{
				return HttpNotFound();
			}

			var order = Map(model);

			item.Id = order.Id;
			item.OrderTime = order.OrderTime;
			item.DeliveryTime = order.DeliveryTime;
			item.ReceiveTime = order.ReceiveTime;
			item.OrderState = order.OrderState;
			item.PaymentState = order.PaymentState;
			item.WaybillNumber = order.WaybillNumber;
			item.Weight = order.Weight;
			item.Freight = order.Freight;
			item.Waybill = order.Waybill;
			item.Description = order.Description;
			item.Recipient = order.Recipient;
			item.Phone = order.Phone;
			item.Address = order.Address;

			item.Products.Clear();
			_context.SaveChanges();

			foreach (var o in order.Products)
			{
				item.Products.Add(new OrderProduct
				{
					Cost = o.Cost,
					Price = o.Price,
					Qty = o.Qty,
					ProductId = o.ProductId,
					ProductName = o.ProductName,
					CustomerId = o.CustomerId,
					Purchased = o.Purchased
				});
			}
			_context.SaveChanges();

			_cacheRepository.UpdateByKey(CacheKey.Orders);
			_mediator.Publish(new MonthSaleUpdated());

			return new NoContentResult();
		}

		[HttpDelete("{id}")]
		public void Delete(int id)
		{
			var item = _context.Orders.Include(o => o.Products).FirstOrDefault(x => x.Id == id);
			if (item != null)
			{
				_context.Orders.Remove(item);
				_context.SaveChanges();

				_cacheRepository.UpdateByKey(CacheKey.Orders);
				_mediator.Publish(new MonthSaleUpdated());
			}
		}

		private bool Validate(OrderModel model)
		{
			if (string.IsNullOrEmpty(model.Recipient) || string.IsNullOrEmpty(model.Phone) || string.IsNullOrEmpty(model.Address))
				return false;

			if (model.CustomerOrders.Count == 0) return false;
			for (var i = 0; i < model.CustomerOrders.Count; i++)
			{
				var co = model.CustomerOrders[i];
				if (_context.Customers.All(c => c.Id != co.CustomerId)) return false;

				if (co.OrderProducts.Count == 0) return false;
				for (var j = 0; j < co.OrderProducts.Count; j++)
				{
					var op = co.OrderProducts[j];
					if (_context.Products.All(p => p.Id != op.ProductId)) return false;
					if (string.IsNullOrEmpty(op.ProductName)) return false;
					if (op.Cost < 0 || op.Price < 0 || op.Qty < 1) return false;
				}
			}

			return true;
		}


		static Func<string, OrderState> StringToOrderState = (str) =>
		{
			OrderState state;
			if (Enum.TryParse(str, out state))
				return state;
			return OrderState.Created;
		};

		static Func<string, PaymentState> StringToPaymentState = (str) =>
		{
			PaymentState state;
			if (Enum.TryParse(str, out state))
				return state;
			return PaymentState.Unpaid;
		};

		static Func<DateTime?, DateTimeOffset?> NullableDateTimeToOffset = (dt) => { return dt.HasValue ? dt.Value.ToLocalTime() : (DateTimeOffset?)null; };

		private static Order Map(OrderModel model)
		{
			var order = new Order
			{
				Id = model.Id,
				OrderTime = model.OrderTime.ToLocalTime(),
				DeliveryTime = NullableDateTimeToOffset(model.DeliveryTime),
				ReceiveTime = NullableDateTimeToOffset(model.ReceiveTime),
				OrderState = StringToOrderState(model.OrderState),
				PaymentState = StringToPaymentState(model.PaymentState),
				WaybillNumber = model.WaybillNumber,
				Weight = model.Weight,
				Freight = model.Freight,
				Waybill = model.Waybill,
				Description = model.Description,
				Recipient = model.Recipient,
				Phone = model.Phone,
				Address = model.Address,
				Products = new List<OrderProduct>()
			};

			foreach (var co in model.CustomerOrders)
			{
				foreach (var op in co.OrderProducts)
				{
					var p = order.Products.FirstOrDefault(x => x.ProductId == op.ProductId && x.ProductName == op.ProductName && x.CustomerId == co.CustomerId);
					if (p == null)
					{
						order.Products.Add(new OrderProduct
						{
							Cost = op.Cost,
							Price = op.Price,
							Qty = op.Qty,
							Purchased = op.Purchased,
							ProductId = op.ProductId,
							ProductName = op.ProductName,
							CustomerId = co.CustomerId
						});
					}
					else
					{
						p.Cost = op.Cost;
						p.Price = op.Price;
						p.Qty = op.Qty;
						p.Purchased = op.Purchased;
						p.ProductId = op.ProductId;
						p.CustomerId = co.CustomerId;
					}

				}
			}

			return order;
		}

		private OrderModel MapTo(Order o)
		{
			var model = new OrderModel
			{
				Id = o.Id,
				OrderTime = o.OrderTime.LocalDateTime,
				DeliveryTime = o.DeliveryTime?.LocalDateTime,
				ReceiveTime = o.ReceiveTime?.LocalDateTime,
				OrderState = o.OrderState.ToString(),
				PaymentState = o.PaymentState.ToString(),
				WaybillNumber = o.WaybillNumber,
				Weight = o.Weight,
				Freight = o.Freight,
				Waybill = o.Waybill,
				Description = o.Description,
				Recipient = o.Recipient,
				Phone = o.Phone,
				Address = o.Address,
				CustomerOrders = new List<CustomerOrderMode>()
			};

			var products = o.Products.OrderBy(p => p.ProductName).ToList();
			foreach (var p in products)
			{
				var orderProductModel = new OrderProductModel
				{
					ProductId = p.ProductId,
					ProductBrand = p.Product.Brand.Name,
					ProductName = p.ProductName,
					Cost = p.Cost,
					Price = p.Price,
					Qty = p.Qty,
					Purchased = p.Purchased
				};

				var customer = model.CustomerOrders.FirstOrDefault(c => c.CustomerId == p.CustomerId);
				if (customer == null)
				{
					customer = new CustomerOrderMode
					{
						CustomerId = p.CustomerId,
						CustomerName = p.Customer.FullName,
						OrderProducts = new List<OrderProductModel>
						{
							orderProductModel
						}
					};
					model.CustomerOrders.Add(customer);
				}
				else
				{
					customer.OrderProducts.Add(orderProductModel);
				}
			}

			return model;
		}
	}

	public class SearchOptions
	{
		public int? page { get; set; }
		public string keyword { get; set; }
		public string state { get; set; }
		public string payment { get; set; }
	}
}
