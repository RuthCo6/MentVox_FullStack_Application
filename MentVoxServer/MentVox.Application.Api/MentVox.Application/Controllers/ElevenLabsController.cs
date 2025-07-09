using MentVox.Core.Interfaces;
using MentVox.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace MentVox_Application_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ElevenLabsController : ControllerBase
    {
        private readonly IElevenLabsService _elevenLabsService;

        public ElevenLabsController(IElevenLabsService elevenLabsService)
        {
            _elevenLabsService = elevenLabsService;
        }

        // POST: api/elevenlabs/synthesize
        [HttpPost("synthesize")]
        public async Task<IActionResult> SynthesizeSpeech([FromBody] ElevenLabs request)
        {
            if (request == null || string.IsNullOrEmpty(request.TextToSynthesize))
            {
                return BadRequest("Invalid request. Please provide text to synthesize.");
            }

            try
            {
                var audioBytes = await _elevenLabsService.SynthesizeAudio(request);

                if (audioBytes == null || audioBytes.Length == 0)
                {
                    return StatusCode(500, "Error generating audio from ElevenLabs API.");
                }

                return File(audioBytes, request.AudioFormat ?? "audio/mpeg");
            }
            catch (Exception ex)
            {
                // טיפול בשגיאה במקרה של בעיה בתקשורת או API
                return StatusCode(500, new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }
    }
}
