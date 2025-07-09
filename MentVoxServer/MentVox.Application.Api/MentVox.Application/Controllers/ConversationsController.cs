using MentVox.Core.DTOs;
using MentVox.Core.Interfaces;
using MentVox.Core.Models.ConversationModels;
using MentVox.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Threading.Tasks;

namespace MentVox_Application_.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ConversationController : ControllerBase
    {
        private readonly IConversationService _conversationService;
        private readonly ApplicationDbContext _context;

        public ConversationController(IConversationService conversationService, ApplicationDbContext context)
        {
            _conversationService = conversationService;
            _context = context;
        }

        // GET: api/conversation
        [HttpGet]
        public async Task<IActionResult> GetAllConversations()
        {
            try
            {
                var conversations = await _conversationService.GetAllAsync();
                return Ok(conversations);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }

        // GET: api/conversation/{id}
        [HttpGet("{id}")]
        public async Task<IActionResult> GetConversById(int id)
        {
            try
            {
                var item = await _conversationService.GetByIdAsync(id);
                if (item == null)
                {
                    return NotFound(new { message = "Conversation not found" });
                }
                return Ok(item);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }

        // POST: api/conversation
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ConversationDto dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid conversation data." });

            // ולידציה: לבדוק אם המשתמש קיים
            var userExists = await _context.Users.AnyAsync(u => u.Id == dto.UserId);
            if (!userExists)
                return BadRequest(new { message = "User ID is invalid or does not exist." });

            var conversation = new Conversation
            {
                UserMessage = dto.UserMessage,
                BotResponse = dto.BotResponse,
                ResponseTime = dto.ResponseTime,
                UserId = dto.UserId
            };

            try
            {
                await _conversationService.CreateAsync(conversation);
                return CreatedAtAction(nameof(GetConversById), new { id = conversation.ConversationId }, conversation);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = "An error occurred while creating the conversation.",
                    details = ex.Message
                });
            }
        }

        // PUT: api/conversation/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] ConversationDto dto)
        {
            if (dto == null || id != dto.UserId)
                return BadRequest(new { message = "Invalid conversation data or mismatched IDs." });

            try
            {
                var existingConversation = await _conversationService.GetByIdAsync(id);
                if (existingConversation == null)
                {
                    return NotFound(new { message = "Conversation not found" });
                }

                existingConversation.UserMessage = dto.UserMessage;
                existingConversation.BotResponse = dto.BotResponse;
                existingConversation.ResponseTime = dto.ResponseTime;

                await _conversationService.UpdateAsync(existingConversation);
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    error = ex.Message,
                    inner = ex.InnerException?.Message,
                    stack = ex.StackTrace
                });
            }
        }

        // DELETE: api/conversation/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var item = await _conversationService.GetByIdAsync(id);
                if (item == null)
                {
                    return NotFound(new { message = "Conversation not found" });
                }

                await _conversationService.DeleteAsync(id);
                return NoContent();
            }
            catch (Exception ex)
            {
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