namespace BuildEstate.Application.Features.Planning.Applications.DTOs;

public record CreatePlanningApplicationDto
{
    public Guid Id { get; init; }
    public string ApplicationReference { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}
