using System.Linq;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;

namespace SAKURA.NZB.Website.Controllers
{

	[Route("api/fake/[controller]")]
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
            return new JsonResult(_context.Customers.ToList());
        }

		[HttpGet("{id:int}")]
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

            return View(customer);
        }

        //// POST: Customers/Create
        //[HttpPost]
        //public IActionResult Post([FromBody]Customer customer)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        _context.Customers.Add(customer);
        //        _context.SaveChanges();
        //        return RedirectToAction("Index");
        //    }
        //    return View(customer);
        //}

        //// GET: Customers/Edit/5
        //public IActionResult Edit(int? id)
        //{
        //    if (id == null)
        //    {
        //        return HttpNotFound();
        //    }

        //    Customer customer = _context.Customers.Single(m => m.Id == id);
        //    if (customer == null)
        //    {
        //        return HttpNotFound();
        //    }
        //    return View(customer);
        //}

        //// POST: Customers/Edit/5
        //[HttpPost]
        //[ValidateAntiForgeryToken]
        //public IActionResult Edit(Customer customer)
        //{
        //    if (ModelState.IsValid)
        //    {
        //        _context.Update(customer);
        //        _context.SaveChanges();
        //        return RedirectToAction("Index");
        //    }
        //    return View(customer);
        //}

        //// GET: Customers/Delete/5
        //[ActionName("Delete")]
        //public IActionResult Delete(int? id)
        //{
        //    if (id == null)
        //    {
        //        return HttpNotFound();
        //    }

        //    Customer customer = _context.Customers.Single(m => m.Id == id);
        //    if (customer == null)
        //    {
        //        return HttpNotFound();
        //    }

        //    return View(customer);
        //}

        //// POST: Customers/Delete/5
        //[HttpPost, ActionName("Delete")]
        //[ValidateAntiForgeryToken]
        //public IActionResult DeleteConfirmed(int id)
        //{
        //    Customer customer = _context.Customers.Single(m => m.Id == id);
        //    _context.Customers.Remove(customer);
        //    _context.SaveChanges();
        //    return new HttpOkResult();
        //}
    }
}
