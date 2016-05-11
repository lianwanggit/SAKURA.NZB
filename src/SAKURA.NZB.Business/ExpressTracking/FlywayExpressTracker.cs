using HtmlAgilityPack;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Business.Extensions;
using SAKURA.NZB.Domain;
using Serilog;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public class FlywayExpressTracker
	{
		private readonly Config _config;
		private readonly ILogger _logger = Log.ForContext<FlywayExpressTracker>();

		public FlywayExpressTracker(Config config)
		{
			_config = config;
		}

		public ExpressTrack Track(string waybillNumber)
		{
			var uri = _config.GetExpressTrackerUri();
			var code = _config.GetExpressTrackerCode();
			var data = $"w={code}&cmodel=&cno={waybillNumber}&ntype=0";

			var response = PostAsync(uri, data);
			var dom = response.Result;

			if (!string.IsNullOrEmpty(dom))
			{
				return Parse(dom);
			}

			return default(ExpressTrack);
		}

		private ExpressTrack Parse(string dom)
		{
			try
			{
				var summary = new ExpressTrack();
				var html = new HtmlDocument();
				html.LoadHtml(dom);

				var root = html.DocumentNode;
				var trackListTable = root.Descendants()
					.Where(n => n.GetAttributeValue("class", "") == "trackListTable")
					.SingleOrDefault();

				if (trackListTable == null)
				{
					_logger.Warning("Failed to parse the response");
					return default(ExpressTrack);
				}

				var children = trackListTable.Descendants("table");
				var trackHeadSpans = children.First(n => n.GetAttributeValue("class", "") == "trackHead")
					.Descendants("span")
					.ToArray();
				var trackContentTrs = children.First(n => n.GetAttributeValue("class", "") == "trackContentTable")
					.Descendants("tr")
					.Skip(1)
					.ToList();

				summary.WaybillNumber = trackHeadSpans.FirstOrDefault(s => s.GetAttributeValue("id", "") == "HeaderNum")?.InnerText.After("：").Trim();
				summary.From = trackHeadSpans.FirstOrDefault(s => s.GetAttributeValue("id", "") == "HeaderFrom")?.InnerText.After("：").Trim();
				summary.Destination = trackHeadSpans.FirstOrDefault(s => s.GetAttributeValue("id", "") == "HeaderDes")?.InnerText.After("：").Trim();
				summary.ItemCount = trackHeadSpans.FirstOrDefault(s => s.GetAttributeValue("id", "") == "HeaderItem")?.InnerText.After("：").Trim();
				summary.Status = trackHeadSpans.FirstOrDefault(s => s.GetAttributeValue("id", "") == "HeaderState")?.InnerText.After("：").Trim().Replace("！", "");
				summary.ArrivedTime = StringToDateTime(trackHeadSpans.FirstOrDefault(s => s.GetAttributeValue("id", "") == "HeaderADate")?.InnerText.After("："));
				summary.Recipient = trackHeadSpans.FirstOrDefault(s => s.GetAttributeValue("id", "") == "HeaderSign")?.InnerText.After("：").Trim();

				summary.Details = new List<ExpressTrackRecord>();
				foreach (var item in trackContentTrs)
				{
					var td = item.Descendants("td").ToArray();
					if (td.Length != 3) continue;

					summary.Details.Add(new ExpressTrackRecord
					{
						When = StringToDateTime(td[0].InnerText),
						Where = td[1].InnerText.Trim(),
						Content = td[2].InnerText.Trim(),
					});
				}

				return summary;
			}
			catch(Exception ex)
			{
				_logger.Error(ex, "Failed to parse the response");
				return default(ExpressTrack);
			}
		}

		private async Task<string> PostAsync(string uri, string data)
		{
			using (var client = new WebClient())
			{
				client.Headers[HttpRequestHeader.ContentType] = "application/x-www-form-urlencoded";

				try
				{
					var response = await client.UploadStringTaskAsync(uri, data);
					return response;
				}
				catch(Exception ex)
				{
					_logger.Error(ex, "Failed to post {0} to {1}", data, uri);
					return default(string);
				}
			}
		}

		private static Func<string, DateTime?> StringToDateTime = (str) => 
		{
			DateTime dt;
			if (DateTime.TryParse(str, out dt))
				return dt;

			return null;
		};
	}
}
