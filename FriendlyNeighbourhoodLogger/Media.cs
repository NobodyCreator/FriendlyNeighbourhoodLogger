using FriendlyNeighbourhoodLogger.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FriendlyNeighbourhoodLogger
{

    public class Media
    {
        public int? MetadataId { get; set; }

        [ForeignKey("MetadataId")]
        public UnifiedMediaMetadata? Metadata { get; set; }


        public int Id { get; set; }

        [Required]
        public MediaType MediaType { get; set; }  

        public string? CoverImageUrl { get; set; }

        [Required]
        public required  string MediaTitle { get; set; }
        public string? Genres { get; set; }
        public string? Description { get; set; }

        public MediaStatus MediaStatus { get; set; }

        public DateTime? DateFinished { get; set; }

        [Required]
        [ForeignKey("User")]
        public string? UserId { get; set; } 
    }

}
