using MentVox.Core.Models.ConversationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.Repositories
{
    public interface IConversationRepository
    {
        Task<IEnumerable<Conversation>> GetAllAsync();
        Task<Conversation> GetByIdAsync(int id);
        Task AddAsync(Conversation conversation);
        Task UpdateAsync(Conversation conversation);
        Task DeleteAsync(int id);
    }

}
