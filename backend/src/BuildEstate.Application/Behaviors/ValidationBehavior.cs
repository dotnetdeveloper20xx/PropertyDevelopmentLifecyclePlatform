using FluentValidation;
using MediatR;
using ValidationException = BuildEstate.Shared.Exceptions.ValidationException;

namespace BuildEstate.Application.Behaviors;

/// <summary>
/// MediatR pipeline behavior that automatically validates commands/queries
/// before they reach their handlers. If validation fails, a ValidationException
/// is thrown and handled by the global exception middleware.
/// </summary>
public class ValidationBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly IEnumerable<IValidator<TRequest>> _validators;

    public ValidationBehavior(IEnumerable<IValidator<TRequest>> validators)
    {
        _validators = validators;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!_validators.Any())
        {
            return await next();
        }

        var context = new ValidationContext<TRequest>(request);

        var validationResults = await Task.WhenAll(
            _validators.Select(v => v.ValidateAsync(context, cancellationToken)));

        var failures = validationResults
            .SelectMany(result => result.Errors)
            .Where(f => f != null)
            .Select(f => f.ErrorMessage)
            .Distinct()
            .ToList();

        if (failures.Count != 0)
        {
            throw new ValidationException(failures);
        }

        return await next();
    }
}
