using Microsoft.EntityFrameworkCore;

namespace FriendlyNeighbourhoodLogger
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Media> Media { get; set; }
    }
}