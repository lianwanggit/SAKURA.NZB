using Hangfire;
using MediatR;
using Microsoft.Data.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SAKURA.NZB.Business.BootTasks;
using SAKURA.NZB.Business.Cache;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Business.CurrencyTracking;
using SAKURA.NZB.Business.ExpressTracking;
using SAKURA.NZB.Business.Hangfire;
using SAKURA.NZB.Business.MediatR;
using SAKURA.NZB.Business.MediatR.MessageHandlers;
using SAKURA.NZB.Business.Services;
using SAKURA.NZB.Data;
using System;
using System.Linq;

namespace SAKURA.NZB.Business
{
	// This project can output the Class library as a NuGet Package.
	// To enable this option, right-click on the project and select the Properties menu item. In the Build tab select "Produce outputs on build".
	public class BusinessServices
    {
		private readonly IConfigurationRoot _config;

		public BusinessServices(IConfigurationRoot config)
        {
			_config = config;
		}

		public void ConfigureServices(IServiceCollection services)
		{
			services.AddEntityFramework()
				.AddSqlServer()
				.AddDbContext<NZBContext>(options => options.UseSqlServer(_config["Data:DefaultConnection:NZB"]))
				.AddDbContext<HangfireContext>(options => options.UseSqlServer(_config["Data:DefaultConnection:Hangfire"]));

			services.AddSingleton<IMediator>(serviceProvider =>
			{
				MultiInstanceFactory multiFactory = serviceType => AppDomain.CurrentDomain.GetAssemblies()
					.Where(a => a.FullName.StartsWith("SAKURA.NZB"))
					.SelectMany(s => s.GetTypes())
					.Where(serviceType.IsAssignableFrom)
					.Select(type =>
					{
						var scopeFactory = serviceProvider.GetService<IServiceScopeFactory>();
						var scope = scopeFactory.CreateScope();

						var service = scope.ServiceProvider.GetService(type);
						if (service == null)
							throw new InvalidOperationException($"The service provider doesn't know about '{type}'.");
						return service;
					});

				return new Mediator(serviceType => multiFactory(serviceType).First(), multiFactory);
			});

			services.AddTransient<Config>();

			// Add application services.
			services.AddTransient<IEmailSender, AuthMessageSender>();
			services.AddTransient<ISmsSender, AuthMessageSender>();

			services.AddTransient<IBackgroundJobClient>(_ => new BackgroundJobClient());
			services.AddTransient<HangfireHelper>();
			services.AddTransient<CurrencyLayerTracker>();

			services.AddTransient<IExpressTracker, FlywayExpressTracker>();
			services.AddTransient<IExpressTracker, EfspostTracker>();
			services.AddTransient<IExpressTracker, NZSTExpressTracker>();
			services.AddTransient<IExpressTracker, FtdLogisticsTracker>();
			services.AddSingleton<IExpressDistributor, ExpressDistributor>();

			services.AddTransient<MonthSaleUpdatedHandler>();
			services.AddTransient<ExchangeRateUpdatedHandler>();

			services.AddTransient<ICache, OrdersCache>();
			services.AddTransient<ICache, MonthSaleCache>();
			services.AddTransient<ICache, ExchangeRateCache>();
			services.AddTransient<ICacheRepository, CacheRepository>();

			services.AddScoped<CurrencyTrackBootTask>();
			services.AddScoped<ExpressTrackBootTask>();
			services.AddScoped<DbCleanupBootTask>();
			services.AddScoped<CacheInitializationBootTask>();

			services.AddScoped<IBootTask, AppConfigBootTask>();
			services.AddScoped<IBootTask, CurrencyTrackBootTask>();
			services.AddScoped<IBootTask, ExpressTrackBootTask>();
			services.AddScoped<IBootTask, DbCleanupBootTask>();
			services.AddScoped<IBootTask, CacheInitializationBootTask>();
		}


	}
}
