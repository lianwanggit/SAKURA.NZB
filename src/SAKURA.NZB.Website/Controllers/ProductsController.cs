using System.Linq;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using Microsoft.Data.Entity;
using SAKURA.NZB.Website.ViewModels;

namespace SAKURA.NZB.Website.Controllers
{
	public class ProductsController : Controller
    {
        private NZBContext _context;		

		public ProductsController(NZBContext context)
        {
            _context = context;    
        }

        // GET: Products
        public IActionResult Index()
        {
            return View(_context.Products.Include(x => x.Category).ToList());
        }

        // GET: Products/Details/5
        public IActionResult Details(int? id)
        {
            if (id == null)
            {
                return HttpNotFound();
            }

            Product product = _context.Products.Include(x => x.Category)
				.Include(x => x.Images)
				.Single(m => m.Id == id);
            if (product == null)
            {
                return HttpNotFound();
            }

            return View(product);
        }

        // GET: Products/Create
        public IActionResult Create()
        {
			var vm = new CategoryViewModel(_context);
			ViewBag.CategoryList = vm.CategoryList; 

            return View();
        }

        // POST: Products/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Create(Product product)
        {
            if (ModelState.IsValid)
            {
                _context.Products.Add(product);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(product);
        }

        // GET: Products/Edit/5
        public IActionResult Edit(int? id)
        {
            if (id == null)
            {
                return HttpNotFound();
            }

            Product product = _context.Products.Single(m => m.Id == id);
            if (product == null)
            {
                return HttpNotFound();
            }
            return View(product);
        }

        // POST: Products/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public IActionResult Edit(Product product)
        {
            if (ModelState.IsValid)
            {
                _context.Update(product);
                _context.SaveChanges();
                return RedirectToAction("Index");
            }
            return View(product);
        }

        // GET: Products/Delete/5
        [ActionName("Delete")]
        public IActionResult Delete(int? id)
        {
            if (id == null)
            {
                return HttpNotFound();
            }

            Product product = _context.Products.Single(m => m.Id == id);
            if (product == null)
            {
                return HttpNotFound();
            }

            return View(product);
        }

        // POST: Products/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public IActionResult DeleteConfirmed(int id)
        {
            Product product = _context.Products.Single(m => m.Id == id);
            _context.Products.Remove(product);
            _context.SaveChanges();
            return RedirectToAction("Index");
        }
    }
}
