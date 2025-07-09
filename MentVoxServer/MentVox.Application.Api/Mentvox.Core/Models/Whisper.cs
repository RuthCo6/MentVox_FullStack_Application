using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.Models
{
    public class Whisper
    {
        public byte[] AudioData { get; set; }
        public string Language { get; set; }
        public string TranscribedText { get; set; }
    }
}
