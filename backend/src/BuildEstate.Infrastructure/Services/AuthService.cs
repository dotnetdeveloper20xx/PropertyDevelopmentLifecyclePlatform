using BuildEstate.Application.Features.Auth.DTOs;
using BuildEstate.Application.Interfaces;
using BuildEstate.Domain.Entities.Identity;
using BuildEstate.Domain.Interfaces;
using BuildEstate.Infrastructure.Identity;
using BuildEstate.Shared.Exceptions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace BuildEstate.Infrastructure.Services;

/// <summary>
/// Implementation of IAuthService using ASP.NET Identity and JWT tokens.
/// Lives in Infrastructure because it depends on Identity (external framework).
/// 
/// Security measures implemented:
/// - Generic error messages (prevents user enumeration)
/// - Account lockout on repeated failures
/// - Refresh token rotation (one-time use)
/// - Token reuse detection (revokes all user tokens)
/// - IP address tracking on refresh tokens
/// </summary>
public class AuthService : IAuthService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly SignInManager<ApplicationUser> _signInManager;
    private readonly IJwtTokenService _jwtTokenService;
    private readonly IRepository<RefreshToken> _refreshTokenRepository;
    private readonly IUnitOfWork _unitOfWork;
    private readonly ICurrentUserService _currentUserService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(
        UserManager<ApplicationUser> userManager,
        SignInManager<ApplicationUser> signInManager,
        IJwtTokenService jwtTokenService,
        IRepository<RefreshToken> refreshTokenRepository,
        IUnitOfWork unitOfWork,
        ICurrentUserService currentUserService,
        ILogger<AuthService> logger)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _jwtTokenService = jwtTokenService;
        _refreshTokenRepository = refreshTokenRepository;
        _unitOfWork = unitOfWork;
        _currentUserService = currentUserService;
        _logger = logger;
    }

    public async Task<AuthResponseDto> LoginAsync(string email, string password, CancellationToken cancellationToken = default)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user is null || !user.IsActive)
        {
            _logger.LogWarning("Failed login attempt for email {Email}", email);
            throw new ForbiddenException("Invalid email or password.");
        }

        var signInResult = await _signInManager.CheckPasswordSignInAsync(user, password, lockoutOnFailure: true);

        if (signInResult.IsLockedOut)
        {
            _logger.LogWarning("Account locked out for user {UserId}", user.Id);
            throw new ForbiddenException("Account is locked. Please try again later.");
        }

        if (!signInResult.Succeeded)
        {
            _logger.LogWarning("Failed login attempt for user {UserId}", user.Id);
            throw new ForbiddenException("Invalid email or password.");
        }

        var roles = await _userManager.GetRolesAsync(user);
        var response = await GenerateAuthResponseAsync(user, roles, cancellationToken);

        user.LastLoginAt = DateTime.UtcNow;
        await _userManager.UpdateAsync(user);

        _logger.LogInformation("User {UserId} logged in successfully", user.Id);

        return response;
    }

    public async Task<AuthResponseDto> RegisterAsync(
        string email, string password, string firstName, string lastName, string? role,
        CancellationToken cancellationToken = default)
    {
        var existingUser = await _userManager.FindByEmailAsync(email);
        if (existingUser is not null)
        {
            throw new ValidationException(new[] { "An account with this email already exists." });
        }

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            EmailConfirmed = true,
            IsActive = true
        };

        var createResult = await _userManager.CreateAsync(user, password);
        if (!createResult.Succeeded)
        {
            var errors = createResult.Errors.Select(e => e.Description).ToList();
            throw new ValidationException(errors);
        }

        var assignedRole = role ?? "Admin";
        await _userManager.AddToRoleAsync(user, assignedRole);

        var roles = new List<string> { assignedRole };
        var response = await GenerateAuthResponseAsync(user, roles, cancellationToken);

        _logger.LogInformation("User {UserId} registered with role {Role}", user.Id, assignedRole);

        return response;
    }

    public async Task<AuthResponseDto> RefreshTokenAsync(string refreshToken, CancellationToken cancellationToken = default)
    {
        var existingToken = await _refreshTokenRepository.Query()
            .FirstOrDefaultAsync(x => x.Token == refreshToken, cancellationToken);

        if (existingToken is null)
        {
            throw new ForbiddenException("Invalid refresh token.");
        }

        // Token reuse detection
        if (existingToken.IsRevoked)
        {
            _logger.LogWarning("Refresh token reuse detected for user {UserId}", existingToken.UserId);

            var allUserTokens = await _refreshTokenRepository.Query()
                .Where(x => x.UserId == existingToken.UserId && !x.IsRevoked)
                .ToListAsync(cancellationToken);

            foreach (var token in allUserTokens)
            {
                token.IsRevoked = true;
                token.RevokedAt = DateTime.UtcNow;
                token.RevokedReason = "Token reuse detected";
                await _refreshTokenRepository.UpdateAsync(token, cancellationToken);
            }

            await _unitOfWork.SaveChangesAsync(cancellationToken);
            throw new ForbiddenException("Token has been revoked. Please login again.");
        }

        if (existingToken.IsExpired)
        {
            throw new ForbiddenException("Refresh token has expired. Please login again.");
        }

        var user = await _userManager.FindByIdAsync(existingToken.UserId);
        if (user is null || !user.IsActive)
        {
            throw new ForbiddenException("User account is not active.");
        }

        // Revoke current token (rotation)
        existingToken.IsRevoked = true;
        existingToken.RevokedAt = DateTime.UtcNow;
        existingToken.RevokedReason = "Replaced by new token";

        var roles = await _userManager.GetRolesAsync(user);
        var newRefreshTokenValue = _jwtTokenService.GenerateRefreshToken();
        existingToken.ReplacedByToken = newRefreshTokenValue;
        await _refreshTokenRepository.UpdateAsync(existingToken, cancellationToken);

        // Create new refresh token
        var newRefreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = newRefreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IpAddress = _currentUserService.IpAddress
        };

        await _refreshTokenRepository.AddAsync(newRefreshToken, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email!, roles);

        _logger.LogInformation("Refresh token rotated for user {UserId}", user.Id);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = newRefreshTokenValue,
            AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = MapToUserInfo(user, roles)
        };
    }

    public async Task<UserInfoDto> GetCurrentUserAsync(CancellationToken cancellationToken = default)
    {
        var userId = _currentUserService.UserId;
        if (string.IsNullOrEmpty(userId))
        {
            throw new ForbiddenException("User is not authenticated.");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user is null || !user.IsActive)
        {
            throw new NotFoundException("User", userId);
        }

        var roles = await _userManager.GetRolesAsync(user);
        return MapToUserInfo(user, roles);
    }

    private async Task<AuthResponseDto> GenerateAuthResponseAsync(
        ApplicationUser user, IList<string> roles, CancellationToken cancellationToken)
    {
        var accessToken = _jwtTokenService.GenerateAccessToken(user.Id, user.Email!, roles);
        var refreshTokenValue = _jwtTokenService.GenerateRefreshToken();

        var refreshToken = new RefreshToken
        {
            UserId = user.Id,
            Token = refreshTokenValue,
            ExpiresAt = DateTime.UtcNow.AddDays(7),
            IpAddress = _currentUserService.IpAddress
        };

        await _refreshTokenRepository.AddAsync(refreshToken, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return new AuthResponseDto
        {
            AccessToken = accessToken,
            RefreshToken = refreshTokenValue,
            AccessTokenExpiresAt = DateTime.UtcNow.AddMinutes(60),
            User = MapToUserInfo(user, roles)
        };
    }

    private static UserInfoDto MapToUserInfo(ApplicationUser user, IList<string> roles)
    {
        return new UserInfoDto
        {
            Id = user.Id,
            Email = user.Email!,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Roles = roles.ToList()
        };
    }
}
