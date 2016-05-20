using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SAKURA.NZB.Website.ViewModels
{
    public class ExchangeHistoryModel
    {
		public int Id { get; set; }

		public string Cny { get; set; }

		public string Nzd { get; set; }

		public string SponsorCharge { get; set; }

		public string ReceiverCharge { get; set; }

		public string Rate { get; set; }

		public string Agent { get; set; }
		public string CreatedTime { get; set; }
	}
}
