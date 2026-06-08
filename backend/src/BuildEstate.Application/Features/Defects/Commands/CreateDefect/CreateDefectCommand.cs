using BuildEstate.Application.Features.Defects.DTOs;
using BuildEstate.Domain.Enums;
using MediatR;

namespace BuildEstate.Application.Features.Defects.Commands.CreateDefect;

public record CreateDefectCommand : IRequest<DefectDto>
{
    public Guid? PropertyUnitId { get; init; }
    public Guid? ProjectId { get; init; }
    public string Title { get; init; } = string.Empty;
    public string? Description { get; init; }
    public string? Location { get; init; }
    public DefectPriority Priority { get; init; }
    public string? ReportedBy { get; init; }
    public bool UnderWarranty { get; init; }
    public string? WarrantyReference { get; init; }
    public string? Notes { get; init; }
}
