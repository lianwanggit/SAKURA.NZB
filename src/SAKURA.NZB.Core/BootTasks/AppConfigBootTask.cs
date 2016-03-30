using SAKURA.NZB.Core.Configuration;

namespace SAKURA.NZB.Core.BootTasks
{
	public class AppConfigBootTask : IBootTask
	{
		private readonly Config _config;

		public AppConfigBootTask(Config config)
		{
			_config = config;
		}

		public void Run()
		{
			_config.EnsureDefaults();
		}
	}
}
