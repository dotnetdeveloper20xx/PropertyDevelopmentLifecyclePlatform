using System.Net;
using System.Text.Json;
using BuildEstate.Shared.Exceptions;
using BuildEstate.Shared.Models;

namespace BuildEstate.API.Middleware;

/// <summary>
/// Global exception handling middleware that returns consistent error responses.
/// </summary>
public class GlobalExceptionHandler
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(RequestDelegate next, ILogger<GlobalExceptionHandler> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var (statusCode, response) = exception switch
        {
            NotFoundException notFound => (
                HttpStatusCode.NotFound,
                ApiResponse<object>.Fail(notFound.Message)
            ),
            ValidationException validation => (
                HttpStatusCode.BadRequest,
                ApiResponse<object>.Fail(validation.Errors)
            ),
            ForbiddenException forbidden => (
                HttpStatusCode.Forbidden,
                ApiResponse<object>.Fail(forbidden.Message)
            ),
            _ => (
                HttpStatusCode.InternalServerError,
                ApiResponse<object>.Fail("An internal server error occurred.")
            )
        };

        context.Response.StatusCode = (int)statusCode;

        var json = JsonSerializer.Serialize(response, new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });

        await context.Response.WriteAsync(json);
    }
}
