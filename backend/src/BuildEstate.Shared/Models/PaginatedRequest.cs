namespace BuildEstate.Shared.Models;

/// <summary>
/// Base class for paginated, filterable, sortable requests.
/// </summary>
public class PaginatedRequest
{
    private int _page = 1;
    private int _pageSize = 20;

    public int Page
    {
        get => _page;
        set => _page = value < 1 ? 1 : value;
    }

    public int PageSize
    {
        get => _pageSize;
        set => _pageSize = value < 1 ? 1 : value > 100 ? 100 : value;
    }

    public string? SortBy { get; set; }
    public string SortDir { get; set; } = "asc";
    public string? Search { get; set; }
}
