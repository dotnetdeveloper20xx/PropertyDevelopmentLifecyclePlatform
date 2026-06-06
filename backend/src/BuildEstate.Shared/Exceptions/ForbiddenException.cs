namespace BuildEstate.Shared.Exceptions;

/// <summary>
/// Thrown when a user does not have permission to perform an action.
/// </summary>
public class ForbiddenException : Exception
{
    public ForbiddenException(string message = "You do not have permission to perform this action.")
        : base(message)
    {
    }
}
