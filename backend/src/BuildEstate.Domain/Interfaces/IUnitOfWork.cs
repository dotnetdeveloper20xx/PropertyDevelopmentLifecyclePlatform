namespace BuildEstate.Domain.Interfaces;

/// <summary>
/// Unit of Work pattern for coordinating multiple repository operations.
/// </summary>
public interface IUnitOfWork : IDisposable
{
    Task<int> SaveChangesAsync(CancellationToken cancellationToken = default);
}
