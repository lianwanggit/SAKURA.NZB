using System;
using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class ExchangeHistory
	{
		public int Id { get; set; }
		[DataType(DataType.Currency)]
		public float Cny { get; set; }
		[DataType(DataType.Currency)]
		public float Nzd { get; set; }
		[DataType(DataType.Currency)]
		public float SponsorCharge { get; set; }
		[DataType(DataType.Currency)]
		public float ReceiverCharge { get; set; }
		[DataType(DataType.Currency)]
		public float Rate { get; set; }
		[StringLength(10)]
		[Required]
		public string Agent { get; set; }
		public DateTimeOffset CreatedTime { get; set; }
	}
}