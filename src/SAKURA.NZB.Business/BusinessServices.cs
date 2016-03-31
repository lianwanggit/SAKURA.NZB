using Hangfire;
using Microsoft.Data.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SAKURA.NZB.Business.BootTasks;
using SAKURA.NZB.Business.Configuration;
using SAKURA.NZB.Business.ExchangeRate;
using SAKURA.NZB.Business.Hangfire;
using SAKURA.NZB.Business.Services;
using SAKURA.NZB.Data;

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

			services.AddTransient<Config>();

			// Add application services.
			services.AddTransient<IEmailSender, AuthMessageSender>();
			services.AddTransient<ISmsSender, AuthMessageSender>();

			services.AddTransient<IBackgroundJobClient>(_ => new BackgroundJobClient());
			services.AddTransient<HangfireHelper>();

			services.AddTransient<CurrencyLayerService>();

			services.AddTransient<IBootTask, AppConfigBootTask>();
			services.AddTransient<IBootTask, QueryExchangeRatesBootTask>();
		}
    }
}
