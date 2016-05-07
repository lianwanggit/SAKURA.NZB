using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class ExpressTrack
    {
		public int Id { get; set; }
		[Required]
		[StringLength(20)]
		public string WaybillNumber { get; set; }
		[StringLength(20)]
		public string From { get; set; }
		[StringLength(20)]
		public string Destination { get; set; }
		[StringLength(10)]
		public string ItemCount { get; set; }
		[StringLength(20)]
		public string Status { get; set; }

		public DateTimeOffset ModifiedTime { get; set; }
		public DateTime? ArrivedTime { get; set; }
		[StringLength(20)]
		public string Recipient { get; set; }

		public List<ExpressTrackRecord> Details { get; set; }
	}
}
