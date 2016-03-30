using System.Linq;
using Microsoft.AspNet.Mvc;
using Microsoft.Data.Entity;
using SAKURA.NZB.Data;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class ProductsController : Controller
	{
		private NZBContext _context;

		public ProductsController(NZBContext context)
		{
			_context = context;
		}

		[HttpGet]
		public IActionResult Get()
		{
			return new ObjectResult(_context.Products
				.Include(p => p.Category)
				.Include(p => p.Brand)
				.Include(p => p.Quotes).ThenInclude(q => q.Supplier)
				.Include(p => p.Images)
				.ToList());
		}

		//// GET: Products/Details/5
		//public IActionResult Details(int? id)
		//{
		//	if (id == null)
		//	{
		//		return HttpNotFound();
		//	}

		//	Product product = _context.Products.Single(m => m.Id == id);
		//	if (product == null)
		//	{
		//		return HttpNotFound();
		//	}

		//	return View(product);
		//}

		//// GET: Products/Create
		//public IActionResult Create()
		//{
		//	ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name");
		//	ViewData["SupplierId"] = new SelectList(_context.Suppliers, "Id", "Name");
		//	return View();
		//}

		//// POST: Products/Create
		//[HttpPost]
		//[ValidateAntiForgeryToken]
		//public IActionResult Create(Product product)
		//{
		//	if (ModelState.IsValid)
		//	{
		//		_context.Products.Add(product);
		//		_context.SaveChanges();
		//		return RedirectToAction("Index");
		//	}
		//	ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", product.CategoryId);
		//	return View(product);
		//}

		//// GET: Products/Edit/5
		//public IActionResult Edit(int? id)
		//{
		//	if (id == null)
		//	{
		//		return HttpNotFound();
		//	}

		//	Product product = _context.Products.Single(m => m.Id == id);
		//	if (product == null)
		//	{
		//		return HttpNotFound();
		//	}
		//	ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", product.CategoryId);
		//	return View(product);
		//}

		//// POST: Products/Edit/5
		//[HttpPost]
		//[ValidateAntiForgeryToken]
		//public IActionResult Edit(Product product)
		//{
		//	if (ModelState.IsValid)
		//	{
		//		_context.Update(product);
		//		_context.SaveChanges();
		//		return RedirectToAction("Index");
		//	}
		//	ViewData["CategoryId"] = new SelectList(_context.Categories, "Id", "Name", product.CategoryId);
		//	return View(product);
		//}

		//// GET: Products/Delete/5
		//[ActionName("Delete")]
		//public IActionResult Delete(int? id)
		//{
		//	if (id == null)
		//	{
		//		return HttpNotFound();
		//	}

		//	Product product = _context.Products.Single(m => m.Id == id);
		//	if (product == null)
		//	{
		//		return HttpNotFound();
		//	}

		//	return View(product);
		//}

		//// POST: Products/Delete/5
		//[HttpPost, ActionName("Delete")]
		//[ValidateAntiForgeryToken]
		//public IActionResult DeleteConfirmed(int id)
		//{
		//	Product product = _context.Products.Single(m => m.Id == id);
		//	_context.Products.Remove(product);
		//	_context.SaveChanges();
		//	return RedirectToAction("Index");
		//}
	}
}