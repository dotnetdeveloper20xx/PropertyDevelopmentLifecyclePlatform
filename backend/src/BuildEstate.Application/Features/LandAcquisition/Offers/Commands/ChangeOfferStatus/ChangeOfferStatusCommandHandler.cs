using BuildEstate.Application.Features.LandAcquisition.Offers.DTOs;
using BuildEstate.Domain.Entities.LandAcquisition;
using BuildEstate.Domain.Enums;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Shared.Exceptions;
using MediatR;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Application.Features.LandAcquisition.Offers.Commands.ChangeOfferStatus;

/// <summary>
/// Handles offer status transitions with business rule enforcement.
/// </summary>
public class ChangeOfferStatusCommandHandler : IRequestHandler<ChangeOfferStatusCommand, OfferListItemDto>
{
    private readonly IRepository<Offer> _offerRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ILogger<ChangeOfferStatusCommandHandler> _logger;

    public ChangeOfferStatusCommandHandler(
        IRepository<Offer> offerRepository,
        IUnitOfWork unitOfWork,
        ILogger<ChangeOfferStatusCommandHandler> logger)
    {
        _offerRepository = offerRepository;
        _unitOfWork = unitOfWork;
        _logger = logger;
    }

    public async Task<OfferListItemDto> Handle(
        ChangeOfferStatusCommand request,
        CancellationToken cancellationToken)
    {
        var offer = await _offerRepository.GetByIdAsync(request.Id, cancellationToken)
            ?? throw new NotFoundException(nameof(Offer), request.Id);

        if (offer.OpportunityId != request.OpportunityId)
            throw new BadRequestException("Offer does not belong to the specified opportunity.");

        ValidateTransition(offer.Status, request.NewStatus);

        offer.Status = request.NewStatus;

        if (request.NewStatus == OfferStatus.CounterOffered && request.CounterOfferAmount.HasValue)
        {
            offer.CounterOfferAmount = request.CounterOfferAmount.Value;
        }

        if (!string.IsNullOrWhiteSpace(request.Notes))
        {
            offer.Notes = request.Notes;
        }

        await _offerRepository.UpdateAsync(offer, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        _logger.LogInformation(
            "Offer {OfferId} status changed to {NewStatus} for opportunity {OpportunityId}",
            offer.Id, request.NewStatus, offer.OpportunityId);

        return new OfferListItemDto
        {
            Id = offer.Id,
            OpportunityId = offer.OpportunityId,
            Amount = offer.Amount,
            Currency = offer.Currency,
            OfferDate = offer.OfferDate,
            ValidUntil = offer.ValidUntil,
            Status = offer.Status,
            CounterOfferAmount = offer.CounterOfferAmount,
            CreatedAt = offer.CreatedAt
        };
    }

    private static void ValidateTransition(OfferStatus current, OfferStatus next)
    {
        var validTransitions = new Dictionary<OfferStatus, OfferStatus[]>
        {
            [OfferStatus.UnderReview] = [OfferStatus.Accepted, OfferStatus.Rejected, OfferStatus.CounterOffered, OfferStatus.Withdrawn],
            [OfferStatus.CounterOffered] = [OfferStatus.Accepted, OfferStatus.Rejected, OfferStatus.Withdrawn],
            [OfferStatus.Accepted] = [],
            [OfferStatus.Rejected] = [],
            [OfferStatus.Withdrawn] = []
        };

        if (!validTransitions.TryGetValue(current, out var allowed) || !allowed.Contains(next))
        {
            throw new BadRequestException(
                $"Cannot transition offer from '{current}' to '{next}'.");
        }
    }
}
