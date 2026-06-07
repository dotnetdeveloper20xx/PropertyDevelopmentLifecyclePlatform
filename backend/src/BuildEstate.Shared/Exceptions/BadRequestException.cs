namespace BuildEstate.Shared.Exceptions;

/// <summary>
/// Thrown when a request violates business rules or contains invalid data.
/// Mapped to HTTP 400 by the global exception handler.
/// </summary>
public class BadRequestException : Exception
{
    public BadRequestException(string message)
        : base(message)
    {
    }
}
