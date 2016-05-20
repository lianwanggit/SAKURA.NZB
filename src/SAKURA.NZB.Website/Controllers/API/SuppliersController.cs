using System.Linq;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;

// For more information on enabling Web API for empty projects, visit http://go.microsoft.com/fwlink/?LinkID=397860

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
    public class SuppliersController : Controller
    {
		private NZBContext _context;

		public SuppliersController(NZBContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult Get()
		{
			return new ObjectResult(_context.Suppliers.ToList());
		}

		[HttpGet("{id:int}", Name = "GetSupplier")]
		public IActionResult Get(int? id)
		{
			if (id == null)
				return HttpNotFound();

			var item = _context.Suppliers.Single(m => m.Id == id);
			if (item == null)
				return HttpNotFound();

			return new ObjectResult(item);
		}

		[HttpPost]
		public IActionResult Post([FromBody]Supplier value)
		{
			if (value == null)
				return HttpBadRequest();

			if (!ModelState.IsValid)
				return HttpBadRequest();

			_context.Suppliers.Add(value);
			_context.SaveChanges();

			return CreatedAtRoute("GetSupplier", new { controller = "Suppliers", id = value.Id }, value);
		}

		[HttpPut("{id:int}")]
		public IActionResult Put(int? id, [FromBody]Supplier value)
		{
			if (value == null || value.Id != id)
				return HttpBadRequest();

			if (!ModelState.IsValid)
				return HttpBadRequest();

			var item = _context.Suppliers.FirstOrDefault(x => x.Id == id);
			if (item == null)
				return HttpNotFound();

			item.Name = value.Name;

			_context.Suppliers.Update(item);
			_context.SaveChanges();

			return new NoContentResult();
		}

		[HttpDelete("{id}")]
		public void Delete(int id)
		{
			var item = _context.Suppliers.FirstOrDefault(x => x.Id == id);
			if (item != null)
			{
				_context.Suppliers.Remove(item);
				_context.SaveChanges();
			}
		}
	}
}
