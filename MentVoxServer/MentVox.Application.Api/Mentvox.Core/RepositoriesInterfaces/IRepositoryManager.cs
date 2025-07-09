using MentVox.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.RepositoriesInterfaces
{
    public interface IRepositoryManager
    {
        public IConversationRepository Convers { get; }

        public IElevenLabRepository ElevenLab { get; }

        public IWhisperRepository Whisper { get; }

        Task SaveAsync();

    }
    
}
