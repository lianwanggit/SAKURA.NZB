using System;
using SAKURA.NZB.Domain;
using HtmlAgilityPack;
using System.Linq;
using System.Collections.Generic;
using SAKURA.NZB.Business.Configuration;

namespace SAKURA.NZB.Business.ExpressTracking
{
	public class FtdLogisticsTracker : IExpressTracker
	{
		private readonly Config _config;
		private ExpressTrack _expressTrack;
		private string _emsSnUrl;
		public string Prefix { get { return "NZ"; } }

		public FtdLogisticsTracker(Config config)
		{
			_config = config;
		}

		public ExpressTrack Track(string waybillNumber)
		{
			var uri = _config.FtdUri;
			var data = $"codes={waybillNumber}&x=41&y=24";
			var response = EmmisTrackParser.PostFormAsync(uri, data, "charset=utf-8");
			var dom = response.Result;

			if (string.IsNullOrEmpty(dom)) return default(ExpressTrack);

			_emsSnUrl = null;
			_expressTrack = new ExpressTrack
			{
				Destination = "中国",
				From = "Auckland",
				ItemCount = "1",
				Status = "转运中",
				WaybillNumber = waybillNumber,
				Details = new List<ExpressTrackRecord>()
			};

			ParseFtd(dom);

			if (!string.IsNullOrEmpty(_emsSnUrl))
			{
				var address = string.Concat("http://", new Uri(uri).Host + _emsSnUrl);
				var emsResponse = EmmisTrackParser.GetAsync(address);
				var emsResult = emsResponse.Result;

				ParseEms(emsResult);
			}

			return _expressTrack;
		}

		private void ParseFtd(string dom)
		{
			if (string.IsNullOrEmpty(dom)) return;

			var html = new HtmlDocument();
			html.LoadHtml(dom);

			var root = html.DocumentNode;
			var qrBox = root.Descendants()
					.Where(n => n.GetAttributeValue("class", "") == "qrBox")
					.SingleOrDefault();

			var firstChild = qrBox.Element("div");
			if (!firstChild.GetAttributeValue("class", "").Contains("qRst")) return;

			var lines = firstChild.Descendants("p").Skip(1).Select(p => p.InnerText);
			foreach (var line in lines)
			{
				var record = new ExpressTrackRecord();
				var chunk = new Chunk(line);

				if (chunk.When.HasValue)
				{
					record.When = chunk.When;
					record.Where = chunk.Where;
					record.Content = chunk.What;

					_expressTrack.Details.Add(record);
				}
			}

			var ems = firstChild.Descendants("script").FirstOrDefault();
			if (ems != null)
			{
				_emsSnUrl = ems.GetAttributeValue("src", "");
			}
		}

		private void ParseEms(string dom)
		{
			if (string.IsNullOrEmpty(dom)) return;

			dom = dom.Replace("document.write('", "");
			var html = new HtmlDocument();
			html.LoadHtml(dom);

			var lines = html.DocumentNode.Descendants("p").Select(p => p.InnerText);
			foreach (var line in lines)
			{
				var record = new ExpressTrackRecord();
				var chunk = new Chunk(line);

				if (chunk.When.HasValue)
				{
					record.When = chunk.When;
					record.Where = chunk.Where;
					record.Content = chunk.What;
										
					_expressTrack.Details.Add(record);
				}
			}

			ParseSignOff(_expressTrack.Details.LastOrDefault());
		}

		private void ParseSignOff(ExpressTrackRecord record)
		{
			if (record == null) return;

			var label = "签收人";
			var index = record.Content.IndexOf(label);
			if (index > -1)
			{
				_expressTrack.Status = "送达";
				_expressTrack.ArrivedTime = record.When;
				_expressTrack.Recipient = record.Content.Substring(index + label.Length).Replace("：", "");
			}
		}
	}

	internal class Chunk
	{
		public DateTime? When { get; private set; }
		public string Where { get; private set; }
		public string What { get; private set; }

		internal Chunk(string text)
		{
			Parse(text);
		}

		private void Parse(string text)
		{
			// 2016-05-11 【 新西兰-奥克兰 】 货物进入分拣中心。Arrival at Sorting Center
			// 2016-05-12 货物离开分拣中心。 Despatching from Sorting Center
			// 2016-05-23 21:26:49 : 【郴州市】 离开郴州市 发往长沙市

			var array = text.Split(new char[] { ' ' }, StringSplitOptions.RemoveEmptyEntries);
			if (array.Length < 3) return;

			var datimeText = array[0];
			var datetimeIndex = 0;
			if (IsTimeText(array[1]))
			{
				datetimeIndex = 1;
				datimeText = string.Concat(datimeText, " ", array[1]);
			}

			DateTime dt;
			if (!DateTime.TryParse(datimeText, out dt)) return;
			When = dt;

			var leftBracketsIndex = Array.FindIndex(array, x => x == "【");
			var rightBracketsIndex = Array.FindIndex(array, x => x == "】");
			if (leftBracketsIndex > -1 && rightBracketsIndex > -1)
			{
				var trimedArray = array.Skip(leftBracketsIndex + 1);
				Where = string.Join(" ", trimedArray.Take(rightBracketsIndex - leftBracketsIndex - 1));
			}
			else
			{
				var whereBlockIndex = Array.FindIndex(array, x => x.Contains("【"));
				if (whereBlockIndex > -1)
				{
					Where = array[whereBlockIndex].Replace("【", "");
					Where = Where.Replace("】", "");
					rightBracketsIndex = whereBlockIndex;
				}
			}

			What = rightBracketsIndex < 0 ? string.Join(" ", array.Skip(datetimeIndex + 1)) : string.Join(" ", array.Skip(rightBracketsIndex + 1));
		}

		private static Func<string, bool> IsTimeText = (str) => { return str.Count(c => c == ':') == 2; };
	}
}
