using Microsoft.AspNetCore.Mvc;
using FriendlyNeighbourhoodLogger;
using FriendlyNeighbourhoodLogger.Enums;

namespace FriendlyNeighbourhoodLogger.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MediaController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MediaController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetAllMedia()
        {
            return Ok(_context.Media.ToList());
        }

        [HttpGet]
        public IActionResult GetFilteredMedia([FromQuery] string? mediaType, [FromQuery] string? mediaStatus, [FromQuery] string? mediaTitle)
        {
            var query = _context.Media.AsQueryable();

            // converts to string query parametrs into enums
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


        [HttpPost]
        public IActionResult AddMedia([FromBody] Media media)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            _context.Media.Add(media);
            _context.SaveChanges();

            return CreatedAtAction(nameof(GetAllMedia), new { id = media.Id }, media);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMedia(int id, [FromBody] Media updatedMedia)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState); 
            }

            var media = _context.Media.Find(id);
            if (media == null) return NotFound();

            media.MediaTitle = updatedMedia.MediaTitle ?? media.MediaTitle;
            media.MediaType = updatedMedia.MediaType != default ? updatedMedia.MediaType : media.MediaType;
            media.MediaStatus = updatedMedia.MediaStatus != default ? updatedMedia.MediaStatus : media.MediaStatus;
            media.DateFinished = updatedMedia.DateFinished != DateTime.MinValue
                ? updatedMedia.DateFinished
                : media.DateFinished;

            _context.SaveChanges();

            return NoContent();
        }


        [HttpDelete("{id}")]
        public IActionResult DeleteMedia(int id)
        {
            var media = _context.Media.Find(id);
            if (media == null) return NotFound();

            _context.Media.Remove(media);
            _context.SaveChanges();
            return NoContent();
        }
    }
}