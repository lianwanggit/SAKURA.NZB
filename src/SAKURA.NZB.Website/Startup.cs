﻿using Hangfire;
using Hangfire.Dashboard;
using Hangfire.SqlServer;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.AspNet.Mvc.Formatters;
using Microsoft.Data.Entity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
using SAKURA.NZB.Core;
using SAKURA.NZB.Core.Hangfire;
using SAKURA.NZB.Data;
using System;
using System.Linq;

namespace SAKURA.NZB.Website
{
	public class Startup
	{
		public Startup(IHostingEnvironment env)
		{
			// Set up configuration sources.

			var builder = new ConfigurationBuilder()
				.AddJsonFile("appsettings.json")
				.AddJsonFile($"appsettings.{env.EnvironmentName}.json", optional: true);

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

			var coreModule = new CoreModule(Configuration);
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
		public void Configure(IApplicationBuilder app, IHostingEnvironment env, ILoggerFactory loggerFactory)
		{
			loggerFactory.AddConsole(Configuration.GetSection("Logging"));
			loggerFactory.AddDebug();

			app.UseApplicationInsightsRequestTelemetry();

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
		}

		// Entry point for the application.
		public static void Main(string[] args) => WebApplication.Run<Startup>(args);
	}
}
