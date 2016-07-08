using System;
using SAKURA.NZB.Domain;
using SAKURA.NZB.Business.Configuration;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public class ZTOExpressTracker : IExpressTracker
	{
		private readonly Config _config;

		public string Prefix { get { return "64"; } }

		public ZTOExpressTracker(Config config)
		{
			_config = config;
		}

		public ExpressTrack Track(string waybillNumber)
		{
			var uri = _config.ZtoUri;
			var data = $"cno={waybillNumber}";

			var response = EmmisTrackParser.PostFormAsync(uri, data);
			var dom = response.Result;

			if (string.IsNullOrEmpty(dom)) return default(ExpressTrack);
			return EmmisTrackParser.ParseDom(dom);
		}
	}
}
