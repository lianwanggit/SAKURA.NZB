using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System.Collections.Generic;
using System;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class ProductsController : Controller
	{
		private NZBContext _context;

		public ProductsController(NZBContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult Get()
		{
			return new ObjectResult(_context.Products
				.Include(p => p.Category)
				.Include(p => p.Brand)
				.Include(p => p.Quotes).ThenInclude(q => q.Supplier)
				.Include(p => p.Images)
				.OrderBy(p => p.CategoryId)
				.ThenBy(p => p.BrandId)
				.ToList());
		}

		[HttpGet("{id:int}", Name = "GetProduct")]
		public IActionResult Get(int? id)
		{
			if (id == null)
				return HttpNotFound();

			var item = _context.Products
				.Include(p => p.Category)
				.Include(p => p.Brand)
				.Include(p => p.Quotes).ThenInclude(q => q.Supplier)
				.Include(p => p.Images)
				.Single(p => p.Id == id);

			if (item == null)
				return HttpNotFound();

			return new ObjectResult(item);
		}

		[HttpPost]
		public IActionResult Post([FromBody]Product product)
		{
			if (product == null)
				return HttpBadRequest();

			if (!Validate(product))
				return HttpBadRequest();

			_context.Products.Add(product);
			_context.SaveChanges();

			return CreatedAtRoute("GetProduct", new { controller = "Products", id = product.Id }, product);
		}

		[HttpPut("{id:int}")]
		public IActionResult Put(int? id, [FromBody]Product product)
		{
			if (product == null || product.Id != id)
				return HttpBadRequest();

			if (!Validate(product))
				return HttpBadRequest();

			var item = _context.Products.Include(p => p.Quotes).FirstOrDefault(x => x.Id == id);
			if (item == null)
			{
				return HttpNotFound();
			}

			item.Name = product.Name;
			item.CategoryId = product.CategoryId;
			item.BrandId = product.BrandId;
			item.Price = product.Price;
			item.Desc = product.Desc;

			item.Quotes.Clear();
			_context.SaveChanges();

			foreach (var q in product.Quotes)
			{
				item.Quotes.Add(new ProductQuote
				{
					ProductId =  q.ProductId,
					SupplierId = q.SupplierId,
					Price = q.Price
				});
			}
			_context.SaveChanges();

			return new NoContentResult();
		}

		private bool Validate(Product product)
		{
			if (string.IsNullOrEmpty(product.Name))
				return false;

			if (!_context.Categories.Any(c => c.Id == product.CategoryId))
				return false;

			if (!_context.Brands.Any(b => b.Id == product.BrandId))
				return false;

			foreach (var q in product.Quotes)
			{
				if (q.Price <= 0.0)
					return false;

				if (!_context.Suppliers.Any(s => s.Id == q.SupplierId))
					return false;
			}

			if (product.Price <= 0.0)
				return false;

			return true;
		}
	}

	class ProductQuoteComparer : IEqualityComparer<ProductQuote>
	{
		public bool Equals(ProductQuote x, ProductQuote y)
		{
			return x.ProductId == y.ProductId
				&& x.SupplierId == y.SupplierId
				&& x.Price == y.Price;
		}

		public int GetHashCode(ProductQuote obj)
		{
			unchecked
			{
				var hashCode = 13;
				hashCode = (hashCode * 397) ^ obj.ProductId;
				hashCode = (hashCode * 397) ^ obj.SupplierId;
				hashCode = (hashCode * 397) ^ obj.Price.GetHashCode();
				return hashCode;
			}
		}
	}
}
