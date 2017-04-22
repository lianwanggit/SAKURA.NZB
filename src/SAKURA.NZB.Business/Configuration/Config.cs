using SAKURA.NZB.Data;
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

		public string ApiLayerAccessKey
		{
			get { return GetByKey(ConfigKeys.ApiLayerAccessKey); }
			set { Set(ConfigKeys.ApiLayerAccessKey, value); }
		}

		public float FixedRateHigh
		{
			get { return GetFloatByKey(ConfigKeys.FixedRateHigh); }
			set { Set(ConfigKeys.FixedRateHigh, value.ToString()); }
		}

		public float FixedRateLow
		{
			get { return GetFloatByKey(ConfigKeys.FixedRateLow); }
			set { Set(ConfigKeys.FixedRateLow, value.ToString()); }
		}

		public float CurrentRate
		{
			get
			{
				var rate = _context.ExchangeRates.OrderByDescending(e => e.ModifiedTime).FirstOrDefault();
				return rate?.NZDCNY ?? FixedRateLow;
			}
		}

		public float FreightRate
		{
			get { return GetFloatByKey(ConfigKeys.FreightRate); }
			set { Set(ConfigKeys.FreightRate, value.ToString()); }
		}

		public string SenderName
		{
			get { return GetByKey(ConfigKeys.SenderName); }
			set { Set(ConfigKeys.SenderName, value); }
		}

		public string SenderPhone
		{
			get { return GetByKey(ConfigKeys.SenderPhone); }
			set { Set(ConfigKeys.SenderPhone, value); }
		}

		public string FlywayUri
		{
			get { return GetByKey(ConfigKeys.ExpressTrackerUri_Flyway); }
			set { Set(ConfigKeys.ExpressTrackerUri_Flyway, value); }
		}

		public string FlywayCode
		{
			get { return GetByKey(ConfigKeys.ExpressTrackerCode_Flyway); }
			set { Set(ConfigKeys.ExpressTrackerCode_Flyway, value); }
		}

		public string EfsPostUri
		{
			get { return GetByKey(ConfigKeys.ExpressTrackerUri_EfsPost); }
			set { Set(ConfigKeys.ExpressTrackerUri_EfsPost, value); }
		}

		public string ZtoUri
		{
			get { return GetByKey(ConfigKeys.ExpressTrackerUri_Zto); }
			set { Set(ConfigKeys.ExpressTrackerUri_Zto, value); }
		}

		public string NzstUri
		{
			get { return GetByKey(ConfigKeys.ExpressTrackerUri_Nzst); }
			set { Set(ConfigKeys.ExpressTrackerUri_Nzst, value); }
		}

		public string NzstCode
		{
			get { return GetByKey(ConfigKeys.ExpressTrackerCode_Nzst); }
			set { Set(ConfigKeys.ExpressTrackerCode_Nzst, value); }
		}

		public string FtdUri
		{
			get { return GetByKey(ConfigKeys.ExpressTrackerUri_Ftd); }
			set { Set(ConfigKeys.ExpressTrackerUri_Ftd, value); }
		}

		public string NsfUri
		{
			get { return GetByKey(ConfigKeys.ExpressTrackerUri_Nsf); }
			set { Set(ConfigKeys.ExpressTrackerUri_Nsf, value); }
		}

		public string WdlUri
		{
			get { return GetByKey(ConfigKeys.ExpressTrackerUri_Wdl); }
			set { Set(ConfigKeys.ExpressTrackerUri_Wdl, value); }
		}

		public int ProductItemsPerPage
		{
			get { return GetIntByKey(ConfigKeys.ProductItemsPerPage); }
			set { Set(ConfigKeys.ProductItemsPerPage, value.ToString()); }

		}

		public int OrdersItemsPerPage
		{
			get { return GetIntByKey(ConfigKeys.OrdersItemsPerPage); }
			set { Set(ConfigKeys.OrdersItemsPerPage, value.ToString()); }
		}

		public int ExchangeHistoriesItemsPerPage
		{
			get { return GetIntByKey(ConfigKeys.ExchangeHistoriesItemsPerPage); }
			set { Set(ConfigKeys.ExchangeHistoriesItemsPerPage, value.ToString()); }
		}

		public void EnsureDefaults()
		{
			if (!Exists(ConfigKeys.ApiLayerAccessKey))
				Set(ConfigKeys.ApiLayerAccessKey, "");

			if (!Exists(ConfigKeys.FixedRateLow))
				Set(ConfigKeys.FixedRateLow, Common.ExchangeRateL.ToString());

			if (!Exists(ConfigKeys.FixedRateHigh))
				Set(ConfigKeys.FixedRateHigh, Common.ExchangeRateH.ToString());

			if (!Exists(ConfigKeys.FreightRate))
				Set(ConfigKeys.FreightRate, Common.FreightRate.ToString());

			if (!Exists(ConfigKeys.SenderName))
				Set(ConfigKeys.SenderName, "");

			if (!Exists(ConfigKeys.SenderPhone))
				Set(ConfigKeys.SenderPhone, "");

			if (!Exists(ConfigKeys.ProductItemsPerPage))
				Set(ConfigKeys.ProductItemsPerPage, "30");

			if (!Exists(ConfigKeys.OrdersItemsPerPage))
				Set(ConfigKeys.OrdersItemsPerPage, "15");

			if (!Exists(ConfigKeys.ExchangeHistoriesItemsPerPage))
				Set(ConfigKeys.ExchangeHistoriesItemsPerPage, "10");

			Save();
		}

		public void Save()
		{
			_context.SaveChanges();
		}

		private bool Exists(string key) => _context.Configs.Any(c => c.Key == key);
		private string GetByKey(string key) => _context.Configs.FirstOrDefault(x => x.Key == key)?.Value;
		private float GetFloatByKey(string key) => float.Parse(_context.Configs.FirstOrDefault(x => x.Key == key)?.Value);
		private int GetIntByKey(string key) => int.Parse(_context.Configs.FirstOrDefault(x => x.Key == key)?.Value);

		private void Set(string key, string value)
		{
			var setting = EnsureSetting(key);
			setting.Value = value;
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
