namespace BuildEstate.Shared.Exceptions;

/// <summary>
/// Thrown when request validation fails.
/// </summary>
public class ValidationException : Exception
{
    public ValidationException(IEnumerable<string> errors)
        : base("One or more validation errors occurred.")
    {
        Errors = errors.ToList();
    }

    public List<string> Errors { get; }
}
