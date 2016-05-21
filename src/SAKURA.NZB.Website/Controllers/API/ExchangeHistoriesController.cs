﻿using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using SAKURA.NZB.Website.ViewModels;
using System;
using System.Globalization;
using System.Linq;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class ExchangeHistoriesController : Controller
	{
		private NZBContext _context;
		private Config _config;
		private readonly int _itemsPerPage;

		public ExchangeHistoriesController(NZBContext context, Config config)
		{
			_context = context;
			_itemsPerPage = config.GetExchangeHistoriesItemsPerPage();
			_config = config;
		}

		[HttpGet]
		public IActionResult Get()
		{
			return new ObjectResult(_context.ExchangeHistories.OrderByDescending(h => h.CreatedTime).ToList());
		}

		[HttpGet("search/{page:int}")]
		public IActionResult Search(int page)
		{
			var models = _context.ExchangeHistories.OrderByDescending(h => h.CreatedTime).Select(h => Map(h));
			return new ObjectResult(new ExchangeHistoriesPagingModel(models.ToList(), _itemsPerPage, page));
		}

		[HttpGet("{id:int}", Name = "GetExchangeHistory")]
		public IActionResult Get(int? id)
		{
			if (id == null)
				return HttpNotFound();

			var item = _context.ExchangeHistories.Single(m => m.Id == id);
			if (item == null)
				return HttpNotFound();

			return new ObjectResult(item);
		}

		[HttpPost]
		public IActionResult Post([FromBody]ExchangeHistory history)
		{
			if (history == null)
				return HttpBadRequest();

			if (!TryValidateModel(history))
				return HttpBadRequest();

			_context.ExchangeHistories.Add(history);
			_context.SaveChanges();

			return CreatedAtRoute("GetExchangeHistory", new { controller = "ExchangeHistories", id = history.Id }, history);
		}

		[HttpPut("{id:int}")]
		public IActionResult Put(int? id, [FromBody]ExchangeHistory history)
		{
			if (history == null || history.Id != id)
				return HttpBadRequest();

			if (!TryValidateModel(history))
				return HttpBadRequest();

			var item = _context.ExchangeHistories.FirstOrDefault(x => x.Id == id);
			if (item == null)
			{
				return HttpNotFound();
			}

			item.Cny = history.Cny;
			item.Nzd = history.Nzd;
			item.Rate = history.Rate;
			item.SponsorCharge = history.SponsorCharge;
			item.ReceiverCharge = history.ReceiverCharge;
			item.Agent = history.Agent;
			item.CreatedTime = history.CreatedTime;

			_context.ExchangeHistories.Update(item);
			_context.SaveChanges();

			return new NoContentResult();
		}

		[HttpDelete("{id}")]
		public void Delete(int id)
		{
			var item = _context.ExchangeHistories.FirstOrDefault(x => x.Id == id);
			if (item != null)
			{
				_context.ExchangeHistories.Remove(item);
				_context.SaveChanges();
			}
		}

		private ExchangeHistoryModel Map(ExchangeHistory item)
		{
			return new ExchangeHistoryModel
			{
				Id = item.Id,
				Cny = currencyToCny(item.Cny),
				Nzd = currencyToNzd(item.Nzd),
				SponsorCharge = currencyToCny(item.SponsorCharge),
				ReceiverCharge = currencyToNzd(item.ReceiverCharge),
				Agent = item.Agent,
				Rate = item.Rate.ToString(),
				CreatedTime = item.CreatedTime.ToString("d")
			};
		}

		private Func<float, string> currencyToNzd = (f) => { return f.ToString("C", CultureInfo.CreateSpecificCulture("en-NZ")); };
		private Func<float, string> currencyToCny = (f) =>
		{
			var ci = CultureInfo.CreateSpecificCulture("zh-CN");
			ci.NumberFormat.CurrencyNegativePattern = 1;
			return f.ToString("C", ci);
		};
	}
}