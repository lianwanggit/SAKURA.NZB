using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class Customer
	{
		public int Id { get; set; }

		[StringLength(10)]
		[Required]
		public string FullName { get; set; }

		[StringLength(50)]
		[Required]
		public string NamePinYin { get; set; }

		[Phone]
		[Required]
		public string Phone1 { get; set; }

		[StringLength(15)]
		public string Phone2 { get; set; }

		[StringLength(100)]
		[Required]
		public string Address { get; set; }

		[StringLength(100)]
		public string Address1 { get; set; }

		[EmailAddress]
		[StringLength(50)]
		public string Email { get; set; }

		public bool IsIdentityUploaded { get; set; }

		public int? Level { get; set; }

		[StringLength(255)]
		public string Description { get; set; }
	}
}
