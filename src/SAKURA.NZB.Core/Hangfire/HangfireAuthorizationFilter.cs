using Hangfire.Dashboard;
using System.Collections.Generic;

namespace SAKURA.NZB.Core.Hangfire
{
	public class HangfireAuthorizationFilter : IAuthorizationFilter
	{
		public bool Authorize(IDictionary<string, object> owinEnvironment)
		{
			//// In case you need an OWIN context, use the next line,
			//// `OwinContext` class is the part of the `Microsoft.Owin` package.
			//var context = new OwinContext(owinEnvironment);

			//// Allow all authenticated users to see the Dashboard (potentially dangerous).
			//return context.Authentication.User.Identity.IsAuthenticated;

			return true;
		}
	}
}
