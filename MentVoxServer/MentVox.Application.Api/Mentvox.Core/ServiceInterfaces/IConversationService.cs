using MentVox.Core.DTOs;
using MentVox.Core.Models.ConversationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.Interfaces
{
    public interface IConversationService
    {
        Task<IEnumerable<Conversation>> GetAllAsync();
        Task<Conversation> GetByIdAsync(int id);
        Task CreateAsync(Conversation conversation);
        Task UpdateAsync(Conversation conversation);
        Task DeleteAsync(int id);
    }
}
