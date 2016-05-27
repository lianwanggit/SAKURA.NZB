﻿using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Domain;
using Serilog;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public class FlywayExpressTracker : IExpressTracker
	{
		private readonly Config _config;
		private readonly ILogger _logger = Log.ForContext<FlywayExpressTracker>();

		public string Prefix { get { return "1000"; } }

		public FlywayExpressTracker(Config config)
		{
			_config = config;
		}

		public ExpressTrack Track(string waybillNumber)
		{
			var uri = _config.GetFlywayUri();
			var code = _config.GetFlywayCode();
			var data = $"w={code}&cmodel=&cno={waybillNumber}&ntype=0";

			var response = EmmisTrackParser.PostFormAsync(uri, data);
			var dom = response.Result;

			if (string.IsNullOrEmpty(dom)) return default(ExpressTrack);
			return EmmisTrackParser.ParseDom(dom);
		}
	}
}
