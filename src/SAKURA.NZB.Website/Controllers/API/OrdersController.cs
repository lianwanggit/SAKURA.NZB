using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System;
using System.Collections.Generic;

namespace SAKURA.NZB.Website.Controllers
{
	[Route("api/[controller]")]
	public class OrdersController : Controller
    {
        private NZBContext _context;

        public OrdersController(NZBContext context)
        {
            _context = context;    
        }

		[HttpGet]
		public IActionResult Get()
		{
			var orders =  _context.Orders
				.Include(o => o.Products)
					.ThenInclude(p => p.Customer)
				.Include(o => o.Products)
					.ThenInclude(p => p.Product)
					.ThenInclude(p => p.Brand)
				.OrderByDescending(o => o.OrderTime)
				.ToList();

			var models = new List<OrderModel>();
			orders.ForEach(o => 
			{
				var model = MapTo(o);
				models.Add(model);
			});

			return new ObjectResult(models);
		}

		private static OrderModel MapTo(Order o)
		{
			var model = new OrderModel
			{
				Id = o.Id,
				OrderTime = o.OrderTime.LocalDateTime,
				DeliveryTime = o.DeliveryTime?.LocalDateTime,
				ReceiveTime = o.ReceiveTime?.LocalDateTime,
				OrderState = o.OrderState,
				PaymentState = o.PaymentState,
				Weight = o.Weight,
				Freight = o.Freight,
				Waybill = o.Waybill,
				TransitStatus = o.TransitStatus,
				Description = o.Description,
				Recipient = o.Recipient,
				Phone = o.Phone,
				Address = o.Address,
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

	public class OrderModel
	{
		public int Id { get; set; }

		public DateTime OrderTime { get; set; }
		public DateTime? DeliveryTime { get; set; }
		public DateTime? ReceiveTime { get; set; }
		public OrderState OrderState { get; set; }
		public PaymentState PaymentState { get; set; }
		public float? Weight { get; set; }
		public float? Freight { get; set; }
		public Image Waybill { get; set; }
		public string TransitStatus { get; set; }
		public string Description { get; set; }
		public string Recipient { get; set; }
		public string Phone { get; set; }
		public string Address { get; set; }

		public List<CustomerOrderMode> CustomerOrders { get; set; }
	}

	public class CustomerOrderMode
	{
		public int CustomerId { get; set; }
		public string CustomerName { get; set; }

		public List<OrderProductModel> OrderProducts { get; set; }
	}

	public class OrderProductModel
	{
		public int ProductId { get; set; }
		public string ProductBrand { get; set; }
		public string ProductName { get; set; }
		public float Cost { get; set; }
		public float Price { get; set; }
		public int Qty { get; set; }
	}
}
