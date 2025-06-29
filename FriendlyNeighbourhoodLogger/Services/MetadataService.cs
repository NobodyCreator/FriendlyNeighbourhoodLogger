using FriendlyNeighbourhoodLogger;
using Microsoft.EntityFrameworkCore;

namespace FriendlyNeighbourhoodLogger.Services
{
    public class MetadataService
    {
        private readonly AppDbContext _context;

        public MetadataService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<UnifiedMediaMetadata> GetOrAddMetadataAsync(int externalId, string source, UnifiedMediaMetadata fallbackData)
        {
            var existing = await _context.UnifiedMediaMetadata
                .FirstOrDefaultAsync(m => m.ExternalMediaId == externalId && m.DataSource == source);

            if (existing != null)
            {
                return existing;
            }

            fallbackData.LastFetched = DateTime.UtcNow;

            _context.UnifiedMediaMetadata.Add(fallbackData);
            await _context.SaveChangesAsync();

            return fallbackData;
        }
    }
}
