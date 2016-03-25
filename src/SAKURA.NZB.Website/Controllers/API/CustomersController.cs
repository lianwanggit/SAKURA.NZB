using System.Linq;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class CustomersController : Controller
    {
        private NZBContext _context;

        public CustomersController(NZBContext context)
        {
            _context = context;    
        }

		[HttpGet]
		// GET: Customers
		public IActionResult Get()
        {
            return new JsonResult(_context.Customers.ToList());
        }

		[HttpGet("{id:int}")]
		// GET: Customers/Details/5
		public IActionResult Get(int? id)
        {
            if (id == null)
            {
                return HttpNotFound();
            }

            Customer customer = _context.Customers.Single(m => m.Id == id);
            if (customer == null)
            {
                return HttpNotFound();
            }

            return new JsonResult(customer);
        }
    }
}
