using Microsoft.Extensions.Options;
using static MentVox.Application.OpenAI.Config;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Text;

namespace MentVox.Application.OpenAI
{
    public class OpenAIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public OpenAIService(IOptions<OpenAISettings> settings)
        {
            _httpClient = new HttpClient();
            _apiKey = settings.Value.ApiKey;
            _httpClient.DefaultRequestHeaders.Authorization =
                new AuthenticationHeaderValue("Bearer", _apiKey);
        }

        public async Task<string> GetChatCompletionAsync(string userMessage)
        {
            var requestBody = new
            {
                model = "gpt-4",
                messages = new[]
                {
                new { role = "user", content = userMessage }
            }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/chat/completions", content);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            using var doc = JsonDocument.Parse(responseBody);
            var reply = doc.RootElement
                           .GetProperty("choices")[0]
                           .GetProperty("message")
                           .GetProperty("content")
                           .GetString();

            return reply;
        }
    }

}
