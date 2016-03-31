using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace SAKURA.NZB.Business.ExchangeRate
{
	public static class WebApiInvoker
	{
		public static async Task<T> GetAsync<T>(string baseAddress, string routeUri)
		{
			using (var client = new HttpClient())
			{
				client.BaseAddress = new Uri(baseAddress);
				client.DefaultRequestHeaders.Accept.Clear();
				client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

				try
				{
					var response = await client.GetAsync(routeUri);
					response.EnsureSuccessStatusCode();

					return await response.Content.ReadAsAsync<T>();
				}
				catch(Exception ex)
				{
					throw new HttpRequestException($"Failed to get data from web api: { baseAddress + routeUri }");
				}
			}
		}

		public static async Task<R> PostAsync<T, R>(string baseAddress, string routeUri, T data)
		{
			using (var client = new HttpClient())
			{
				client.BaseAddress = new Uri(baseAddress);
				client.DefaultRequestHeaders.Accept.Clear();
				client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

				try
				{
					var response = await client.PostAsJsonAsync(routeUri, data);
					response.EnsureSuccessStatusCode();

					var obj = await response.Content.ReadAsAsync<R>();
					return obj;
				}
				catch
				{
					throw new HttpRequestException($"Failed to post data to web api: { baseAddress + routeUri }");
				}
			}
		}
	}
}
