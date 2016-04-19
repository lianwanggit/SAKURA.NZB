using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System;
using System.Collections.Generic;
using System.Globalization;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Website.Models;

namespace SAKURA.NZB.Website.Controllers
{
	[Route("api/[controller]")]
	public class OrdersController : Controller
	{
		private readonly NZBContext _context;
		private readonly Config _config;

		public OrdersController(NZBContext context, Config config)
		{
			_context = context;
			_config = config;
		}

		[HttpGet]
		public IActionResult Get()
		{
			var orders = _context.Orders
				.Include(o => o.Products)
					.ThenInclude(p => p.Customer)
				.Include(o => o.Products)
					.ThenInclude(p => p.Product)
					.ThenInclude(p => p.Brand)
				.OrderByDescending(o => o.OrderTime)
				.ToList();

			var sender = _config.GetSender();
			var senderPhone = _config.GetSenderPhone();
			var models = new List<OrderModel>();
			orders.ForEach(o =>
			{
				var model = MapTo(o, sender, senderPhone);
				models.Add(model);
			});

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

		[HttpGet("get-sender-info")]
		public IActionResult GetSenderInfo()
		{
			return new ObjectResult(new { Sender = _config.GetSender(), SenderPhone = _config.GetSenderPhone() });
		}

		[HttpGet("search/{keyword?}")]
		public IActionResult Search(string keyword, [FromQuery]string orderState, [FromQuery]string paymentState)
		{
			var orders = _context.Orders
				.Include(o => o.Products)
					.ThenInclude(p => p.Customer)
				.Include(o => o.Products)
					.ThenInclude(p => p.Product)
					.ThenInclude(p => p.Brand)
				.Where(o => (string.IsNullOrEmpty(orderState) || (!string.IsNullOrEmpty(orderState) && o.OrderState.ToString() == orderState))
					&& (string.IsNullOrEmpty(paymentState) || (!string.IsNullOrEmpty(paymentState) && o.PaymentState.ToString() == paymentState))
					&& (string.IsNullOrEmpty(keyword) || (!string.IsNullOrEmpty(keyword) 
						&& ((!string.IsNullOrEmpty(o.WaybillNumber) && o.WaybillNumber.StartsWith(keyword))
							|| o.Products.Any(p  => p.Product.Brand.Name.ToLower().StartsWith(keyword.ToLower()))
							|| o.Products.Any(p => p.Customer.NamePinYin.ToLower().StartsWith(keyword.ToLower()) 
								|| p.Customer.FullName.StartsWith(keyword))
							))))
				.OrderByDescending(o => o.OrderTime)
				.ToList();

			var sender = _config.GetSender();
			var senderPhone = _config.GetSenderPhone();
			var models = new List<OrderModel>();
			orders.ForEach(o =>
			{
				var model = MapTo(o, sender, senderPhone);
				models.Add(model);
			});

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

		//IQueryable<Product> SearchProducts(params string[] keywords)
		//{
		//	var predicate = PredicateBuilder.False<Product>();

		//	foreach (string keyword in keywords)
		//	{
		//		string temp = keyword;
		//		predicate = predicate.Or(p => p.Description.Contains(temp));
		//	}
		//	return dataContext.Products.Where(predicate);
		//}

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

			return new ObjectResult(new UpdateOrderStatusResultModel {
				OrderId = item.Id,
				OrderState = item.OrderState.ToString(),
				PaymentState = item.PaymentState.ToString()
			});
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

			return new ObjectResult(new OrderDeliveryResultModel {
				OrderId = item.Id,
				WaybillNumber = item.WaybillNumber,
				Weight = item.Weight,
				Freight = item.Freight,
				OrderState = item.OrderState.ToString()
			});
		}

		private static OrderModel MapTo(Order o, string sender, string senderPhone)
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
				TransitStatus = o.TransitStatus,
				Description = o.Description,
				Recipient = o.Recipient,
				Phone = o.Phone,
				Address = o.Address,
				Sender = sender,
				SenderPhone = senderPhone,
				CustomerOrders = new List<CustomerOrderMode>()
			};

			foreach (var p in o.Products)
			{
				var orderProductModel = new OrderProductModel
				{
					ProductId = p.ProductId,
					ProductBrand = p.Product.Brand.Name,
					ProductName = p.Product.Name,
					Cost = p.Cost,
					Price = p.Price,
					Qty = p.Qty
				};

				var customer = model.CustomerOrders.FirstOrDefault(c => c.CustomerId == p.CustomerId);
				if (customer == null)
				{
					customer = new CustomerOrderMode
					{
						CustomerId = p.CustomerId,
						CustomerName = p.Customer.FullName,
						OrderProducts = new List<OrderProductModel>()
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
}
