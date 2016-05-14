using System.Linq;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using System;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
    public class BrandsController : Controller
    {
		private NZBContext _context;

		public BrandsController(NZBContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult Get()
		{
			var brands = from b in _context.Brands
						 join p in _context.Products on b.Id equals p.BrandId into joined
						 orderby b.Name
						 select new {Id = b.Id, Name = b.Name, Count = joined.Count() };

			return new ObjectResult(brands);
		}

		[HttpGet("{id:int}", Name = "GetBrand")]
		public IActionResult Get(int? id)
		{
			if (id == null)
				return HttpNotFound();			

			var item = _context.Brands.Single(m => m.Id == id);
			if (item == null)			
				return HttpNotFound();		

			return new ObjectResult(item);
		}

		[HttpPost]
		public IActionResult Post([FromBody]Brand value)
		{
			if (value == null)
				return HttpBadRequest();

			if (!ModelState.IsValid)
				return HttpBadRequest();

			if (_context.Brands.Any(b => b.Name == value.Name))
				return HttpBadRequest("name taken");

			_context.Brands.Add(value);
			_context.SaveChanges();

			return CreatedAtRoute("GetBrand", new { controller = "Brands", id = value.Id }, value);
		}

		[HttpPut("{id:int}")]
		public IActionResult Put(int? id, [FromBody]Brand value)
		{
			if (value == null || value.Id != id)
				return HttpBadRequest();

			if (!ModelState.IsValid)
				return HttpBadRequest();

			if (_context.Brands.Any(b => b.Name == value.Name && b.Id != value.Id))
				return HttpBadRequest("name taken");

			var item = _context.Brands.FirstOrDefault(x => x.Id == id);
			if (item == null)
				return HttpNotFound();

			item.Name = value.Name;

			_context.Brands.Update(item);
			_context.SaveChanges();

			return new NoContentResult();
		}

		[HttpDelete("{id}")]
		public void Delete(int id)
		{
			var item = _context.Brands.FirstOrDefault(x => x.Id == id);
			if (item != null)
			{
				_context.Brands.Remove(item);
				_context.SaveChanges();
			}
		}
	}
}
