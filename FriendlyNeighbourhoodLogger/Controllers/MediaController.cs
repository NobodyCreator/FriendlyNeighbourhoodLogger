using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using FriendlyNeighbourhoodLogger;
using FriendlyNeighbourhoodLogger.Enums;

namespace FriendlyNeighbourhoodLogger.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class MediaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MediaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("all")]
        public IActionResult GetAllMedia()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var userMedia = _context.Media.Where(m => m.UserId == userId).ToList();
            return Ok(userMedia);
        }


        [HttpGet("filtered")]
        public IActionResult GetFilteredMedia([FromQuery] string? mediaType, [FromQuery] string? mediaStatus, [FromQuery] string? mediaTitle)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var query = _context.Media.Where(m => m.UserId == userId).AsQueryable();

            if (!string.IsNullOrEmpty(mediaType) && Enum.TryParse<MediaType>(mediaType, true, out var parsedMediaType))
            {
                query = query.Where(m => m.MediaType == parsedMediaType);
            }
            if (!string.IsNullOrEmpty(mediaStatus) && Enum.TryParse<MediaStatus>(mediaStatus, true, out var parsedMediaStatus))
            {
                query = query.Where(m => m.MediaStatus == parsedMediaStatus);
            }
            if (!string.IsNullOrEmpty(mediaTitle))
            {
                query = query.Where(m => m.MediaTitle.Contains(mediaTitle));
            }

            return Ok(query.ToList());



        }


        [HttpPost("add")]
        public IActionResult AddMedia([FromBody] Media media)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            if (!ModelState.IsValid) return BadRequest(ModelState);

            media.UserId = userId; // Associate media with authenticated user
            _context.Media.Add(media);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAllMedia), new { id = media.Id }, media);

        }

        [HttpPut("{id}")]
        public IActionResult UpdateMedia(int id, [FromBody] Media updatedMedia)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var media = _context.Media.FirstOrDefault(m => m.Id == id && m.UserId == userId);
            if (media == null) return NotFound();

            // Update fields only if provided
            media.MediaTitle = updatedMedia.MediaTitle ?? media.MediaTitle;
            media.MediaType = updatedMedia.MediaType != default ? updatedMedia.MediaType : media.MediaType;
            media.MediaStatus = updatedMedia.MediaStatus != default ? updatedMedia.MediaStatus : media.MediaStatus;
            media.DateFinished = updatedMedia.DateFinished != DateTime.MinValue ? updatedMedia.DateFinished : media.DateFinished;

            _context.SaveChanges();
            return NoContent();
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteMedia(int id)
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (string.IsNullOrEmpty(userId)) return Unauthorized();

            var media = _context.Media.FirstOrDefault(m => m.Id == id && m.UserId == userId);
            if (media == null) return NotFound();

            _context.Media.Remove(media);
            _context.SaveChanges();
            return NoContent();
        }

    }
}