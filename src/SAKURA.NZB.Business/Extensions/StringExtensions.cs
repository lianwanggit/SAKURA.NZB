﻿using Pinyin4net.Format;
using System.Linq;
using System.Text.RegularExpressions;

namespace SAKURA.NZB.Business.Extensions
{
	public static class StringExtensions
    {
		private static readonly HanyuPinyinOutputFormat format;

		static StringExtensions()
		{
			format = new HanyuPinyinOutputFormat();
			format.ToneType = HanyuPinyinToneType.WITHOUT_TONE;
			format.VCharType = HanyuPinyinVCharType.WITH_V;
			format.CaseType = HanyuPinyinCaseType.LOWERCASE;
		}

		public static bool IsNullOrWhitespace(this string text)
		{
			return string.IsNullOrWhiteSpace(text);
		}

		public static string FormatWith(this string text, params object[] args)
		{
			return string.Format(text, args);
		}

		public static string After(this string value, string splitter)
		{
			int posA = value.LastIndexOf(splitter);
			if (posA == -1)
			{
				return "";
			}
			int adjustedPosA = posA + splitter.Length;
			if (adjustedPosA >= value.Length)
			{
				return "";
			}
			return value.Substring(adjustedPosA);
		}

		public static string ToSlug(this string value)
		{
			value = value.ToLowerInvariant();

			value = ConvertChineseToPY(value);

			value = value.Replace("#", "-sharp ").Replace("@", "-at ")
						 .Replace("$", "-dollar ").Replace("%", "-percent ")
						 .Replace("&", "-and ").Replace("||", "-or ");

			value = Regex.Replace(value, @"[ ]{2,}", " ", RegexOptions.None);

			value = Regex.Replace(value, @"[^a-z0-9\s-_]", "", RegexOptions.Compiled);

			value = value.Trim('-', '_', ' ');

			value = Regex.Replace(value, @"([-_]){2,}", "$1", RegexOptions.Compiled);

			return value;
		}

		private static string ConvertChineseToPY(string value)
		{
			return Regex.Replace(value, "[\u4e00-\u9fa5]", (m) => string.Format(" {0} ", m.Value.ChsToPinYin()));
		}


		/// <summary>
		/// 简体中文转拼音
		/// </summary>
		/// <param name="chs">简体中文字</param>
		/// <returns>拼音</returns>
		private static string ChsToPinYin(this string chs)
		{
			var myRegex = new Regex("^[\u4e00-\u9fa5]$");
			var returnstr = "";
			var nowchar = chs.ToCharArray();
			for (var j = 0; j < nowchar.Length; j++)
			{
				if (myRegex.IsMatch(nowchar[j].ToString()))
				{
					var pingStrs = Pinyin4net.PinyinHelper.ToHanyuPinyinStringArray(nowchar[j], format);
					if (pingStrs.Any())
					{
						returnstr += pingStrs[0];
					}
					else
						returnstr += nowchar[j].ToString();
				}
				else
				{
					returnstr += nowchar[j].ToString();
				}
			}
			return returnstr;
		}

	}
}