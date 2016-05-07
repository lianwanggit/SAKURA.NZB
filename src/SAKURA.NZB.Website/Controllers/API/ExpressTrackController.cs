using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;
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
				return HttpNotFound();

			var item = _context.ExpressTracks.Include(x => x.Details).FirstOrDefault(x => x.WaybillNumber == waybillNumber);
			if (item == null)
				return HttpNotFound();

			return new ObjectResult(item);
		}
	}
}
