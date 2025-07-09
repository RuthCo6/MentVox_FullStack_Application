using MentVox.Core.Interfaces;
using MentVox.Core.Models.ConversationModels;
using MentVox.Core.RepositoriesInterfaces;

public class ConversationService : IConversationService
{
    private readonly IRepositoryManager _repository;

    public ConversationService(IRepositoryManager repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<Conversation>> GetAllAsync()
    {
        return await _repository.Convers.GetAllAsync();
    }

    public async Task<Conversation> GetByIdAsync(int id)
    {
        return await _repository.Convers.GetByIdAsync(id);
    }

    public async Task CreateAsync(Conversation conversation)
    {
        await _repository.Convers.AddAsync(conversation);
        await _repository.SaveAsync();
    }

    public async Task UpdateAsync(Conversation conversation)
    {
        await _repository.Convers.UpdateAsync(conversation);
        await _repository.SaveAsync();
    }

    public async Task DeleteAsync(int id)
    {
        await _repository.Convers.DeleteAsync(id);
        await _repository.SaveAsync();
    }
}
