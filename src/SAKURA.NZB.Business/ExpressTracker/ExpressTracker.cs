using HtmlAgilityPack;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Business.Extensions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;

namespace SAKURA.NZB.Business.ExpressTracker
{
	public class ExpressTracker
    {
		private readonly Config _config;

		public ExpressTracker(Config config)
		{
			_config = config;
		}

		public TrackSummary Track(string waybillNumber)
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

			return null;
		}

		private TrackSummary Parse(string dom)
		{
			try
			{
				var summary = new TrackSummary();
				var html = new HtmlDocument();
				html.LoadHtml(dom);

				var root = html.DocumentNode;
				var trackListTable = root.Descendants()
					.Where(n => n.GetAttributeValue("class", "") == "trackListTable")
					.Single();

				var children = trackListTable.Descendants("table");
				var trackHead = children.First(n => n.GetAttributeValue("class", "") == "trackHead")
					.Descendants("span")
					.ToArray();
				var trackContent = children.First(n => n.GetAttributeValue("class", "") == "trackContentTable")
					.Descendants("tr")
					.Skip(1)
					.ToList();

				if (trackHead.Length == 5)
				{
					summary.WaybillNumber = trackHead[0].InnerText.After("：");
					summary.From = trackHead[1].InnerText.After("：");
					summary.Destination = trackHead[2].InnerText.After("：");
					summary.ItemCount = trackHead[3].InnerText.After("：");
					summary.Status = trackHead[4].InnerText.After("：");
				}

				summary.Details = new List<TrackRecord>();
				foreach (var item in trackContent)
				{
					var td = item.Descendants("td").ToArray();
					if (td.Length != 3) continue;

					summary.Details.Add(new TrackRecord
					{
						When = td[0].InnerText,
						Where = td[1].InnerText,
						Content = td[2].InnerText,
					});
				}

				return summary;
			}
			catch
			{
			}

			return null;
		}

		public static async Task<string> PostAsync(string uri, string data)
		{
			using (var client = new WebClient())
			{
				client.Headers[HttpRequestHeader.ContentType] = "application/x-www-form-urlencoded";

				try
				{
					var response = await client.UploadStringTaskAsync(uri, data);
					return response;
				}
				catch
				{
					throw new HttpRequestException($"Failed to post {data} to {uri}");
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

	public class TrackSummary
	{
		public string WaybillNumber { get; set; }
		public string From { get; set; }
		public string Destination { get; set; }
		public string ItemCount { get; set; }
		public string Status { get; set; }

		public List<TrackRecord> Details { get; set; }
	}

	public class TrackRecord
	{
		public string When { get; set; }
		public string Where { get; set; }
		public string Content { get; set; }
	}
}
