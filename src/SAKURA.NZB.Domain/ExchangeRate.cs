using System;

namespace SAKURA.NZB.Domain
{
	public class ExchangeRate
    {
		public int Id { get; set; }
		public float Rate { get; set; }
		public DateTimeOffset ModifiedTime { get; set; }
    }
}
