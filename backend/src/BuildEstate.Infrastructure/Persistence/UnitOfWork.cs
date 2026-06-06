using BuildEstate.Domain.Interfaces;

namespace BuildEstate.Infrastructure.Persistence;

/// <summary>
/// Unit of Work implementation that wraps the DbContext SaveChanges.
/// </summary>
public class UnitOfWork : IUnitOfWork
{
    private readonly BuildEstateDbContext _context;

    public UnitOfWork(BuildEstateDbContext context)
    {
        _context = context;
    }

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
