using Microsoft.AspNetCore.Mvc;
using FriendlyNeighbourhoodLogger;
using FriendlyNeighbourhoodLogger.Enums;

namespace FriendlyNeighbourhoodLogger.Controllers
{
    [ApiController]
    [Route("api/media")]
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
            var userMedia = _context.Media.ToList(); 
            return Ok(userMedia);
        }

        [HttpGet("filtered")]
        public IActionResult GetFilteredMedia([FromQuery] string? mediaType, [FromQuery] string? mediaStatus, [FromQuery] string? mediaTitle)
        {
            var query = _context.Media.AsQueryable(); 
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
            //  Remove this entire validation block:
            // if (!Enum.TryParse<MediaType>(media.MediaType.ToString(), true, out var parsedMediaType))
            // {
            //     return BadRequest("Invalid MediaType...");
            // }

            // This is no longer needed as it's redundant:
            // media.MediaType = parsedMediaType;

            _context.Media.Add(media);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAllMedia), new { id = media.Id }, media);
        }



        [HttpPut("{id}")]
        public IActionResult UpdateMedia(int id, [FromBody] Media updatedMedia)
        {
            var media = _context.Media.FirstOrDefault(m => m.Id == id);
            if (media == null) return NotFound();

            // Update only provided fields
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
            var media = _context.Media.FirstOrDefault(m => m.Id == id);
            if (media == null) return NotFound();

            _context.Media.Remove(media);
            _context.SaveChanges();
            return NoContent();
        }
    }
}