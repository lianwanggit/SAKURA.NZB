using System.Linq;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Data;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
    public class ExchangeRatesController : Controller
    {
		private NZBContext _context;

		public ExchangeRatesController(NZBContext context)
		{
			_context = context;
		}

        [HttpGet]
        public IActionResult Get()
        {
            return new ObjectResult(_context.ExchangeRates.ToList());
        }

        [HttpGet, Route("latest")]
        public IActionResult Get(int id)
        {
			return new ObjectResult(_context.ExchangeRates.OrderByDescending(e => e.ModifiedTime).FirstOrDefault());
		}
    }
}
