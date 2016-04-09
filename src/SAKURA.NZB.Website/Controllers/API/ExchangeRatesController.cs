﻿using System.Linq;
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

		private class NzdToCnyRates
		{
			public float FixedRateHigh { get; set; }
			public float FixedRateLow { get; set; }
			public float? CurrentRate { get; set; }
		}

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

        [HttpGet, Route("latest")]
        public IActionResult Get(int id)
        {
			return new ObjectResult(new NzdToCnyRates {
				FixedRateHigh = _config.GetFixedRateHigh(),
				FixedRateLow = _config.GetFixedRateLow(),
				CurrentRate = _config.GetCurrentRate()
			});
		}
    }
}
