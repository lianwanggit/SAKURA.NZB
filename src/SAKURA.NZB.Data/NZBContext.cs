using Microsoft.Data.Entity;
using SAKURA.NZB.Domain;

namespace SAKURA.NZB.Data
{
	public class NZBContext : DbContext
    {
		public DbSet<Category> Categories { get; set; }
		public DbSet<Brand> Brands { get; set; }
		public DbSet<Supplier> Suppliers { get; set; }
		public DbSet<Product> Products { get; set; }
		public DbSet<Customer> Customers { get; set; }
		public DbSet<Order> Orders { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<OrderProduct>()
				.HasOne(x => x.Product)
				.WithOne()
				.OnDelete(Microsoft.Data.Entity.Metadata.DeleteBehavior.Restrict);

			base.OnModelCreating(modelBuilder);
		}
	}
}
