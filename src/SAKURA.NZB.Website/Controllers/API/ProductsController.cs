using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;

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

		private bool Validate(Product product)
		{
			if (string.IsNullOrEmpty(product.Name))
				return false;

			var category = _context.Categories.FirstOrDefault(c => c.Id == product.CategoryId);
			if (category == null)
				return false;
			product.Category = category;

			var brand = _context.Brands.FirstOrDefault(b => b.Id == product.BrandId);
			if (brand == null)
				return false;
			product.Brand = brand;

			foreach (var q in product.Quotes)
			{
				if (q.Price <= 0.0)
					return false;

				var supplier = _context.Suppliers.FirstOrDefault(s => s.Id == q.SupplierId);
				if (supplier == null)
					return false;
				q.Supplier = supplier;
			}

			if (product.Price <= 0.0)
				return false;

			return true;
		}
	}
}
