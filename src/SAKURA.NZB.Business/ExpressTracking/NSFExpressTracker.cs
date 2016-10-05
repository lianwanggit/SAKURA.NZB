using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Domain;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public class NSFExpressTracker : IExpressTracker
	{
		private readonly Config _config;
		public string Prefix { get { return "91"; } }

		public NSFExpressTracker(Config config)
		{
			_config = config;
		}

		public ExpressTrack Track(string waybillNumber)
		{
			var uri = _config.NsfUri;
			var data = $"w=newsf&cno={waybillNumber}";

			var response = EmmisTrackParser.PostFormAsync(uri, data);
			var dom = response.Result;

			if (string.IsNullOrEmpty(dom)) return default(ExpressTrack);
			return EmmisTrackParser.ParseDom(dom);
		}
	}
}
