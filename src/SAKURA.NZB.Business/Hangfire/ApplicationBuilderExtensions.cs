using System;
using Hangfire;
using Hangfire.Annotations;
using Hangfire.Dashboard;
using Microsoft.AspNet.Builder;
using Microsoft.AspNet.Hosting;
using Microsoft.Extensions.DependencyInjection;
using SAKURA.NZB.Data;
using Hangfire.SqlServer;
using Microsoft.Data.Entity;
using SAKURA.NZB.Business.Hangfire;

namespace SAKURA.NZB.Business
{
	public static class ApplicationBuilderExtensions
	{
		internal static IApplicationBuilder UseHangfireServer([NotNull] this IApplicationBuilder builder)
		{
			return builder.UseHangfireServer(new BackgroundJobServerOptions());
		}

		internal static IApplicationBuilder UseHangfireServer(
			 [NotNull] this IApplicationBuilder builder,
			 [NotNull] BackgroundJobServerOptions options)
		{
			return builder.UseHangfireServer(options, JobStorage.Current);
		}

		internal static IApplicationBuilder UseHangfireServer(
			 [NotNull] this IApplicationBuilder builder,
			 [NotNull] BackgroundJobServerOptions options,
			 [NotNull] JobStorage storage)
		{
			if (builder == null) throw new ArgumentNullException("builder");
			if (options == null) throw new ArgumentNullException("options");
			if (storage == null) throw new ArgumentNullException("storage");

			var server = new BackgroundJobServer(options, storage);

			var lifetime = builder.ApplicationServices.GetRequiredService<IApplicationLifetime>();
			lifetime.ApplicationStopped.Register(server.Dispose);

			return builder;
		}

		internal static IApplicationBuilder UseHangfireDashboard([NotNull] this IApplicationBuilder builder)
		{
			return builder.UseHangfireDashboard("/hangfire");
		}

		internal static IApplicationBuilder UseHangfireDashboard(
			 [NotNull] this IApplicationBuilder builder,
			 [NotNull] string pathMatch)
		{
			return builder.UseHangfireDashboard(pathMatch, new DashboardOptions());
		}

		internal static IApplicationBuilder UseHangfireDashboard(
			 [NotNull] this IApplicationBuilder builder,
			 [NotNull] string pathMatch,
			 [NotNull] DashboardOptions options)
		{
			return builder.UseHangfireDashboard(pathMatch, options, JobStorage.Current);
		}

		internal static IApplicationBuilder UseHangfireDashboard(
			 [NotNull] this IApplicationBuilder builder,
			 [NotNull] string pathMatch,
			 [NotNull] DashboardOptions options,
			 [NotNull] JobStorage storage)
		{
			if (builder == null) throw new ArgumentNullException(nameof(builder));
			if (pathMatch == null) throw new ArgumentNullException(nameof(pathMatch));
			if (options == null) throw new ArgumentNullException(nameof(options));
			if (storage == null) throw new ArgumentNullException(nameof(storage));

			return builder.Map(pathMatch, subApp =>
			{
				subApp.UseOwin(next =>
				{
					next(MiddlewareExtensions.UseHangfireDashboard(options, storage, DashboardRoutes.Routes));
				});
			});
		}

		public static void UseHangfire([NotNull]this IApplicationBuilder app)
		{
			var hangfireContext = app.ApplicationServices.GetRequiredService<HangfireContext>();

			hangfireContext.Database.EnsureCreated();
			var connectionString = hangfireContext.Database.GetDbConnection().ConnectionString;

			var options = new SqlServerStorageOptions
			{
				PrepareSchemaIfNecessary = true
			};

			GlobalConfiguration.Configuration
				.UseSqlServerStorage(connectionString, options)
				.UseDIActivator(app.ApplicationServices)
				.UseDashboardMetric(DashboardMetrics.ScheduledCount)
				.UseDashboardMetric(DashboardMetrics.RetriesCount)
				.UseDashboardMetric(DashboardMetrics.ProcessingCount)
				.UseDashboardMetric(DashboardMetrics.SucceededCount)
				.UseDashboardMetric(DashboardMetrics.FailedCount)
				.UseDashboardMetric(DashboardMetrics.AwaitingCount);

			app.UseHangfireServer();
			app.UseHangfireDashboard("/hangfire", new DashboardOptions
			{
				AuthorizationFilters = new[] { new HangfireAuthorizationFilter() },
				AppPath = "/"
			});

			try
			{
				BackgroundJob.Enqueue<HangfireHelper>(h => h.ConfirmHangfireConfigured());
			}
			catch (Exception e)
			{
				throw new Exception("Could not configure Hangfire.", e);
			}
		}
	}
}
