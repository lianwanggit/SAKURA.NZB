using SAKURA.NZB.Domain;
using SAKURA.NZB.Business.Configuration;
using HtmlAgilityPack;
using System.Linq;
using System;
using System.Collections.Generic;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public class EfspostTracker : IExpressTracker
	{
		private readonly Config _config;
		private ExpressTrack _expressTrack;

		public string Prefix { get { return "EF"; } }

		public EfspostTracker(Config config)
		{
			_config = config;
		}

		public ExpressTrack Track(string waybillNumber)
		{
			var uri = $"{_config.EfsPostUri}{waybillNumber}";
			_expressTrack = default(ExpressTrack);

			var response = EmmisTrackParser.PostFormAsync(uri, string.Empty, "charset=utf-8");
			var dom = response.Result;

			if (!string.IsNullOrEmpty(dom))
			{
				ParseEfs(dom, waybillNumber);
			}

			return _expressTrack;
		}

		private void ParseEfs(string dom, string waybillNumber)
		{
			var html = new HtmlDocument();
			html.LoadHtml(dom);

			var root = html.DocumentNode;
			var efsQuery = root.Descendants()
					.Where(n => n.GetAttributeValue("class", "").Contains("efsquery"))
					.SingleOrDefault();

			var table = efsQuery?.Element("table");
			if (table == null) return;

			_expressTrack = new ExpressTrack
			{
				Destination = "中国",
				From = "Auckland",
				ItemCount = "1",
				Status = "转运中",
				WaybillNumber = waybillNumber,
				Details = new List<ExpressTrackRecord>()
			};

			var rows = table.Descendants("tr");
			foreach (var row in rows)
			{
				var td = row.Elements("td").ToArray();
				if (td.Length != 3) continue;

				var record = new ExpressTrackRecord();

				var dt = DateTime.Now;
				if (!DateTime.TryParse(td[0].InnerText, out dt)) return;
				record.When = dt;
				record.Where = td[1].InnerText;
				record.Content = td[2].InnerText;

				_expressTrack.Details.Add(record);
			}
		}
	}
}