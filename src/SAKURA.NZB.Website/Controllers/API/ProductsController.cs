using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System.Collections.Generic;
using SAKURA.NZB.Website.Models;
using SAKURA.NZB.Business.Configuration;
using System;
using System.Web.Http;

namespace SAKURA.NZB.Website.Controllers.API
{ 
	[Route("api/[controller]")]
	public class ProductsController : Controller
	{
		private readonly NZBContext _context;
		private readonly int _itemsPerPage;

		public ProductsController(NZBContext context, Config config)
		{
			_context = context;
			_itemsPerPage = config.GetItemsPerPage();
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
				.ThenBy(p => p.Brand.Name)
				.ThenBy(p => p.Name)
				.ToList());
		}

		[HttpGet("search")]
		public IActionResult Search([FromUri]SearchOptions options)
		{
			Func<Product, bool> categoryPredicate = (p) => true; 
			if (options.category.HasValue)
			{
				categoryPredicate = (p) => p.CategoryId == options.category;
			}

			Func<Product, bool> keywordPredicate = (p) => true;
			if (!string.IsNullOrEmpty(options.keyword))
			{
				keywordPredicate = (p) => p.Brand.Name.StartsWith(options.keyword, StringComparison.OrdinalIgnoreCase) ||
					p.Name.StartsWith(options.keyword, StringComparison.OrdinalIgnoreCase);
			}

			var products = (_context.Products
				.Include(p => p.Category)
				.Include(p => p.Brand)
				.Include(p => p.Quotes).ThenInclude(q => q.Supplier)
				.Include(p => p.Images)
				.Where(p => categoryPredicate(p) && keywordPredicate(p))
				.OrderBy(p => p.CategoryId)
				.ThenBy(p => p.Brand.Name)
				.ThenBy(p => p.Name)).ToList();

			var orders = _context.Orders.Include(o => o.Products).ToList();
			var orderProducts = orders.SelectMany(o => o.Products);

			var models = from p in products
					join op in orderProducts on p.Id equals op.ProductId into pg
					select new ProductSummaryModel
					{
						Id = p.Id,
						Name = p.Name,
						Brand = p.Brand.Name,
						Category = p.Category.Name,
						Price = p.Price,
						Quote = p.Quotes.Count > 0 ? p.Quotes.Min(q => q.Price) : default(float?),
						SoldHighPrice = pg.Count() > 0 ? pg.Max(g => g.Price) : default(float?),
						SoldLowPrice = pg.Count() > 0 ? pg.Min(g => g.Price) : default(float?),
						SoldCount = pg.Count() > 0 ? pg.Sum(g => g.Qty) : default(int?)
					};


			return new ObjectResult(new ProductsPagingModel(models.ToList(), _itemsPerPage, options.page.GetValueOrDefault()));
		}

		[HttpGet("get-brief")]
		public IActionResult GetBrief()
		{
			return new ObjectResult(_context.Products
				.Include(p => p.Brand)
				.Select(p => new { Id = p.Id, Name = p.Name, Brand = p.Brand.Name })
				.ToList());
		}

		[HttpGet("get-by-brand/{id:int}")]
		public IActionResult GetByBrand(int? id)
		{
			return new ObjectResult(_context.Products
				.Where(p => p.BrandId == id)
				.OrderBy(p => p.Name)
				.Select(p => p.Name));
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

			if (_context.Products.Any(p => p.Name == product.Name))
				return HttpBadRequest("name taken");

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

			if (_context.Products.Any(p => p.Name == product.Name && p.Id != product.Id))
				return HttpBadRequest("name taken");

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
					ProductId = q.ProductId,
					SupplierId = q.SupplierId,
					Price = q.Price
				});
			}
			_context.SaveChanges();

			return new NoContentResult();
		}

		[HttpDelete("{id}")]
		public void Delete(int id)
		{
			var item = _context.Products.Include(p => p.Quotes).FirstOrDefault(x => x.Id == id);
			if (item != null)
			{
				_context.Products.Remove(item);
				_context.SaveChanges();
			}
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

	public class SearchOptions
	{
		public int? page { get; set; }
		public int? category { get; set; }
		public string keyword { get; set; }
	}
}
