using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace SAKURA.NZB.Domain
{
	public class ExpressTrack : IEquatable<ExpressTrack>
	{
		public int Id { get; set; }
		[Required]
		[StringLength(20)]
		public string WaybillNumber { get; set; }
		[StringLength(20)]
		public string From { get; set; }
		[StringLength(20)]
		public string Destination { get; set; }
		[StringLength(10)]
		public string ItemCount { get; set; }
		[StringLength(20)]
		public string Status { get; set; }

		public DateTimeOffset ModifiedTime { get; set; }
		public DateTime? ArrivedTime { get; set; }
		[StringLength(20)]
		public string Recipient { get; set; }

		public List<ExpressTrackRecord> Details { get; set; }

		public bool Equals(ExpressTrack other)
		{
			return WaybillNumber == other.WaybillNumber
				&& From == other.From
				&& Destination == other.Destination
				&& ItemCount == other.ItemCount
				&& Status == other.Status
				&& ArrivedTime == other.ArrivedTime
				&& Recipient == other.Recipient
				&& Details.Count == other.Details.Count;
		}

		public override bool Equals(object obj)
		{
			if (ReferenceEquals(null, obj)) return false;
			if (ReferenceEquals(this, obj)) return true;
			if (obj.GetType() != GetType()) return false;

			return Equals(obj as ExpressTrack);
		}

		public override int GetHashCode()
		{
			unchecked
			{
				var hashCode = 13;
				hashCode = (hashCode * 397) ^ (!string.IsNullOrEmpty(WaybillNumber) ? WaybillNumber.GetHashCode() : 0);
				hashCode = (hashCode * 397) ^ (!string.IsNullOrEmpty(From) ? From.GetHashCode() : 0);
				hashCode = (hashCode * 397) ^ (!string.IsNullOrEmpty(Destination) ? Destination.GetHashCode() : 0);
				hashCode = (hashCode * 397) ^ (!string.IsNullOrEmpty(ItemCount) ? ItemCount.GetHashCode() : 0);
				hashCode = (hashCode * 397) ^ (!string.IsNullOrEmpty(Status) ? Status.GetHashCode() : 0);
				hashCode = (hashCode * 397) ^ (!string.IsNullOrEmpty(Recipient) ? Recipient.GetHashCode() : 0);

				hashCode = (hashCode * 397) ^ (ArrivedTime.HasValue ? ArrivedTime.GetHashCode() : 0);
				hashCode = (hashCode * 397) ^ Details.Count;

				return hashCode;
			}
		}
	}
}
