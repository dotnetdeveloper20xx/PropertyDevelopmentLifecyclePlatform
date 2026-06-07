using BuildEstate.Domain.Common;
using BuildEstate.Domain.Enums;

namespace BuildEstate.Domain.Entities.Contractors;

/// <summary>
/// Represents a contractor, subcontractor, consultant, or supplier in the database.
/// </summary>
public class Contractor : BaseEntity
{
    public string CompanyName { get; set; } = string.Empty;
    public ContractorType Type { get; set; }
    public ContractorStatus Status { get; set; } = ContractorStatus.Active;
    public string? ContactName { get; set; }
    public string? Email { get; set; }
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Trade { get; set; }
    public decimal? Rating { get; set; }
    public string? InsuranceDetails { get; set; }
    public DateTime? InsuranceExpiry { get; set; }
    public string? Certifications { get; set; }
    public string? Notes { get; set; }
}
