using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.AspNet.Mvc.Rendering;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;

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
			return new ObjectResult(_context.Orders
				.Include(o => o.Products)
					.ThenInclude(p => p.Customer)
				.Include(o => o.Products)
					.ThenInclude(p => p.Product)
					.ThenInclude(p => p.Brand)
				.Include(o => o.Products)
					.ThenInclude(p => p.Product)
					.ThenInclude(p => p.Quotes)
					.ThenInclude(q => q.Supplier)
				.OrderBy(o => o.OrderTime)				
				.ToList());
		}

	}
}
