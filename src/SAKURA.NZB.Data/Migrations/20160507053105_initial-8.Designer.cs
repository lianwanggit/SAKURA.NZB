using System;
using Microsoft.Data.Entity;
using Microsoft.Data.Entity.Infrastructure;
using Microsoft.Data.Entity.Metadata;
using Microsoft.Data.Entity.Migrations;
using SAKURA.NZB.Data;

namespace SAKURA.NZB.Data.Migrations
{
    [DbContext(typeof(NZBContext))]
    [Migration("20160507053105_initial-8")]
    partial class initial8
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
            modelBuilder
                .HasAnnotation("ProductVersion", "7.0.0-rc1-16348")
                .HasAnnotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn);

            modelBuilder.Entity("SAKURA.NZB.Domain.AppConfig", b =>
                {
                    b.Property<string>("Key")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<string>("Value")
                        .HasAnnotation("MaxLength", 1000);

                    b.HasKey("Key");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Brand", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Category", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Customer", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("Address1")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("Description")
                        .HasAnnotation("MaxLength", 255);

                    b.Property<string>("Email")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("FullName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 10);

                    b.Property<bool>("IsIdentityUploaded");

                    b.Property<int?>("Level");

                    b.Property<string>("NamePinYin")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("Phone1")
                        .IsRequired();

                    b.Property<string>("Phone2");

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.ExchangeRate", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTimeOffset>("ModifiedTime");

                    b.Property<float>("NZDCNY");

                    b.Property<string>("Source")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 50);

                    b.Property<float>("USDCNY");

                    b.Property<float>("USDNZD");

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.ExpressTrack", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<DateTime?>("ArrivedTime");

                    b.Property<string>("Destination")
                        .HasAnnotation("MaxLength", 20);

                    b.Property<string>("From")
                        .HasAnnotation("MaxLength", 20);

                    b.Property<string>("ItemCount")
                        .HasAnnotation("MaxLength", 10);

                    b.Property<DateTimeOffset>("ModifiedTime");

                    b.Property<string>("Recipient")
                        .HasAnnotation("MaxLength", 20);

                    b.Property<string>("Status")
                        .HasAnnotation("MaxLength", 20);

                    b.Property<string>("WaybillNumber")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 20);

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.ExpressTrackRecord", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Content")
                        .HasAnnotation("MaxLength", 200);

                    b.Property<int>("ExpressTrackId");

                    b.Property<DateTime?>("When");

                    b.Property<string>("Where")
                        .HasAnnotation("MaxLength", 20);

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Image", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<byte[]>("Content");

                    b.Property<string>("ContentType")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("Name")
                        .HasAnnotation("MaxLength", 255);

                    b.Property<int>("ProductId");

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Order", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<DateTimeOffset?>("CompleteTime");

                    b.Property<DateTimeOffset?>("DeliveryTime");

                    b.Property<string>("Description")
                        .HasAnnotation("MaxLength", 255);

                    b.Property<float?>("Freight");

                    b.Property<int>("OrderState");

                    b.Property<DateTimeOffset>("OrderTime");

                    b.Property<DateTimeOffset?>("PayTime");

                    b.Property<int>("PaymentState");

                    b.Property<string>("Phone")
                        .IsRequired();

                    b.Property<DateTimeOffset?>("ReceiveTime");

                    b.Property<string>("Recipient")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 10);

                    b.Property<string>("TransitStatus")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<int?>("WaybillId");

                    b.Property<string>("WaybillNumber")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<float?>("Weight");

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.OrderProduct", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<float>("Cost");

                    b.Property<int>("CustomerId");

                    b.Property<int>("OrderId");

                    b.Property<float>("Price");

                    b.Property<int>("ProductId");

                    b.Property<string>("ProductName")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<bool>("Purchased");

                    b.Property<int>("Qty");

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Product", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<int>("BrandId");

                    b.Property<int>("CategoryId");

                    b.Property<string>("Desc")
                        .HasAnnotation("MaxLength", 1000);

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasAnnotation("MaxLength", 100);

                    b.Property<float>("Price");

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.ProductQuote", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<float>("Price");

                    b.Property<int>("ProductId");

                    b.Property<int>("SupplierId");

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Supplier", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd();

                    b.Property<string>("Address")
                        .HasAnnotation("MaxLength", 100);

                    b.Property<string>("Name")
                        .HasAnnotation("MaxLength", 50);

                    b.Property<string>("Phone")
                        .HasAnnotation("MaxLength", 15);

                    b.HasKey("Id");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.ExpressTrackRecord", b =>
                {
                    b.HasOne("SAKURA.NZB.Domain.ExpressTrack")
                        .WithMany()
                        .HasForeignKey("ExpressTrackId");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Image", b =>
                {
                    b.HasOne("SAKURA.NZB.Domain.Product")
                        .WithMany()
                        .HasForeignKey("ProductId");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Order", b =>
                {
                    b.HasOne("SAKURA.NZB.Domain.Image")
                        .WithMany()
                        .HasForeignKey("WaybillId");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.OrderProduct", b =>
                {
                    b.HasOne("SAKURA.NZB.Domain.Customer")
                        .WithMany()
                        .HasForeignKey("CustomerId");

                    b.HasOne("SAKURA.NZB.Domain.Order")
                        .WithMany()
                        .HasForeignKey("OrderId");

                    b.HasOne("SAKURA.NZB.Domain.Product")
                        .WithOne()
                        .HasForeignKey("SAKURA.NZB.Domain.OrderProduct", "ProductId");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.Product", b =>
                {
                    b.HasOne("SAKURA.NZB.Domain.Brand")
                        .WithMany()
                        .HasForeignKey("BrandId");

                    b.HasOne("SAKURA.NZB.Domain.Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");
                });

            modelBuilder.Entity("SAKURA.NZB.Domain.ProductQuote", b =>
                {
                    b.HasOne("SAKURA.NZB.Domain.Product")
                        .WithMany()
                        .HasForeignKey("ProductId");

                    b.HasOne("SAKURA.NZB.Domain.Supplier")
                        .WithMany()
                        .HasForeignKey("SupplierId");
                });
        }
    }
}
