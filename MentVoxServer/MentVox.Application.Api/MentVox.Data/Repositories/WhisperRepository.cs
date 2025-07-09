using MentVox.Core.Models;
using MentVox.Core.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MentVox.Data.Repositories
{
    public class WhisperRepository : IWhisperRepository
    {
        private readonly List<Whisper> _db = new();

        public Task SaveAsync(Whisper whisper)
        {
            _db.Add(whisper);
            return Task.CompletedTask;
        }

        public Task<IEnumerable<Whisper>> GetAllAsync()
        {
            return Task.FromResult(_db.AsEnumerable());
        }

        public Task<Whisper> GetByTextAsync(string text)
        {
            return Task.FromResult(_db.FirstOrDefault(w => w.TranscribedText == text));
        }

        public Task DeleteAsync(string text)
        {
            var item = _db.FirstOrDefault(w => w.TranscribedText == text);
            if (item != null)
                _db.Remove(item);

            return Task.CompletedTask;
        }

        public Task UpdateAsync(Whisper updatedWhisper)
        {
            var existing = _db.FirstOrDefault(w => w.TranscribedText == updatedWhisper.TranscribedText);
            if (existing != null)
            {
                existing.AudioData = updatedWhisper.AudioData;
                existing.Language = updatedWhisper.Language;
            }
            return Task.CompletedTask;
        }
    }

}
