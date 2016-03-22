using Microsoft.AspNet.Mvc;

// For more information on enabling MVC for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SAKURA.NZB.Website.Controllers
{
	public class PartialController : Controller
	{
		public IActionResult Message() => PartialView();

		public IActionResult Numbers() => PartialView();

		public IActionResult Customers() => PartialView();
	}
}
