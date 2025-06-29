using System.ComponentModel.DataAnnotations;

namespace FriendlyNeighbourhoodLogger
{
    public class UnifiedMediaMetadata
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int ExternalMediaId { get; set; } // e.g. IGDB, TMDB ID

        [Required]
        public required string DataSource { get; set; }

        [Required]
        public required string Title { get; set; }

        public string? Description { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Genres { get; set; }
        public DateTime LastFetched { get; set; }
    }

}
