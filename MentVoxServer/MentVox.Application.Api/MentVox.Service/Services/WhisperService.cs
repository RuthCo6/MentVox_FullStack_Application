using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using MentVox.Core.Interfaces;
using MentVox.Core.Models;
using MentVox.Core.Models.ConversationModels;
using MentVox.Core.Repositories;

namespace MentVox.Service.Services
{
    public class WhisperService : IWhisperService
    {
        private readonly IWhisperRepository _repository;
        private readonly HttpClient _httpClient;

        public WhisperService(IWhisperRepository repository)
        {
            _repository = repository;
            _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", "OpenAIApiKey");
        }

        public async Task<Whisper> TranscribeAsync(Whisper input)
        {
            var content = new MultipartFormDataContent();
            var audioStream = new MemoryStream(input.AudioData);
            content.Add(new StreamContent(audioStream), "file", "audio.mp3");
            content.Add(new StringContent("whisper-1"), "model");
            if (!string.IsNullOrWhiteSpace(input.Language))
                content.Add(new StringContent(input.Language), "language");

            var response = await _httpClient.PostAsync("https://api.openai.com/v1/audio/transcriptions", content);
            if (!response.IsSuccessStatusCode)
                throw new Exception("Whisper API failed.");

            var json = await response.Content.ReadAsStringAsync();
            var text = JsonDocument.Parse(json).RootElement.GetProperty("text").GetString();

            input.TranscribedText = text;
            await _repository.SaveAsync(input);
            return input;
        }
    }
}

