using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.DTOs
{
    public class ConversationDto
    {
        public int UserId { get; set; }
        public string UserMessage { get; set; }
        public string BotResponse { get; set; }
        public DateTime ResponseTime { get; set; }
    }
}
