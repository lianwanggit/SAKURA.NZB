using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
using SAKURA.NZB.Website.ViewModels;
using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class ExpressTrackController : Controller
	{
		private NZBContext _context;

		public ExpressTrackController(NZBContext context)
		{
			_context = context;
		}

		[HttpGet("{waybillNumber}")]
		public IActionResult Get(string waybillNumber)
		{
			if (waybillNumber == null)
				return new BadRequestResult();

			var item = _context.ExpressTracks.Include(x => x.Details).FirstOrDefault(x => x.WaybillNumber == waybillNumber);
			if (item == null)
				return HttpNotFound();

			return new ObjectResult(item);
		}

		[HttpPost, Route("batchwaybillNumbers")]
		public IActionResult Get([FromBody]BatchWaybillNumberModel model)
		{
			if (model == null || model.WaybillNumbers == null)
				return new BadRequestResult();

			var result = new BatchExpressionInfoModel { ExpressInfoList = new List<LatestExpressInfoModel>() };
			var expressTracks = _context.ExpressTracks
										.Include(x => x.Details)
										.Where(x => model.WaybillNumbers.Contains(x.WaybillNumber)).ToList();

			foreach (var w in model.WaybillNumbers)
			{
				var latestExpressInfo = string.Empty;
				var track = expressTracks.FirstOrDefault(x => x.WaybillNumber == w);

				if (track != null)
				{
					var lastInfo = track.Details.OrderByDescending(d => d.When).FirstOrDefault();
					if (string.IsNullOrWhiteSpace(lastInfo?.Where))
						latestExpressInfo = $"{lastInfo?.When} {lastInfo?.Content}";
					else
						latestExpressInfo = $"{lastInfo?.When} [{lastInfo?.Where}] {lastInfo?.Content}";
				}

				result.ExpressInfoList.Add(new LatestExpressInfoModel { WaybillNumber = w, ExpressInfo = latestExpressInfo });
			}

			return new ObjectResult(result);
		}
	}
}
