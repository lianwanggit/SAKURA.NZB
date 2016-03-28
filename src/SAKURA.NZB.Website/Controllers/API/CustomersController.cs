using System.Linq;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using SAKURA.NZB.Core.Extensions;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class CustomersController : Controller
	{
		private NZBContext _context;

		public CustomersController(NZBContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult Get()
		{
			return new ObjectResult(_context.Customers.ToList());
		}

		[HttpGet("{id:int}", Name = "GetCustomer")]
		public IActionResult Get(int? id)
		{
			if (id == null)
				return HttpNotFound();

			var item = _context.Customers.Single(m => m.Id == id);
			if (item == null)
				return HttpNotFound();

			return new ObjectResult(item);
		}

		[HttpPost]
		public IActionResult Post([FromBody]Customer customer)
		{
			if (customer == null)
				return HttpBadRequest();

			customer.NamePinYin = customer.FullName.ToSlug();
			if (!TryValidateModel(customer))
				return HttpBadRequest();

			_context.Customers.Add(customer);
			_context.SaveChanges();

			return CreatedAtRoute("GetCustomer", new { controller = "Customers", id = customer.Id }, customer);
		}

		[HttpPut("{id:int}")]
		public IActionResult Put(int? id, [FromBody]Customer customer)
		{
			if (customer == null || customer.Id != id)
				return HttpBadRequest();

			customer.NamePinYin = customer.FullName.ToSlug();
			if (!TryValidateModel(customer))
				return HttpBadRequest();

			var item = _context.Customers.FirstOrDefault(x => x.Id == id);
			if (item == null)
			{
				return HttpNotFound();
			}

			item.FullName = customer.FullName;
			item.NamePinYin = customer.NamePinYin;
			item.Address = customer.Address;
			item.Address1 = customer.Address1;
			item.Phone1 = customer.Phone1;
			item.Phone2 = customer.Phone2;
			item.Email = customer.Email;
			item.IsIdentityUploaded = customer.IsIdentityUploaded;
			item.Level = customer.Level;
			item.Description = customer.Description;

			_context.Customers.Update(item);
			_context.SaveChanges();

			return new NoContentResult();
		}

		[HttpDelete("{id}")]
		public void Delete(int id)
		{
			var item = _context.Customers.FirstOrDefault(x => x.Id == id);
			if (item != null)
			{
				_context.Customers.Remove(item);
				_context.SaveChanges();
			}
		}
	}
}
