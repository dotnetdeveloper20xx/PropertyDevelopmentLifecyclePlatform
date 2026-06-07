using BuildEstate.Application.Features.Projects.Commands.ChangeProjectStatus;
using BuildEstate.Application.Features.Projects.Commands.CreateMilestone;
using BuildEstate.Application.Features.Projects.Commands.CreateProject;
using BuildEstate.Application.Features.Projects.Commands.CreateProjectRisk;
using BuildEstate.Application.Features.Projects.Commands.CreateProjectTask;
using BuildEstate.Application.Features.Projects.DTOs;
using BuildEstate.Application.Features.Projects.Queries.GetMilestonesByProject;
using BuildEstate.Application.Features.Projects.Queries.GetProjectById;
using BuildEstate.Application.Features.Projects.Queries.GetProjects;
using BuildEstate.Application.Features.Projects.Queries.GetRisksByProject;
using BuildEstate.Application.Features.Projects.Queries.GetTasksByProject;
using BuildEstate.Domain.Enums;
using BuildEstate.Shared.Models;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Projects;

[ApiController]
[Route("api/v1/projects")]
[Authorize]
[Produces("application/json")]
public class ProjectsController : ControllerBase
{
    private readonly IMediator _mediator;
    public ProjectsController(IMediator mediator) { _mediator = mediator; }

    [HttpGet]
    [Authorize(Roles = "SuperAdmin,ProjectManager,AcquisitionManager,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<List<ProjectListItemDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll([FromQuery] GetProjectsQuery query, CancellationToken ct)
    {
        return Ok(await _mediator.Send(query, ct));
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,AcquisitionManager,FinanceDirector")]
    [ProducesResponseType(typeof(ApiResponse<ProjectDetailDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        return Ok(ApiResponse<ProjectDetailDto>.Ok(await _mediator.Send(new GetProjectByIdQuery(id), ct)));
    }

    [HttpPost]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<CreateProjectDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> Create([FromBody] CreateProjectCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command, ct);
        return CreatedAtAction(nameof(GetById), new { id = result.Id },
            ApiResponse<CreateProjectDto>.Ok(result, "Project created successfully."));
    }

    [HttpPatch("{id:guid}/status")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> ChangeStatus(Guid id, [FromBody] ProjectStatusRequest request, CancellationToken ct)
    {
        await _mediator.Send(new ChangeProjectStatusCommand(id, request.NewStatus), ct);
        return NoContent();
    }

    // Milestones
    [HttpGet("{projectId:guid}/milestones")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<List<MilestoneDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetMilestones(Guid projectId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<MilestoneDto>>.Ok(await _mediator.Send(new GetMilestonesByProjectQuery(projectId), ct)));
    }

    [HttpPost("{projectId:guid}/milestones")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<MilestoneDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateMilestone(Guid projectId, [FromBody] CreateMilestoneCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ProjectId = projectId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<MilestoneDto>.Ok(result));
    }

    // Tasks
    [HttpGet("{projectId:guid}/tasks")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<List<ProjectTaskDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetTasks(Guid projectId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<ProjectTaskDto>>.Ok(await _mediator.Send(new GetTasksByProjectQuery(projectId), ct)));
    }

    [HttpPost("{projectId:guid}/tasks")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<ProjectTaskDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateTask(Guid projectId, [FromBody] CreateProjectTaskCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ProjectId = projectId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<ProjectTaskDto>.Ok(result));
    }

    // Risks
    [HttpGet("{projectId:guid}/risks")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,SiteManager")]
    [ProducesResponseType(typeof(ApiResponse<List<ProjectRiskDto>>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetRisks(Guid projectId, CancellationToken ct)
    {
        return Ok(ApiResponse<List<ProjectRiskDto>>.Ok(await _mediator.Send(new GetRisksByProjectQuery(projectId), ct)));
    }

    [HttpPost("{projectId:guid}/risks")]
    [Authorize(Roles = "SuperAdmin,ProjectManager")]
    [ProducesResponseType(typeof(ApiResponse<ProjectRiskDto>), StatusCodes.Status201Created)]
    public async Task<IActionResult> CreateRisk(Guid projectId, [FromBody] CreateProjectRiskCommand command, CancellationToken ct)
    {
        var result = await _mediator.Send(command with { ProjectId = projectId }, ct);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<ProjectRiskDto>.Ok(result));
    }
}

public record ProjectStatusRequest(ProjectStatus NewStatus);
