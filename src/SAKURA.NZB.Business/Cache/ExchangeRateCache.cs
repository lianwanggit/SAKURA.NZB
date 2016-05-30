using MediatR;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Business.MediatR.Messages;
using SAKURA.NZB.Data;
using System;
using System.Linq;

namespace SAKURA.NZB.Business.Cache
{
	public class ExchangeRateCache : ICache
	{
		private readonly NZBContext _context;
		private readonly Config _config;
		private readonly IMediator _mediator;

		public static float Rate { get; private set; }
		public int Order => 1;

		public ExchangeRateCache(NZBContext context, Config config, IMediator mediator)
		{
			_context = context;
			_config = config;
			_mediator = mediator;
		}

		public void Update()
		{
			float totalNzd = 0;
			float totalCny = 0;
			float averageRate = _config.FixedRateLow;

			var records = _context.ExchangeHistories.ToList();			
			foreach (var r in records)
			{
				totalNzd += r.Nzd;
				totalCny += r.Cny;
			}

			if (totalNzd > 0)
			{
				averageRate = (float)Math.Round(totalCny / totalNzd, 4);
			}

			Rate = averageRate;
		}
	}
}
