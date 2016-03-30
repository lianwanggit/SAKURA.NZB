using Hangfire;
using Hangfire.Annotations;
using System;

namespace SAKURA.NZB.Core.Hangfire
{
	public static class GlobalConfigurationExtensions
	{
		public static IGlobalConfiguration<HangfireJobActivator> UseDIActivator(
				[NotNull] this IGlobalConfiguration configuration,
				[NotNull] IServiceProvider serviceProvider)
		{
			if (configuration == null) throw new ArgumentNullException("configuration");
			if (serviceProvider == null) throw new ArgumentNullException("serviceProvider");

			return configuration.UseActivator(new HangfireJobActivator(serviceProvider));
		}
	}
}
