using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace BuildEstate.API.Controllers.Documents;

/// <summary>
/// Handles file upload operations. Stores files to local disk in development.
/// In production, this would be replaced with Azure Blob Storage or S3.
/// </summary>
[ApiController]
[Route("api/v1/files")]
[Authorize]
public class FileUploadController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    private readonly ILogger<FileUploadController> _logger;

    public FileUploadController(IWebHostEnvironment env, ILogger<FileUploadController> logger)
    {
        _env = env;
        _logger = logger;
    }

    /// <summary>
    /// Upload a file. Returns the stored path and metadata.
    /// Max size: 50MB. Allowed types: PDF, DOCX, XLSX, PNG, JPG, DWG.
    /// </summary>
    [HttpPost("upload")]
    [Authorize(Roles = "SuperAdmin,ProjectManager,LegalOfficer,Admin")]
    [RequestSizeLimit(52_428_800)] // 50MB
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Upload(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { success = false, errors = new[] { "No file provided." } });

        var allowedExtensions = new[] { ".pdf", ".docx", ".xlsx", ".png", ".jpg", ".jpeg", ".dwg", ".csv" };
        var extension = Path.GetExtension(file.FileName).ToLowerInvariant();

        if (!allowedExtensions.Contains(extension))
            return BadRequest(new { success = false, errors = new[] { $"File type '{extension}' is not allowed. Allowed: {string.Join(", ", allowedExtensions)}" } });

        // Store in uploads directory
        var uploadsDir = Path.Combine(_env.ContentRootPath, "uploads", DateTime.UtcNow.ToString("yyyy-MM"));
        Directory.CreateDirectory(uploadsDir);

        var uniqueFileName = $"{Guid.NewGuid()}{extension}";
        var filePath = Path.Combine(uploadsDir, uniqueFileName);

        await using var stream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(stream);

        _logger.LogInformation("File uploaded: {FileName} → {StoredPath} ({Size} bytes)",
            file.FileName, filePath, file.Length);

        return Ok(new
        {
            success = true,
            data = new
            {
                fileName = file.FileName,
                storedFileName = uniqueFileName,
                filePath = $"/uploads/{DateTime.UtcNow:yyyy-MM}/{uniqueFileName}",
                fileSizeBytes = file.Length,
                contentType = file.ContentType
            }
        });
    }
}
