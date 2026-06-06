using FluentValidation;

namespace BuildEstate.Application.Features.LandAcquisition.Opportunities.Queries.GetOpportunities;

/// <summary>
/// Validates GetOpportunitiesQuery before handler execution.
/// Ensures pagination, sorting, and filter parameters are within acceptable bounds.
/// </summary>
public class GetOpportunitiesQueryValidator : AbstractValidator<GetOpportunitiesQuery>
{
    private static readonly string[] AllowedSortFields =
    {
        "name", "location", "landsize", "askingprice", "status", "createdat"
    };

    private static readonly string[] AllowedSortDirections = { "asc", "desc" };

    public GetOpportunitiesQueryValidator()
    {
        RuleFor(x => x.Page)
            .GreaterThanOrEqualTo(1)
            .When(x => x.Page.HasValue)
            .WithMessage("Page must be 1 or greater.");

        RuleFor(x => x.PageSize)
            .InclusiveBetween(1, 100)
            .When(x => x.PageSize.HasValue)
            .WithMessage("PageSize must be between 1 and 100.");

        RuleFor(x => x.SortBy)
            .Must(sortBy => AllowedSortFields.Contains(sortBy!.ToLower()))
            .When(x => !string.IsNullOrWhiteSpace(x.SortBy))
            .WithMessage($"SortBy must be one of: {string.Join(", ", AllowedSortFields)}.");

        RuleFor(x => x.SortDir)
            .Must(dir => AllowedSortDirections.Contains(dir!.ToLower()))
            .When(x => !string.IsNullOrWhiteSpace(x.SortDir))
            .WithMessage("SortDir must be 'asc' or 'desc'.");

        RuleFor(x => x.Search)
            .MaximumLength(200)
            .When(x => !string.IsNullOrWhiteSpace(x.Search))
            .WithMessage("Search term cannot exceed 200 characters.");
    }
}
