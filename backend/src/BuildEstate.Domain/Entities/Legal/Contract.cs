using BuildEstate.Domain.Common;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Legal;

/// <summary>
/// Represents a legal contract (sale & purchase, option agreement, etc.)
/// linked to a land opportunity.
/// </summary>
public class Contract : BaseEntity
{
    public Guid OpportunityId { get; set; }
    public string Title { get; set; } = string.Empty;
    public ContractType ContractType { get; set; }
    public ContractStatus Status { get; set; } = ContractStatus.Draft;
    public string ContractReference { get; set; } = string.Empty;
    public string CounterpartyName { get; set; } = string.Empty;
    public string? CounterpartyContact { get; set; }
    public decimal? ContractValue { get; set; }
    public string Currency { get; set; } = "GBP";
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public DateTime? ExchangeDate { get; set; }
    public DateTime? CompletionDate { get; set; }
    public string? Solicitor { get; set; }
    public string? SolicitorFirm { get; set; }
    public string? SolicitorEmail { get; set; }
    public string? KeyTerms { get; set; }
    public string? Notes { get; set; }

    // Navigation properties
    public LandOpportunity Opportunity { get; set; } = null!;
    public ICollection<LegalDocument> Documents { get; set; } = new List<LegalDocument>();
    public ICollection<LegalTask> Tasks { get; set; } = new List<LegalTask>();
}
