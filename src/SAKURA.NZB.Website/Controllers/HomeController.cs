using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Business.Cache;
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
			ViewData["HistoryRate"] = ExchangeRateCache.Rate;
			ViewData["LiveRate"] = _config.GetCurrentRate();
			ViewData["HighRate"] = _config.GetFixedRateHigh();
			ViewData["LowRate"] = _config.GetFixedRateLow();

			ViewData["Sender"] = _config.GetSender();
			ViewData["SenderPhone"] = _config.GetSenderPhone();
			ViewData["FreightRate"] = _config.GetFreightRate();

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
