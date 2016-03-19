using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class Image
    {
		public int Id { get; set; }
		[StringLength(255)]
		public string Name { get; set; }
		[StringLength(100)]
		public string ContentType { get; set; }
		public byte[] Content { get; set; }

		public int ProductId { get; set; }
		public Product Product { get; set; }
	}
}
