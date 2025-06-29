using Microsoft.AspNetCore.Mvc;
using FriendlyNeighbourhoodLogger;
using FriendlyNeighbourhoodLogger.Services;
using FriendlyNeighbourhoodLogger.Enums;

namespace FriendlyNeighbourhoodLogger.Controllers
{
    [ApiController]
    [Route("api/media")]
    public class MediaController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly MetadataService _metadataService;

        public MediaController(AppDbContext context, MetadataService metadataService)
        {
            _context = context;
            _metadataService = metadataService;

        }

        [HttpGet("all")]
        public IActionResult GetAllMedia()
        {
            var userMedia = _context.Media
                .Select(m => new
                {
                    m.Id,
                    m.MediaTitle,
                    m.MediaType,
                    m.MediaStatus,
                    m.DateStarted,
                    m.DateFinished,
                    Metadata = m.Metadata != null
                        ? new
                        {
                            m.Metadata.Title,
                            m.Metadata.Description,
                            m.Metadata.CoverImageUrl,
                            m.Metadata.Genres,
                            m.Metadata.DataSource,
                            m.Metadata.ExternalMediaId
                        }
                        : null
                }).ToList();

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
        public async Task<IActionResult> AddMedia([FromBody] Media media)
        {
            // This assumes frontend sends ExternalMediaId + DataSource + fallback metadata fields
            if (media.Metadata != null)
            {
                var metadata = await _metadataService.GetOrAddMetadataAsync(
                    media.Metadata.ExternalMediaId,
                    media.Metadata.DataSource,
                    new UnifiedMediaMetadata
                    {
                        ExternalMediaId = media.Metadata.ExternalMediaId,
                        DataSource = media.Metadata.DataSource,
                        Title = media.Metadata.Title,
                        Description = media.Metadata.Description,
                        CoverImageUrl = media.Metadata.CoverImageUrl,
                        Genres = media.Metadata.Genres
                    });

                media.MetadataId = metadata.Id;
            }

            _context.Media.Add(media);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetAllMedia), new { id = media.Id }, media);
        }


        //  Remove this entire validation block:
        // if (!Enum.TryParse<MediaType>(media.MediaType.ToString(), true, out var parsedMediaType))
        // {
        //     return BadRequest("Invalid MediaType...");
        // }

        // This is no longer needed as it's redundant:
        // media.MediaType = parsedMediaType;



        [HttpPut("{id}")]
        public IActionResult UpdateMedia(int id, [FromBody] Media updatedMedia)
        {
            var media = _context.Media.FirstOrDefault(m => m.Id == id);
            if (media == null) return NotFound();

            media.MediaTitle = updatedMedia.MediaTitle ?? media.MediaTitle;
            media.MediaType = updatedMedia.MediaType != default ? updatedMedia.MediaType : media.MediaType;
            media.MediaStatus = updatedMedia.MediaStatus;
            media.DateFinished = updatedMedia.DateFinished != DateTime.MinValue ? updatedMedia.DateFinished : media.DateFinished;
            media.DateStarted = updatedMedia.DateStarted != DateTime.MinValue ? updatedMedia.DateStarted : media.DateStarted;


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
