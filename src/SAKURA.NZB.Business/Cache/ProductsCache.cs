using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Business.Cache
{
	public class ProductsCache : ICache
    {
		private readonly NZBContext _context;
		public static IList<Product> Products { get; private set; }

		public CacheKey Key => CacheKey.Products;
		public int Index => 1;

		public ProductsCache(NZBContext context)
		{
			_context = context;
		}

		public void Update()
		{
			Products = new List<Product>();
			var productIds = _context.Products.Select(x => x.Id).ToList();

			foreach (var id in productIds)
			{
				var product = _context.Products
									.Include(p => p.Category)
									.Include(p => p.Brand)
									.Include(p => p.Quotes).ThenInclude(q => q.Supplier)
									.Include(p => p.Images)
									.FirstOrDefault(p => p.Id == id);

				if (product != null)
				{
					Products.Add(product);
				}
			}
		}
	}
}
