using MentVox.Core.Interfaces;
using MentVox.Core.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MentVox.Core;
using MentVox.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MentVox_Application_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class WhisperController : ControllerBase
    {
        private readonly IWhisperService _service;

        public WhisperController(IWhisperService service)
        {
            _service = service;
        }

        [HttpPost("transcribe")]
        public async Task<IActionResult> Transcribe([FromForm] TranscriptionRequest request)
        {
            if (request.Audio == null || request.Audio.Length == 0)
                return BadRequest("Missing audio.");

            using var ms = new MemoryStream();
            await request.Audio.CopyToAsync(ms);

            var whisper = new Whisper
            {
                AudioData = ms.ToArray(),
                Language = request.Language
            };

            var result = await _service.TranscribeAsync(whisper);
            return Ok(result);
        }
    }
}