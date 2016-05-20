using System.Linq;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Data;
using SAKURA.NZB.Business.Configuration;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
    public class ExchangeRatesController : Controller
    {
		private NZBContext _context;
		private Config _config;

		public ExchangeRatesController(NZBContext context, Config config)
		{
			_context = context;
			_config = config;
		}

        [HttpGet]
        public IActionResult Get()
        {
            return new ObjectResult(_context.ExchangeRates.ToList());
        }
    }
}
