namespace BuildEstate.Shared.Models;

/// <summary>
/// Standard API response envelope for all endpoints.
/// </summary>
public class ApiResponse<T>
{
    public T? Data { get; set; }
    public bool Success { get; set; } = true;
    public string? Message { get; set; }
    public List<string> Errors { get; set; } = new();
    public PaginationMeta? Pagination { get; set; }

    public static ApiResponse<T> Ok(T data, string? message = null) => new()
    {
        Data = data,
        Success = true,
        Message = message
    };

    public static ApiResponse<T> Paginated(T data, PaginationMeta pagination) => new()
    {
        Data = data,
        Success = true,
        Pagination = pagination
    };

    public static ApiResponse<T> Fail(string error) => new()
    {
        Success = false,
        Errors = new List<string> { error }
    };

    public static ApiResponse<T> Fail(List<string> errors) => new()
    {
        Success = false,
        Errors = errors
    };
}
