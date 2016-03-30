using Newtonsoft.Json;
using System;

namespace SAKURA.NZB.Core.ExchangeRate
{
	public class LiveRatesResponse
	{
		public bool success { get; set; }
		public string terms { get; set; }
		public string privacy { get; set; }
		[JsonConverter(typeof(MicrosecondEpochConverter))]
		public DateTime timestamp { get; set; }
		public string source { get; set; }
		public CurrencyQuotes quotes { get; set; }
	}

	public class CurrencyQuotes
	{
		public float USDNZD { get; set; }
		public float USDCNY { get; set; }
	}
}
