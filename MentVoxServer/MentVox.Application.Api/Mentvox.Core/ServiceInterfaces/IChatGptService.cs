using MentVox.Core.DTOs;
using MentVox.Core.Models.ConversationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.Interfaces
{
    public interface IChatGptService
    {
        Task<string> GetChatResponseAsync(string inputText);
    }
}
