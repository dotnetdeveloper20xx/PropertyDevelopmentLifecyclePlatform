namespace BuildEstate.API.Middleware;

/// <summary>
/// Middleware that ensures every HTTP request has a unique correlation ID.
/// If the client sends an X-Correlation-ID header, it is used. Otherwise,
/// a new GUID is generated. The correlation ID is added to the response
/// headers and made available throughout the request pipeline via HttpContext.Items.
/// </summary>
public class CorrelationIdMiddleware
{
    private const string CorrelationIdHeader = "X-Correlation-ID";
    private readonly RequestDelegate _next;

    public CorrelationIdMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        var correlationId = GetOrCreateCorrelationId(context);

        // Store in HttpContext.Items for access throughout the request
        context.Items["CorrelationId"] = correlationId;

        // Add to response headers for client traceability
        context.Response.OnStarting(() =>
        {
            context.Response.Headers[CorrelationIdHeader] = correlationId;
            return Task.CompletedTask;
        });

        // Add to logging scope so all log entries include the correlation ID
        using (context.RequestServices.GetRequiredService<ILoggerFactory>()
            .CreateLogger("CorrelationId")
            .BeginScope(new Dictionary<string, object> { ["CorrelationId"] = correlationId }))
        {
            await _next(context);
        }
    }

    private static string GetOrCreateCorrelationId(HttpContext context)
    {
        if (context.Request.Headers.TryGetValue(CorrelationIdHeader, out var existingId)
            && !string.IsNullOrWhiteSpace(existingId))
        {
            return existingId.ToString();
        }

        return Guid.NewGuid().ToString("N");
    }
}
