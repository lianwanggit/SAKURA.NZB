using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class Supplier
    {
		public int Id { get; set; }
		[StringLength(50)]
		public string Name { get; set; }
		[StringLength(10)]
		public string Address { get; set; }
		[StringLength(15)]
		public string Phone { get; set; }
    }
}
