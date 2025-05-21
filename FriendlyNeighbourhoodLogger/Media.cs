using FriendlyNeighbourhoodLogger.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FriendlyNeighbourhoodLogger
{

    public class Media
    {
        public int Id { get; set; }
        [Required]
        [RegularExpression("^(Movie|Show|Book|Game)$", ErrorMessage = "Invalid MediaType. Movie,Show,Book,Game")]
        public MediaType MediaType { get; set; } //important

        [Required]
        [RegularExpression("^(Finished|Started|Backlogged|Skipped|Completed|Refunded)$", ErrorMessage = "Invalid MediaStatus. Finished,Started,Backlogged,Skipped,Completed,Refunded")]
        public required string MediaTitle { get; set; }//important
        public MediaStatus MediaStatus { get; set; }//dont care as user wont neceserray have a reason to give status

        public DateTime DateFinished { get; set; }
        [Required]
        [ForeignKey("User")]
        public string UserId { get; set; }
    }
}
