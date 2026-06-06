using BuildEstate.Application.Features.LandAcquisition.Offers.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.Offers.Commands.CreateOffer;

/// <summary>
/// Handles creation of a new offer on a land opportunity.
/// Business rule: Only one active (UnderReview) offer per opportunity at a time.
/// </summary>
public class CreateOfferCommandHandler : IRequestHandler<CreateOfferCommand, OfferListItemDto>
{
    private readonly IRepository<LandOpportunity> _opportunityRepository;
    private readonly IRepository<Offer> _offerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<CreateOfferCommandHandler> _logger;

    public CreateOfferCommandHandler(
        IRepository<LandOpportunity> opportunityRepository,
        IRepository<Offer> offerRepository,
        IUnitOfWork unitOfWork,
        ILogger<CreateOfferCommandHandler> logger)
    {
        _opportunityRepository = opportunityRepository;
        _offerRepository = offerRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<OfferListItemDto> Handle(CreateOfferCommand request, CancellationToken cancellationToken)
    {
        // Validate parent opportunity exists
        var opportunityExists = await _opportunityRepository.ExistsAsync(
            x => x.Id == request.OpportunityId, cancellationToken);

        if (!opportunityExists)
        {
            throw new NotFoundException(nameof(LandOpportunity), request.OpportunityId);
        }

        // Business rule: only one active offer at a time
        var hasActiveOffer = await _offerRepository.Query()
            .AnyAsync(x => x.OpportunityId == request.OpportunityId
                && x.Status == OfferStatus.UnderReview, cancellationToken);

        if (hasActiveOffer)
        {
            throw new ValidationException(new[]
            {
                "An active offer already exists for this opportunity. Withdraw or resolve it before creating a new one."
            });
        }

        var entity = new Offer
        {
            OpportunityId = request.OpportunityId,
            Amount = request.Amount,
            Currency = request.Currency,
            OfferDate = DateTime.UtcNow,
            ValidUntil = request.ValidUntil,
            Status = OfferStatus.UnderReview,
            Conditions = request.Conditions,
            Notes = request.Notes
        };

        await _offerRepository.AddAsync(entity, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Offer {OfferId} of {Amount} {Currency} created for opportunity {OpportunityId}",
            entity.Id, entity.Amount, entity.Currency, entity.OpportunityId);

        return new OfferListItemDto
        {
            Id = entity.Id,
            OpportunityId = entity.OpportunityId,
            Amount = entity.Amount,
            Currency = entity.Currency,
            OfferDate = entity.OfferDate,
            ValidUntil = entity.ValidUntil,
            Status = entity.Status,
            CreatedAt = entity.CreatedAt
        };
    }
}
