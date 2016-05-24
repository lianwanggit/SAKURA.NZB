using MediatR;
using Microsoft.AspNet.Mvc;
using SAKURA.NZB.Business.Cache;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Business.MediatR.Messages;
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
		private readonly NZBContext _context;
		private readonly Config _config;
		private readonly IMediator _mediator;
		private readonly int _itemsPerPage;

		public ExchangeHistoriesController(NZBContext context, Config config, IMediator mediator)
		{
			_context = context;
			_itemsPerPage = config.GetExchangeHistoriesItemsPerPage();
			_config = config;
			_mediator = mediator;
		}

		[HttpGet]
		public IActionResult Get()
		{
			return new ObjectResult(_context.ExchangeHistories.OrderByDescending(h => h.CreatedTime).ToList());
		}

		[HttpGet("summary")]
		public IActionResult GetSummary()
		{
			var records = _context.ExchangeHistories.ToList();
			float totalNzd = 0;
			float totalCny = 0;

			foreach (var r in records)
			{
				totalNzd += r.Nzd;
				totalCny += r.Cny;
			}

			return new ObjectResult(new
			{
				TotalNzd = currencyToNzd(totalNzd),
				TotalCny = currencyToCny(totalCny),
				Rate = (float)Math.Round(ExchangeRateCache.Rate, 4)
			});
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

			history.Rate = (history.Cny) / (history.Nzd);
			history.CreatedTime = history.CreatedTime.ToLocalTime();

			_context.ExchangeHistories.Add(history);
			_context.SaveChanges();
			_mediator.Publish(new ExchangeRateUpdated());

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
			_mediator.Publish(new ExchangeRateUpdated());

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
				_mediator.Publish(new ExchangeRateUpdated());

				_mediator.Publish(new ExchangeRateUpdated());
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
}
