using Hangfire;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace SAKURA.NZB.Core.Hangfire
{
	public class HangfireJobActivator : JobActivator
	{
		private readonly IServiceProvider _serviceProvider;

		public HangfireJobActivator(IServiceProvider serviceProvider)
		{
			if (serviceProvider == null)
				throw new ArgumentNullException(nameof(serviceProvider));

			_serviceProvider = serviceProvider;
		}

		public override object ActivateJob(Type jobType)
		{
			var scope = _serviceProvider.GetRequiredService<IServiceScopeFactory>().CreateScope();

			var job = scope.ServiceProvider.GetService(jobType);
			if (job == null)
				throw new Exception($"Could not activate a job of type '{jobType.FullName}'.");

			return job;
		}
	}
}
