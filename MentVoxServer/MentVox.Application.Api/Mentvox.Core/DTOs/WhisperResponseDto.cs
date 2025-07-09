using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.DTOs
{
    public class WhisperResponseDTO
    {
        public string Transcription { get; set; }
        public string TranscribedText { get; set; }
        public double Confidence { get; set; }
    }
}
