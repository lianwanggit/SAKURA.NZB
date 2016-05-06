using System;
using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class ExpressTrackRecord
    {
		public int Id { get; set; }
		public int ExpressTrackId { get; set; }
		public DateTime? When { get; set; }
		[StringLength(20)]
		public string Where { get; set; }
		[StringLength(200)]
		public string Content { get; set; }
	}
}
