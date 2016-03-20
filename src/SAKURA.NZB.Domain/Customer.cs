using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class Customer
	{
		public int Id { get; set; }
		[StringLength(10, ErrorMessage = "姓名长度不能超过10个字符")]
		[Required(ErrorMessage = "姓名不能为空")]
		[Display(Name = "姓名")]
		public string FullName { get; set; }
		[Phone(ErrorMessage = "电话格式不正确")]
		[Required(ErrorMessage = "电话不能为空")]
		[Display(Name = "电话")]
		public string Phone1 { get; set; }
		[StringLength(15)]
		[Display(Name = "电话 1")]
		public string Phone2 { get; set; }
		[StringLength(100, ErrorMessage = "地址长度不能超过100个字符")]
		[Required(ErrorMessage = "地址不能为空")]
		[Display(Name = "地址")]
		public string Address { get; set; }
		[EmailAddress(ErrorMessage = "电子邮件地址格式不正确")]
		[StringLength(50)]
		[Display(Name = "电子邮件")]
		public string Email { get; set; }
		[Display(Name = "身份证是否已上传")]
		public bool IsIdentityUploaded { get; set; }
		[Display(Name = "级别")]
		public int? Level { get; set; }
		[StringLength(255, ErrorMessage = "备注长度不能超过255个字符")]
		[Display(Name = "备注")]
		public string Description { get; set; }
	}
}
