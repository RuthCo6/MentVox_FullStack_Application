using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.Models
{
    public class ElevenLabs
    {
        public string TextToSynthesize { get; set; }
        public string Voice { get; set; }
        public byte[] SynthesizedAudio { get; set; }
        public string AudioFormat { get; set; }
    }

}
