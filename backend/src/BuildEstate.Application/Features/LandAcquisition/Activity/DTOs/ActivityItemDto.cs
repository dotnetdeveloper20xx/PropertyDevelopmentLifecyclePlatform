namespace BuildEstate.Application.Features.LandAcquisition.Activity.DTOs;

/// <summary>
/// DTO for activity/audit trail items displayed in the UI timeline.
/// </summary>
public record ActivityItemDto
{
    public Guid Id { get; init; }
    public string Action { get; init; } = string.Empty;
    public string EntityName { get; init; } = string.Empty;
    public string EntityId { get; init; } = string.Empty;
    public string UserName { get; init; } = string.Empty;
    public DateTime Timestamp { get; init; }
    public string? AffectedColumns { get; init; }
    public string? OldValues { get; init; }
    public string? NewValues { get; init; }
}
