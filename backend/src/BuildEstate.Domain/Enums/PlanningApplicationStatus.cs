namespace BuildEstate.Domain.Enums;

public enum PlanningApplicationStatus
{
    PreApplication = 1,
    Submitted = 2,
    Validated = 3,
    UnderReview = 4,
    CommitteeReview = 5,
    Approved = 6,
    ApprovedWithConditions = 7,
    Refused = 8,
    Appeal = 9,
    Withdrawn = 10
}
