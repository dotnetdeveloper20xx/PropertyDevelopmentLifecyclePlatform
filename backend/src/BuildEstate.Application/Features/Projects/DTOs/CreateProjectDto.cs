namespace BuildEstate.Application.Features.Projects.DTOs;
public record CreateProjectDto
{
    public Guid Id { get; init; }
    public string ProjectReference { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public DateTime CreatedAt { get; init; }
}
