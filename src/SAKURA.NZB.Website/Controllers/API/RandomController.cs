using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNet.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SAKURA.NZB.Website.Controllers
{
	[Route("api/[controller]")]
	public class RandomController : Controller
	{
		[HttpGet]
		public async Task<JsonResult> Get()
		{
			var rand = new Random();
			await Task.Delay(rand.Next(0, 50)); // Emulate tiny latency...
			return new JsonResult(new
			{
				numbers = Enumerable.Range(1, 10)
									.Select(i => i * rand.NextDouble())
									.ToArray()
			});
		}
	}
}
