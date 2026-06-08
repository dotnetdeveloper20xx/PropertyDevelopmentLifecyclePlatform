using BuildEstate.Application.Features.Design.DTOs;
using BuildEstate.Domain.Entities.Design;
using BuildEstate.Domain.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.Application.Features.Design.Queries.GetDesignPackagesByProject;

public class GetDesignPackagesByProjectQueryHandler : IRequestHandler<GetDesignPackagesByProjectQuery, List<DesignPackageDto>>
{
    private readonly IRepository<DesignPackage> _repository;

    public GetDesignPackagesByProjectQueryHandler(IRepository<DesignPackage> repository)
    {
        _repository = repository;
    }

    public async Task<List<DesignPackageDto>> Handle(GetDesignPackagesByProjectQuery request, CancellationToken cancellationToken)
    {
        return await _repository.Query()
            .AsNoTracking()
            .Where(x => x.ProjectId == request.ProjectId)
            .OrderByDescending(x => x.CreatedAt)
            .Select(x => new DesignPackageDto
            {
                Id = x.Id,
                ProjectId = x.ProjectId,
                Title = x.Title,
                Description = x.Description,
                Discipline = x.Discipline,
                Status = x.Status,
                Consultant = x.Consultant,
                ConsultantEmail = x.ConsultantEmail,
                Version = x.Version,
                SubmittedDate = x.SubmittedDate,
                ApprovedDate = x.ApprovedDate,
                ApprovedBy = x.ApprovedBy,
                Notes = x.Notes,
                CreatedAt = x.CreatedAt
            })
            .ToListAsync(cancellationToken);
    }
}
