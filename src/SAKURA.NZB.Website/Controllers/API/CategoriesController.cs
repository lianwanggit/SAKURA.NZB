using System.Linq;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
    public class CategoriesController : Controller
    {
		private NZBContext _context;

		public CategoriesController(NZBContext context)
		{
			_context = context;
		}

		[HttpGet]
        public IActionResult Get()
        {
			return new ObjectResult(_context.Categories.ToList());
        }

        [HttpGet("{id:int}", Name = "GetCategory")]
        public IActionResult Get(int? id)
        {
			if (id == null)
				return HttpNotFound();

			var item = _context.Categories.Single(m => m.Id == id);
			if (item == null)
				return HttpNotFound();			

			return new ObjectResult(item);
		}

        [HttpPost]
        public IActionResult Post([FromBody]Category value)
        {
			if (value == null)
				return HttpBadRequest();

			if (!ModelState.IsValid)
				return HttpBadRequest();

			_context.Categories.Add(value);
			_context.SaveChanges();

			return CreatedAtRoute("GetCategory", new { controller = "Categories", id = value.Id }, value);
		}

        [HttpPut("{id:int}")]
        public IActionResult Put(int? id, [FromBody]Category value)
        {
			if (value == null || value.Id != id)
				return HttpBadRequest();

			if (!ModelState.IsValid)
				return HttpBadRequest();

			var item = _context.Categories.FirstOrDefault(x => x.Id == id);
			if (item == null)
				return HttpNotFound();

			item.Name = value.Name;

			_context.Categories.Update(item);
			_context.SaveChanges();

			return new NoContentResult();
		}

        [HttpDelete("{id}")]
        public void Delete(int id)
        {
			var item = _context.Categories.FirstOrDefault(x => x.Id == id);
			if (item != null)
			{
				_context.Categories.Remove(item);
				_context.SaveChanges();
			}
		}
    }
}
