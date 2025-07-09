using MentVox.Core.DTOs;
using MentVox.Core.Interfaces;
using MentVox.Core.Models;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace MentVox_Application_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatGptController : ControllerBase
    {
        private readonly IChatGptService _chatGptService;

        public ChatGptController(IChatGptService chatGptService)
        {
            _chatGptService = chatGptService;
        }

        // POST: api/chatgpt/message
        [HttpPost("message")]
        public async Task<IActionResult> SendMessage([FromBody] ChatGptRequestDto request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.UserMessage))
                return BadRequest(new { error = "Invalid request. Please provide a message." });
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            Console.WriteLine($"📨 Got message from {request.UserName}: {request.UserMessage}");

            try
            {
                var response = await _chatGptService.GetChatResponseAsync(request.UserMessage);

                if (string.IsNullOrWhiteSpace(response))
                    return Ok(new ChatGptResponseDto
                    {
                        BotResponse = "No response generated.",
                        ResponseTime = DateTime.UtcNow
                    });

                return Ok(new ChatGptResponseDto
                {
                    BotResponse = response,
                    ResponseTime = DateTime.UtcNow
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "An error occurred while processing your request.", details = ex.Message });
            }
        }
    }
}
