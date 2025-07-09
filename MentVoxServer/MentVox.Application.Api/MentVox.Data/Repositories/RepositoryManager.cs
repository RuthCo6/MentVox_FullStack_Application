using MentVox.Core.Repositories;
using MentVox.Core.RepositoriesInterfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Data.Repositories
{
    public class RepositoryManager : IRepositoryManager
    {
        private readonly ApplicationDbContext _context;

        private readonly IConversationRepository _conversationRepository;
        private readonly IWhisperRepository _whisperRepository;
        private readonly IElevenLabRepository _elevenLabRepository;

        public RepositoryManager(ApplicationDbContext context,
                                 IConversationRepository conversationRepository,
                                 IWhisperRepository whisperRepository,
                                 IElevenLabRepository elevenLabRepository)
        {
            _context = context;
            _conversationRepository = conversationRepository;
            _whisperRepository = whisperRepository;
            _elevenLabRepository = elevenLabRepository;
        }

        public IConversationRepository Convers => _conversationRepository;
        public IElevenLabRepository ElevenLab => _elevenLabRepository;
        public IWhisperRepository Whisper => _whisperRepository;

        public async Task SaveAsync() => await _context.SaveChangesAsync();
    }
}
