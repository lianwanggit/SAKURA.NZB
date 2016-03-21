using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;
using Microsoft.Data.Entity.Metadata;

namespace SAKURA.NZB.Data.Migrations
{
    public partial class initial7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Image_Product_ProductId", table: "Image");
            migrationBuilder.DropForeignKey(name: "FK_Order_Customer_CustomerId", table: "Order");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_ExchangeRate_ExchangeRateId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Order_OrderId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_Product_Category_CategoryId", table: "Product");
            migrationBuilder.CreateTable(
                name: "ProductQuote",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    Price = table.Column<float>(nullable: false),
                    ProductId = table.Column<int>(nullable: false),
                    SupplierId = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProductQuote", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ProductQuote_Product_ProductId",
                        column: x => x.ProductId,
                        principalTable: "Product",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ProductQuote_Supplier_SupplierId",
                        column: x => x.SupplierId,
                        principalTable: "Supplier",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });
            migrationBuilder.AddForeignKey(
                name: "FK_Image_Product_ProductId",
                table: "Image",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(
                name: "FK_Order_Customer_CustomerId",
                table: "Order",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_ExchangeRate_ExchangeRateId",
                table: "OrderProduct",
                column: "ExchangeRateId",
                principalTable: "ExchangeRate",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_Order_OrderId",
                table: "OrderProduct",
                column: "OrderId",
                principalTable: "Order",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(
                name: "FK_Product_Category_CategoryId",
                table: "Product",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Image_Product_ProductId", table: "Image");
            migrationBuilder.DropForeignKey(name: "FK_Order_Customer_CustomerId", table: "Order");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_ExchangeRate_ExchangeRateId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Order_OrderId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_Product_Category_CategoryId", table: "Product");
            migrationBuilder.DropTable("ProductQuote");
            migrationBuilder.AddForeignKey(
                name: "FK_Image_Product_ProductId",
                table: "Image",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(
                name: "FK_Order_Customer_CustomerId",
                table: "Order",
                column: "CustomerId",
                principalTable: "Customer",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_ExchangeRate_ExchangeRateId",
                table: "OrderProduct",
                column: "ExchangeRateId",
                principalTable: "ExchangeRate",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_Order_OrderId",
                table: "OrderProduct",
                column: "OrderId",
                principalTable: "Order",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(
                name: "FK_Product_Category_CategoryId",
                table: "Product",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
