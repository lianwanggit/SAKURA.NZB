using System;
using SAKURA.NZB.Domain;
using SAKURA.NZB.Business.Configuration;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public class NZSTExpressTracker : IExpressTracker
	{
		private readonly Config _config;
		public string Prefix { get { return "ST"; } }

		public NZSTExpressTracker(Config config)
		{
			_config = config;
		}

		public ExpressTrack Track(string waybillNumber)
		{
			var uri = _config.GetNzstUri();
			var code = _config.GetNzstCode();
			var data = $"w={code}&cmodel=&cno={waybillNumber}&ntype=0";

			var response = EmmisTrackParser.PostFormAsync(uri, data);
			var dom = response.Result;

			if (string.IsNullOrEmpty(dom)) return default(ExpressTrack);
			return EmmisTrackParser.ParseDom(dom);
		}
	}
}
