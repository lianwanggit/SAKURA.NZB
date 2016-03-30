using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace SAKURA.NZB.Data.Migrations
{
    public partial class initial13 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Image_Product_ProductId", table: "Image");
            migrationBuilder.DropForeignKey(name: "FK_Order_Customer_CustomerId", table: "Order");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_ExchangeRate_ExchangeRateId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Order_OrderId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_Product_Brand_BrandId", table: "Product");
            migrationBuilder.DropForeignKey(name: "FK_Product_Category_CategoryId", table: "Product");
            migrationBuilder.DropForeignKey(name: "FK_ProductQuote_Product_ProductId", table: "ProductQuote");
            migrationBuilder.DropForeignKey(name: "FK_ProductQuote_Supplier_SupplierId", table: "ProductQuote");
            migrationBuilder.DropColumn(name: "Rate", table: "ExchangeRate");
            migrationBuilder.CreateTable(
                name: "AppConfig",
                columns: table => new
                {
                    Key = table.Column<string>(nullable: false),
                    Value = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppConfig", x => x.Key);
                });
            migrationBuilder.AddColumn<float>(
                name: "NZDCNY",
                table: "ExchangeRate",
                nullable: false,
                defaultValue: 0f);
            migrationBuilder.AddColumn<string>(
                name: "Source",
                table: "ExchangeRate",
                nullable: false,
                defaultValue: "");
            migrationBuilder.AddColumn<float>(
                name: "USDCNY",
                table: "ExchangeRate",
                nullable: false,
                defaultValue: 0f);
            migrationBuilder.AddColumn<float>(
                name: "USDNZD",
                table: "ExchangeRate",
                nullable: false,
                defaultValue: 0f);
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
                name: "FK_Product_Brand_BrandId",
                table: "Product",
                column: "BrandId",
                principalTable: "Brand",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(
                name: "FK_Product_Category_CategoryId",
                table: "Product",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(
                name: "FK_ProductQuote_Product_ProductId",
                table: "ProductQuote",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(
                name: "FK_ProductQuote_Supplier_SupplierId",
                table: "ProductQuote",
                column: "SupplierId",
                principalTable: "Supplier",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Image_Product_ProductId", table: "Image");
            migrationBuilder.DropForeignKey(name: "FK_Order_Customer_CustomerId", table: "Order");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_ExchangeRate_ExchangeRateId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Order_OrderId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_Product_Brand_BrandId", table: "Product");
            migrationBuilder.DropForeignKey(name: "FK_Product_Category_CategoryId", table: "Product");
            migrationBuilder.DropForeignKey(name: "FK_ProductQuote_Product_ProductId", table: "ProductQuote");
            migrationBuilder.DropForeignKey(name: "FK_ProductQuote_Supplier_SupplierId", table: "ProductQuote");
            migrationBuilder.DropColumn(name: "NZDCNY", table: "ExchangeRate");
            migrationBuilder.DropColumn(name: "Source", table: "ExchangeRate");
            migrationBuilder.DropColumn(name: "USDCNY", table: "ExchangeRate");
            migrationBuilder.DropColumn(name: "USDNZD", table: "ExchangeRate");
            migrationBuilder.DropTable("AppConfig");
            migrationBuilder.AddColumn<float>(
                name: "Rate",
                table: "ExchangeRate",
                nullable: false,
                defaultValue: 0f);
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
                name: "FK_Product_Brand_BrandId",
                table: "Product",
                column: "BrandId",
                principalTable: "Brand",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(
                name: "FK_Product_Category_CategoryId",
                table: "Product",
                column: "CategoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(
                name: "FK_ProductQuote_Product_ProductId",
                table: "ProductQuote",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(
                name: "FK_ProductQuote_Supplier_SupplierId",
                table: "ProductQuote",
                column: "SupplierId",
                principalTable: "Supplier",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
