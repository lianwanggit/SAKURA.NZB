﻿using MediatR;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Business.Cache;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Data;
using SAKURA.NZB.Domain;
using SAKURA.NZB.Website.ViewModels;
using System;
using System.Globalization;
using System.Linq;
using System.Web.Http;

namespace SAKURA.NZB.Website.Controllers.API
{
	[Route("api/[controller]")]
	public class ExchangeHistoriesController : Controller
	{
		private readonly NZBContext _context;
		private readonly Config _config;
		private readonly IMediator _mediator;
		private readonly ICacheRepository _cacheRepository;
		private readonly int _itemsPerPage;

		public ExchangeHistoriesController(NZBContext context, Config config, IMediator mediator, ICacheRepository cacheRepository)
		{
			_context = context;
			_itemsPerPage = config.ExchangeHistoriesItemsPerPage;
			_config = config;
			_mediator = mediator;
			_cacheRepository = cacheRepository;
		}

		[HttpGet]
		public IActionResult Get()
		{
			return new ObjectResult(_context.ExchangeHistories.OrderByDescending(h => h.CreatedTime).ToList());
		}

		[HttpGet("get-years")]
		public IActionResult GetYears()
		{
			var records = _context.ExchangeHistories.ToList();
			return new ObjectResult(records.GroupBy(x => x.CreatedTime.Year).Select(x => x.Key));
		}

		[HttpGet("summary/{year}")]
		public IActionResult GetSummary(int year)
		{
			Func<ExchangeHistory, bool> predicate = (p) => true;
			if (year > 0)
			{
				predicate = (p) => p.CreatedTime.Year == year;
			}

			var records = _context.ExchangeHistories.Where(x => predicate(x)).ToList();
			float totalNzd = 0;
			float totalCny = 0;

			foreach (var r in records)
			{
				totalNzd += r.Nzd;
				totalCny += r.Cny;
			}

			var rate = totalNzd > 0 ? totalCny / totalNzd : ExchangeRateCache.CounterRate;

			return new ObjectResult(new
			{
				TotalNzd = currencyToNzd(totalNzd),
				TotalCny = currencyToCny(totalCny),


				Rate = (float)Math.Round(rate, 4)
			});
		}

		[HttpGet("search")]
		public IActionResult Search([FromUri]ExchangeHistorySearchOptions options)
		{
			Func<ExchangeHistory, bool> predicate = (p) => true;
			if (options.year.HasValue)
			{
				predicate = (p) => p.CreatedTime.Year == options.year;
			}

			var records = _context.ExchangeHistories.Where(x => predicate(x)).ToList();
			var models = records.OrderByDescending(h => h.CreatedTime).Select(h => Map(h));

			return new ObjectResult(new ExchangeHistoriesPagingModel(models.ToList(), _itemsPerPage, options.page.GetValueOrDefault()));
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

			history.Rate = (history.Cny) / (history.Nzd);
			history.CreatedTime = history.CreatedTime.ToLocalTime();

			_context.ExchangeHistories.Add(history);
			_context.SaveChanges();
			_cacheRepository.UpdateAll();

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
			item.Rate = (history.Cny) / (history.Nzd);
			item.SponsorCharge = history.SponsorCharge;
			item.ReceiverCharge = history.ReceiverCharge;
			item.Agent = history.Agent;
			item.CreatedTime = history.CreatedTime.ToLocalTime();

			_context.ExchangeHistories.Update(item);
			_context.SaveChanges();
			_cacheRepository.UpdateAll();

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
				_cacheRepository.UpdateAll();
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
				Rate = Math.Round(item.Rate, 4).ToString(),
				CreatedTime = item.CreatedTime.ToString("dd/MM/yyyy")
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

	public class ExchangeHistorySearchOptions
	{
		public int? page { get; set; }
		public int? year { get; set; }
	}
}
