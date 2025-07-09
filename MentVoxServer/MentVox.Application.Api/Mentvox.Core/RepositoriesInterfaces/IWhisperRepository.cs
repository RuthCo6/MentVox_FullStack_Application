using MentVox.Core.Models;
using MentVox.Core.Models.ConversationModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.Repositories
{
    public interface IWhisperRepository
    {
        Task SaveAsync(Whisper whisper);
        Task<IEnumerable<Whisper>> GetAllAsync();
        Task<Whisper> GetByTextAsync(string text);
        Task DeleteAsync(string text);
        Task UpdateAsync(Whisper updatedWhisper);
    }
}
