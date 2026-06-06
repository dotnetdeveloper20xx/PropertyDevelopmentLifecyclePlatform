using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;
using BuildEstate.Domain.Enums;

namespace BuildEstate.API.Controllers.LandAcquisition.Requests;

/// <summary>
/// Request body for the opportunity status change endpoint.
/// Contains the target status for the state machine transition.
/// </summary>
public record ChangeStatusRequest
{
    /// <summary>
    /// The target status to transition to. Must be a valid OpportunityStatus enum value.
    /// </summary>
    [Required(ErrorMessage = "NewStatus is required.")]
    [EnumDataType(typeof(OpportunityStatus), ErrorMessage = "NewStatus must be a valid OpportunityStatus value.")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public OpportunityStatus NewStatus { get; init; }
}
