using Hangfire;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc.Formatters;
using Microsoft.Data.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using SAKURA.NZB.Business;
using SAKURA.NZB.Business.BootTasks;
using SAKURA.NZB.Data;
using Serilog;
using System.Linq;

namespace SAKURA.NZB.Website
{
	public class Startup
	{
		public Startup(IHostingEnvironment env)
		{
			// Set up configuration sources.
			Log.Logger = new LoggerConfiguration()
				.Enrich.WithProperty("SourceContext", string.Empty)
				.WriteTo.LiterateConsole(outputTemplate: "{Timestamp:HH:mm:ss.fff} [{Level}] {SourceContext} {Message}{NewLine}{Exception}")
				.CreateLogger();

			var builder = new ConfigurationBuilder()
				.AddJsonFile("appsettings.json")
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true)
				.AddJsonFile("appsettings.local.json", optional: true);

			if (env.IsDevelopment())
			{
				// For more details on using the user secret store see http://go.microsoft.com/fwlink/?LinkID=532709
				builder.AddUserSecrets();

				// This will push telemetry data through Application Insights pipeline faster, allowing you to view results immediately.
				builder.AddApplicationInsightsSettings(developerMode: true);
			}

			builder.AddEnvironmentVariables();
			Configuration = builder.Build();
		}

		public IConfigurationRoot Configuration { get; set; }

		// This method gets called by the runtime. Use this method to add services to the container.
		public void ConfigureServices(IServiceCollection services)
		{
			// Add framework services.
			services.AddApplicationInsightsTelemetry(Configuration);

			var coreModule = new BusinessServices(Configuration);
			coreModule.ConfigureServices(services);

			services.AddMvc()
				.AddMvcOptions(options =>
				{
					var formatter = options.OutputFormatters.First(f => f is JsonOutputFormatter) as JsonOutputFormatter;
					formatter.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
					formatter.SerializerSettings.DateFormatHandling = DateFormatHandling.IsoDateFormat;

				});
		}

		// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
		public void Configure(IApplicationBuilder app, IHostingEnvironment env)
		{
			app.UseApplicationInsightsRequestTelemetry();

			var dbContext = app.ApplicationServices.GetRequiredService<NZBContext>();
			dbContext.Database.EnsureCreated();

			if (env.IsDevelopment())
			{
				app.UseBrowserLink();
				app.UseDeveloperExceptionPage();
				app.UseDatabaseErrorPage();
			}
			else
			{
				app.UseExceptionHandler("/Home/Error");

				// For more details on creating database during deployment see http://go.microsoft.com/fwlink/?LinkID=615859
				try
				{
					using (var serviceScope = app.ApplicationServices.GetRequiredService<IServiceScopeFactory>()
						.CreateScope())
					{
						serviceScope.ServiceProvider.GetService<NZBContext>()
							 .Database.Migrate();
					}
				}
				catch { }
			}

			app.UseHangfire();

			app.UseIISPlatformHandler(options => options.AuthenticationDescriptions.Clear());

			app.UseApplicationInsightsExceptionTelemetry();

			app.UseStaticFiles();
			//app.UseIdentity();

			// To configure external authentication please see http://go.microsoft.com/fwlink/?LinkID=532715

			app.UseMvc(routes =>
			{
				routes.MapRoute("Api", "api/{controller}/{action?}", new { controller = "Products" });
				routes.MapRoute("default", "{controller=Home}/{action=Index}/{id?}");
			});

			foreach (var bootTask in app.ApplicationServices.GetServices<IBootTask>())
			{
				bootTask.Run();
				Log.Logger.ForContext<Startup>().Information("Running boot task {0}", bootTask);
			}
		}

		// Entry point for the application.
		public static void Main(string[] args) => WebApplication.Run<Startup>(args);
	}
}
