using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.DTOs
{
    public class ChatGptResponseDto
    {
        public string BotResponse { get; set; }
        public DateTime ResponseTime { get; set; }
        public string Error { get; set; } // במקרה של שגיאה
    }
}
