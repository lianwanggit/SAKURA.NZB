using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Business.Cache;
using SAKURA.NZB.Business.Configuration;
using System;

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
			ViewData["HistoryRate"] = ExchangeRateCache.RateDictionary[DateTime.Now.Year];
			ViewData["CounterRate"] = ExchangeRateCache.CounterRate;
			ViewData["LiveRate"] = _config.CurrentRate;
			ViewData["HighRate"] = _config.FixedRateHigh;
			ViewData["LowRate"] = _config.FixedRateLow;

			ViewData["Sender"] = _config.SenderName;
			ViewData["SenderPhone"] = _config.SenderPhone;
			ViewData["FreightRate"] = _config.FreightRate;

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
