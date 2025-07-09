using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace MentVox.Core.Models.ConversationModels
{
    public class Conversation
    {
        public string UserMessage { get; set; }
        public int ConversationId { get; set; }
        public string BotResponse { get; set; }
        public DateTime ResponseTime { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }



        // 🔥 קונסטרקטור חכם - כל פעם שתיצרי שיחה, הזמן יוגדר אוטומטית
        public Conversation()
        {
            ResponseTime = DateTime.Now;
        }

        // אופציונלי: קונסטרקטור מלא אם את רוצה ליצור שיחה עם כל הנתונים ישירות:
        public Conversation(int conversationId, string userMessage, string botResponse, int userId, User user)
        {
            ConversationId = conversationId;
            UserMessage = userMessage;
            BotResponse = botResponse;
            UserId = userId;
            User = user;
            ResponseTime = DateTime.Now;
        }

    }

}
