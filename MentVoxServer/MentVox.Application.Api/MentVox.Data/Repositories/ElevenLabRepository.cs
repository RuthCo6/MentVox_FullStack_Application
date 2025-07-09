using MentVox.Core.Models;
using MentVox.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Data.Repositories
{
    public class ElevenLabRepository : IElevenLabRepository
    {
        private readonly ApplicationDbContext _context;

        public ElevenLabRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task SaveRequestAsync(ElevenLabs request)
        {
            await _context.Set<ElevenLabs>().AddAsync(request);
        }
    }
}
