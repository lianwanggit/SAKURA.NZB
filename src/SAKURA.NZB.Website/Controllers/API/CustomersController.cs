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
		// GET: Customers
		public IActionResult Get()
        {
            return new ObjectResult(_context.Customers.ToList());
        }

		[HttpGet("{id:int}", Name = "GetCustomer")]
		// GET: Customers/Details/5
		public IActionResult Get(int? id)
        {
            if (id == null)
            {
                return HttpNotFound();
            }

            Customer customer = _context.Customers.Single(m => m.Id == id);
            if (customer == null)
            {
                return HttpNotFound();
            }

            return new ObjectResult(customer);
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

		[HttpPut("{id}")]
		public IActionResult Put(int id, [FromBody]Customer customer)
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

			_context.Customers.Update(customer);
			_context.SaveChanges();

			return new NoContentResult();
		}

		// DELETE api/values/5
		[HttpDelete("{id}")]
		public void Delete(int id)
		{
		}
	}
}
