using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System.Linq;

namespace SAKURA.NZB.Core.Configuration
{
	public class Config
    {
		private readonly NZBContext _context;

		public Config(NZBContext context)
		{
			_context = context;
		}

		public string GetApiLayerAccessKey() => GetByKey(ConfigKeys.ApiLayerAccessKey);

		public void EnsureDefaults()
		{
			if (!Exists(ConfigKeys.ExchangeRateL))
				Set(ConfigKeys.ExchangeRateL, Common.ExchangeRateL.ToString());

			if (!Exists(ConfigKeys.ExchangeRateH))
				Set(ConfigKeys.ExchangeRateH, Common.ExchangeRateH.ToString());
		}

		private bool Exists(string key) =>  _context.Configs.Any(c => c.Key == key);		
		private string GetByKey(string key) => _context.Configs.FirstOrDefault(x => x.Key == key)?.Value;	

		private void Set(string key, string value)
		{
			var setting = EnsureSetting(key);
			setting.Value = value;

			_context.SaveChanges();
		}

		private AppConfig EnsureSetting(string key)
		{
			var setting = _context.Configs.FirstOrDefault(c => c.Key == key);
			if (setting == null)
			{
				setting = new AppConfig { Key = key };
				_context.Configs.Add(setting);
			}

			return setting;
		}
	}
}
