using SAKURA.NZB.Business.Configuration;

namespace SAKURA.NZB.Business.BootTasks
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
