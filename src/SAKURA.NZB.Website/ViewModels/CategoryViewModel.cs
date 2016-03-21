using Microsoft.AspNet.Mvc.Rendering;
using SAKURA.NZB.Data;
using System.Collections.Generic;
using System.Linq;

namespace SAKURA.NZB.Website.ViewModels
{
	public class CategoryViewModel
    {		
		public List<SelectListItem> CategoryList { get; private set; }

		public CategoryViewModel(NZBContext context)
		{
			CategoryList = new List<SelectListItem>();

			foreach (var c in context.Categories.ToList())
			{
				CategoryList.Add(new SelectListItem
				{
					Text = c.Name,
					Value = c.Id.ToString()
				});
			}
		}
	}
}
