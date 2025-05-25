using FriendlyNeighbourhoodLogger.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FriendlyNeighbourhoodLogger
{

    public class Media
    {
        public int Id { get; set; }

        [Required]
        public MediaType MediaType { get; set; }  

        [Required]
        public string MediaTitle { get; set; }

        public MediaStatus MediaStatus { get; set; } 

        public DateTime DateFinished { get; set; }

        [Required]
        [ForeignKey("User")]
        public string? UserId { get; set; } 
    }

}
