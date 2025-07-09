using MentVox.Application.OpenAI;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace MentVox_Application_.Controllers
{
    public class OpenAIController : Controller
    {
        [ApiController]
        [Route("api/[controller]")]
        public class ChatController : ControllerBase
        {
            private readonly OpenAIService _openAIService;

            public ChatController(OpenAIService openAIService)
            {
                _openAIService = openAIService;
            }

            [HttpPost]
            public async Task<IActionResult> Post([FromBody] string message)
            {
                var reply = await _openAIService.GetChatCompletionAsync(message);
                return Ok(new { reply });
            }
        }

    }
}
