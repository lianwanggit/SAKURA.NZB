using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class Customer
	{
		public int Id { get; set; }
		[StringLength(50)]
		[Display(Name = "姓名")]
		public string FullName { get; set; }
		[StringLength(15)]
		[Display(Name = "电话")]
		public string Phone1 { get; set; }
		[StringLength(15)]
		[Display(Name = "电话 1")]
		public string Phone2 { get; set; }
		[StringLength(100)]
		[Display(Name = "地址")]
		public string Address { get; set; }
		[StringLength(50)]
		[Display(Name = "电子邮件")]
		public string Email { get; set; }
		[Display(Name = "身份证是否已上传")]
		public bool IsIdentityUploaded { get; set; }
		[Display(Name = "级别")]
		public int? Level { get; set; }
		[StringLength(255)]
		[Display(Name = "描述")]
		public string Description { get; set; }
	}
}
