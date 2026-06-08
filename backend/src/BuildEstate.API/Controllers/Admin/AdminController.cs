using BuildEstate.Domain.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace BuildEstate.API.Controllers.Admin;

[ApiController]
[Route("api/v1/admin")]
[Authorize(Roles = "SuperAdmin")]
[Produces("application/json")]
public class AdminController : ControllerBase
{
    private readonly IAuditLogQuery _auditLogQuery;

    public AdminController(IAuditLogQuery auditLogQuery)
    {
        _auditLogQuery = auditLogQuery;
    }

    [HttpGet("audit-logs")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAuditLogs(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 50,
        [FromQuery] string? entityName = null,
        [FromQuery] string? userId = null,
        CancellationToken ct = default)
    {
        var query = _auditLogQuery.Query();

        if (!string.IsNullOrWhiteSpace(entityName))
            query = query.Where(x => x.EntityName == entityName);

        if (!string.IsNullOrWhiteSpace(userId))
            query = query.Where(x => x.UserId == userId);

        var totalCount = await query.CountAsync(ct);

        var pageClamped = page > 0 ? page : 1;
        var pageSizeClamped = pageSize is > 0 and <= 100 ? pageSize : 50;

        var logs = await query
            .OrderByDescending(x => x.Timestamp)
            .Skip((pageClamped - 1) * pageSizeClamped)
            .Take(pageSizeClamped)
            .ToListAsync(ct);

        return Ok(new
        {
            success = true,
            data = logs,
            pagination = new
            {
                page = pageClamped,
                pageSize = pageSizeClamped,
                totalCount
            }
        });
    }
}
