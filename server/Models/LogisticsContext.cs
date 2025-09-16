using Microsoft.EntityFrameworkCore;

namespace server.Models
{
    public class LogisticsContext : DbContext
    {
        public LogisticsContext(DbContextOptions<LogisticsContext> options) : base(options) { }

        public DbSet<LogisticsFollowup> LogisticsFollowups { get; set; }
        public DbSet<History> Histories { get; set; }
        public DbSet<Report> Reports { get; set; }
        public DbSet<UserLog> UserLogs { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<RecycleBin> RecycleBins { get; set; }
        public DbSet<IntransitFollowup> IntransitFollowups { get; set; }
        public DbSet<PaymentHistory> PaymentHistories { get; set; }
        public DbSet<IntransitItemsDetail> IntransitItemsDetails { get; set; }
         public DbSet<logisticsItemsDetail> logisticsItemsDetails { get; set; }


             public DbSet<LogisticsArrivedAAk> LogisticsArrivedAAks { get; set; }

                 public DbSet<LogisticsArrivedSDT> LogisticsArrivedSDTs { get; set; }
                     public DbSet<LogisticsContainerReturned> LogisticsContainerReturns { get; set; }
                         public DbSet<LogisticsDjboutiDeparted> LogisticsDjboutiDeparts { get; set; }
        public IEnumerable<object> LogisticsDjboutiDeparted { get; internal set; }
    }
}
