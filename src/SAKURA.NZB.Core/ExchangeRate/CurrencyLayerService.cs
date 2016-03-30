using SAKURA.NZB.Core.Configuration;
using SAKURA.NZB.Data;
using System;
using System.Linq;

namespace SAKURA.NZB.Core.ExchangeRate
{
	// http://apilayer.net/api/live?access_key=74827d4a5b704e85163ec84175a11ae5&currencies=NZD,CNY&format=1
	public class CurrencyLayerService
	{
		public string BaseAddress = "http://apilayer.net/";
		private readonly NZBContext _context;
		private readonly Config _config;

		public CurrencyLayerService(NZBContext context, Config config)
		{
			_context = context;
			_config = config;
		}

		public void LiveRequest()
		{
			var accessKey = _config.GetApiLayerAccessKey();
			var routeUri = $"api/live?access_key={accessKey}&currencies=NZD,CNY&format=1";
			var response = WebApiInvoker.GetAsync<LiveRatesResponse>(BaseAddress, routeUri);
					
			var result = response.Result;
			if (!response.Result.success) return;

			var ratesToday = _context.ExchangeRates.FirstOrDefault(x => x.ModifiedTime.Date == DateTimeOffset.Now.Date);

			if (ratesToday != null)
			{
				ratesToday.USDCNY = result.quotes.USDCNY;
				ratesToday.USDNZD = result.quotes.USDNZD;
			}
			else
			{
				ratesToday = new Domain.ExchangeRate
				{
					USDCNY = result.quotes.USDCNY,
					USDNZD = result.quotes.USDNZD,
					Source = BaseAddress
				};

				_context.ExchangeRates.Add(ratesToday);
			}

			ratesToday.NZDCNY = ratesToday.USDCNY / ratesToday.USDNZD;
			ratesToday.ModifiedTime = DateTimeOffset.Now;

			_context.SaveChanges();	
		}

	}
}
