using FriendlyNeighbourhoodLogger.Enums;
using System.ComponentModel.DataAnnotations;

namespace FriendlyNeighbourhoodLogger
{

    public class Media
    {
        public int Id { get; set; }
        [Required]
        [RegularExpression("^(Movie|Show|Book|Game|Song)$", ErrorMessage = "Invalid MediaType. Movie,Show,Book,Game,Song")]
        public MediaType MediaType { get; set; } //important

        [Required]
        [RegularExpression("^(Finished|Started|Backlogged|Skipped|Completed|Refunded)$", ErrorMessage = "Invalid MediaStatus. Finished,Started,Backlogged,Skipped,Completed,Refunded")]
        public string Title { get; set; }//important
        public MediaStatus MediaStatus { get; set; }//dont care as user wont neceserray have a reason to give status

        public DateTime DateFinished { get; set; }
    }
}
