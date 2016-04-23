using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Business.Configuration;

namespace SAKURA.NZB.Website.Controllers
{
	public class HomeController : Controller
    {
		private Config _config;

		public HomeController(Config config)
		{
			_config = config;
		}

		public IActionResult Index()
        {
			ViewData["CurrencyRate"] = _config.GetCurrentRate();
			return View();
        }

        public IActionResult Contact()
        {
            return View();
        }

        public IActionResult Error()
        {
            return View();
        }
    }
}
