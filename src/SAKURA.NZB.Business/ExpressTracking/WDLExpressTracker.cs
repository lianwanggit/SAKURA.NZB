using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Domain;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SAKURA.NZB.Business.ExpressTracking
{
    public class WDLExpressTracker : IExpressTracker
	{
		private readonly Config _config;
		private readonly ILogger _logger = Log.ForContext<FlywayExpressTracker>();

		public string Prefix { get { return "0000"; } }

		public WDLExpressTracker(Config config)
		{
			_config = config;
		}

		public ExpressTrack Track(string waybillNumber)
		{
			var uri = $"{_config.WdlUri}&ntype=1010&cno=+{waybillNumber}";
			var response = EmmisTrackParser.GetAsync(uri);
			var dom = response.Result;

			if (string.IsNullOrEmpty(dom)) return default(ExpressTrack);
			return EmmisTrackParser.ParseDom(dom);
		}
	}
}