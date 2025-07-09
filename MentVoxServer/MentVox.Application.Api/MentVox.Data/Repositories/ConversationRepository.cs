using MentVox.Core.Models.ConversationModels;
using MentVox.Core.Repositories;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Data.Repositories
{
    public class ConversationRepository : IConversationRepository
    {
        private readonly ApplicationDbContext _context;

        public ConversationRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Conversation>> GetAllAsync()
        {
            return await _context.Conversations.ToListAsync();
        }

        public async Task<Conversation> GetByIdAsync(int id)
        {
            return await _context.Conversations.FindAsync(id);
        }

        public async Task AddAsync(Conversation conversation)
        {
            await _context.Conversations.AddAsync(conversation);
            await _context.SaveChangesAsync();
        }

        public async Task UpdateAsync(Conversation conversation)
        {
            _context.Conversations.Update(conversation);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var conv = await _context.Conversations.FindAsync(id);
            if (conv != null)
            {
                _context.Conversations.Remove(conv);
                await _context.SaveChangesAsync();
            }
        }
    }
}
