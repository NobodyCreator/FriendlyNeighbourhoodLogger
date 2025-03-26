using Microsoft.AspNetCore.Mvc;
using FriendlyNeighbourhoodLogger;

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

        [HttpPost]
        public IActionResult AddMedia([FromBody] Media media)
        {
            _context.Media.Add(media);
            _context.SaveChanges();
            return CreatedAtAction(nameof(GetAllMedia), new { id = media.Id }, media);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMedia(int id, [FromBody] Media updatedMedia)
        {
            var media = _context.Media.Find(id);
            if (media == null) return NotFound();

            media.Title = updatedMedia.Title;
            media.MediaType = updatedMedia.MediaType;
            media.MediaStatus = updatedMedia.MediaStatus;
            media.DateFinished = updatedMedia.DateFinished;

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