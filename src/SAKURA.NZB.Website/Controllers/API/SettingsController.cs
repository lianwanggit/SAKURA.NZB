using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Website.ViewModels;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class SettingsController : Controller
	{
		private Config _config;

		public SettingsController(Config config)
		{
			_config = config;
		}

		[HttpGet]
		public IActionResult Get()
		{
			var model = new SettingsModel
			{
				FixedRateLow = _config.FixedRateLow,
				FixedRateHigh = _config.FixedRateHigh,
				FreightRate = _config.FreightRate,
				ApiLayerAccessKey = _config.ApiLayerAccessKey,

				SenderName = _config.SenderName,
				SenderPhone = _config.SenderPhone,
				
				FlywayUri = _config.FlywayUri,
				FlywayCode = _config.FlywayCode,
				EfsPostUri = _config.EfsPostUri,
				NzstCode = _config.NzstCode,
				NzstUri = _config.NzstUri,
				FtdUri = _config.FtdUri,

				ProductItemsPerPage = _config.ProductItemsPerPage,
				OrdersItemsPerPage = _config.OrdersItemsPerPage,
				ExchangeHistoriesItemsPerPage = _config.ExchangeHistoriesItemsPerPage
			};

			return new ObjectResult(model);
		}

		[HttpPost]
		public IActionResult Post([FromBody]SettingsModel value)
		{
			if (value == null)
				return HttpBadRequest();

			if (!ModelState.IsValid)
				return HttpBadRequest();

			_config.FixedRateLow = value.FixedRateLow;
			_config.FixedRateHigh = value.FixedRateHigh;
			_config.FreightRate = value.FreightRate;
			_config.ApiLayerAccessKey = value.ApiLayerAccessKey;

			_config.SenderName = value.SenderName;
			_config.SenderPhone = value.SenderPhone;

			_config.FlywayUri = value.FlywayUri;
			_config.FlywayCode = value.FlywayCode;
			_config.EfsPostUri = value.EfsPostUri;
			_config.NzstCode = value.NzstCode;
			_config.NzstUri = value.NzstUri;
			_config.FtdUri = value.FtdUri;

			_config.ProductItemsPerPage = value.ProductItemsPerPage;
			_config.OrdersItemsPerPage = value.OrdersItemsPerPage;
			_config.ExchangeHistoriesItemsPerPage = value.ExchangeHistoriesItemsPerPage;

			_config.Save();

			return new NoContentResult();
		}

	}
}
