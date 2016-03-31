﻿using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System.Linq;

namespace SAKURA.NZB.Business.Configuration
{
	public class Config
    {
		private readonly NZBContext _context;

		public Config(NZBContext context)
		{
			_context = context;
		}

		public string GetApiLayerAccessKey() => GetByKey(ConfigKeys.ApiLayerAccessKey);
		public float GetFixedRateHigh() => GetFloatByKey(ConfigKeys.FixedRateHigh);
		public float GetFixedRateLow() => GetFloatByKey(ConfigKeys.FixedRateLow);

		public void EnsureDefaults()
		{
			if (!Exists(ConfigKeys.FixedRateLow))
				Set(ConfigKeys.FixedRateLow, Common.ExchangeRateL.ToString());

			if (!Exists(ConfigKeys.FixedRateHigh))
				Set(ConfigKeys.FixedRateHigh, Common.ExchangeRateH.ToString());
		}

		private bool Exists(string key) =>  _context.Configs.Any(c => c.Key == key);		
		private string GetByKey(string key) => _context.Configs.FirstOrDefault(x => x.Key == key)?.Value;
		private float GetFloatByKey(string key) => float.Parse(_context.Configs.FirstOrDefault(x => x.Key == key)?.Value);

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
