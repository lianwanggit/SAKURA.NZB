using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Data;
using Serilog;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SAKURA.NZB.Business.CurrencyTracking
{
	public class CurrencyLayerTracker
	{
		private readonly NZBContext _context;
		private readonly Config _config;
		private readonly ILogger _logger = Log.ForContext<CurrencyLayerTracker>();

		public string Source { get { return "http://apilayer.net/"; } }

		public CurrencyLayerTracker(NZBContext context, Config config)
		{
			_context = context;
			_config = config;
		}

		public LiveRatesResponse Query()
		{
			var accessKey = _config.ApiLayerAccessKey;
			var routeUri = $"api/live?access_key={accessKey}&currencies=NZD,CNY&format=1";
			var response = GetAsync(Source, routeUri);
					
			return response.Result;
		}

		private async Task<LiveRatesResponse> GetAsync(string baseAddress, string routeUri)
		{
			using (var client = new HttpClient())
			{
				client.BaseAddress = new Uri(baseAddress);
				client.DefaultRequestHeaders.Accept.Clear();
				client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

				try
				{
					var response = await client.GetAsync(routeUri);
					response.EnsureSuccessStatusCode();

					return await response.Content.ReadAsAsync<LiveRatesResponse>();
				}
				catch (Exception ex)
				{
					Log.Error(ex, "Failed to get data from web api: {0}", baseAddress + routeUri);
					return default(LiveRatesResponse);
				}
			}
		}

	}
}
