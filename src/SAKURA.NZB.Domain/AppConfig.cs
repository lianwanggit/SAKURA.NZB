using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SAKURA.NZB.Domain
{
	public class AppConfig
    {
		[Key, DatabaseGenerated(DatabaseGeneratedOption.None), MaxLength(200)]
		public string Key { get; set; }
		[MaxLength(1000)]
		public string Value { get; set; }
	}
}
