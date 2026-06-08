using BuildEstate.Application.Features.Design.DTOs;
using MediatR;

namespace BuildEstate.Application.Features.Design.Commands.CreateDesignPackage;

public record CreateDesignPackageCommand : IRequest<DesignPackageDto>
{
    public Guid ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Discipline { get; init; }
    public string? Consultant { get; init; }
    public string? ConsultantEmail { get; init; }
    public string? Notes { get; init; }
}
