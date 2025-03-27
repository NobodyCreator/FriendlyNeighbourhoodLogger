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

            media.Title = updatedMedia.Title ?? media.Title;
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