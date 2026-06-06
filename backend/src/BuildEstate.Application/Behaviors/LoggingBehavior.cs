using System.Diagnostics;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Behaviors;

/// <summary>
/// MediatR pipeline behavior that logs command/query execution with timing.
/// Provides observability into handler performance and helps production support
/// identify slow operations.
/// </summary>
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : notnull
{
    private readonly ILogger<LoggingBehavior<TRequest, TResponse>> _logger;

    public LoggingBehavior(ILogger<LoggingBehavior<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        var requestName = typeof(TRequest).Name;

        _logger.LogInformation("Handling {RequestName}", requestName);

        var stopwatch = Stopwatch.StartNew();

        var response = await next();

        stopwatch.Stop();

        if (stopwatch.ElapsedMilliseconds > 500)
        {
            _logger.LogWarning(
                "Long running request: {RequestName} took {ElapsedMilliseconds}ms",
                requestName, stopwatch.ElapsedMilliseconds);
        }
        else
        {
            _logger.LogInformation(
                "Handled {RequestName} in {ElapsedMilliseconds}ms",
                requestName, stopwatch.ElapsedMilliseconds);
        }

        return response;
    }
}
