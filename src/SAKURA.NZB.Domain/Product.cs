using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{

	public class Product
    {
		public int Id { get; set; }

		[Required(ErrorMessage = "产品名称不能为空")]
		[MaxLength(100, ErrorMessage = "产品名称不能超过100个字符")]
		[Display(Name = "产品名")]
		public string Name { get; set; }

		[MaxLength(1000, ErrorMessage = "产品简介不能超过1000个字符")]
		[Display(Name = "产品简介")]
		public string Desc { get; set; }

		[Required(ErrorMessage = "请选择产品类别")]
		[Display(Name = "类别")]
		public int CategoryId { get; set; }		
		public Category Category { get; set; }

		[Display(Name = "图片")]
		public List<Image> Images { get; set; }

		[Required(ErrorMessage = "产品价格不能为空")]
		[Range(0.01, 9999, ErrorMessage = "产品价格范围必须为[0.01 - 9999]NZD") ]
		[DataType(DataType.Currency, ErrorMessage = "产品价格必须为数字")]
		[Display(Name = "价格")]
		public float Cost { get; set; }
	}
}
