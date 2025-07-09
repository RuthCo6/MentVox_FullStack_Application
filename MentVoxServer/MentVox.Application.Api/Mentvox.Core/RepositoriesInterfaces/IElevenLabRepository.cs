using MentVox.Core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Core.Repositories
{
    public interface IElevenLabRepository
    {
        Task SaveRequestAsync(ElevenLabs request); // זה כבר כולל את האודיו בתוכו
    }
}
