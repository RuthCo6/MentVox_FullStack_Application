using MentVox.Core.Interfaces;
using MentVox.Core.Models;
using MentVox.Core.RepositoriesInterfaces;
using MentVox.Data.Repositories;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;


namespace MentVox.Service.Services
{
    public class ElevenLabsService : IElevenLabsService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;
        private readonly IRepositoryManager _repositoryManager;

        public ElevenLabsService(HttpClient httpClient, IConfiguration configuration, IRepositoryManager repository)
        {
            _httpClient = httpClient;
            _apiKey = configuration["ElevenLabsApiKey"];
            _repositoryManager = repository;
        }

        public async Task<Stream> TextToSpeechAsync(string text)
        {
            var requestBody = new
            {
                text = text,
                voice = "en_us_male"
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            var response = await _httpClient.PostAsync("https://api.elevenlabs.io/v1/text-to-speech", content);

            if (response.IsSuccessStatusCode)
            {
                var audioBytes = await response.Content.ReadAsByteArrayAsync();

                var request = new ElevenLabs
                {
                    TextToSynthesize = text,
                    Voice = "en_us_male",
                    SynthesizedAudio = audioBytes,
                    AudioFormat = "mp3" // נניח שזה הפורמט
                };

                await _repositoryManager.ElevenLab.SaveRequestAsync(request);
                await _repositoryManager.SaveAsync();

                return new MemoryStream(audioBytes);
            }

            return null;
        }

        public async Task<byte[]> SynthesizeAudio(ElevenLabs request)
        {
            var requestBody = new
            {
                text = request.TextToSynthesize,
                voice = request.Voice ?? "en_us_male"
            };

            var content = new StringContent(JsonConvert.SerializeObject(requestBody), Encoding.UTF8, "application/json");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _apiKey);

            try
            {
                var response = await _httpClient.PostAsync("https://api.elevenlabs.io/v1/text-to-speech", content);

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception("Failed to synthesize audio from ElevenLabs API. Status Code: " + response.StatusCode);
                }

                // קרא את האודיו כ- byte array
                var audioBytes = await response.Content.ReadAsByteArrayAsync();

                // שמירה במסד נתונים דרך ה-repository
                request.SynthesizedAudio = audioBytes;
                request.AudioFormat = "audio/mpeg"; // או בהתאם למה שמגיע

                await _repositoryManager.ElevenLab.SaveRequestAsync(request);
                await _repositoryManager.SaveAsync();

                return audioBytes;
            }
            catch (Exception ex)
            {
                // טיפול בשגיאות ושמירת השגיאה
                throw new Exception("Error during ElevenLabs audio synthesis: " + ex.Message);
            }
        }
    }
}
