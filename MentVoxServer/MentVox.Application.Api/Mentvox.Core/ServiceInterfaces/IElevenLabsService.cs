using MentVox.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.Interfaces
{
    public interface IElevenLabsService
    {
        Task<Stream> TextToSpeechAsync(string text);
        Task<byte[]> SynthesizeAudio(ElevenLabs request);

    }
}
