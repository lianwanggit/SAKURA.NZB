using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace SAKURA.NZB.Data.Migrations
{
    public partial class initial8 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_ExpressTrackRecord_ExpressTrack_ExpressTrackId", table: "ExpressTrackRecord");
            migrationBuilder.DropForeignKey(name: "FK_Image_Product_ProductId", table: "Image");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Customer_CustomerId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Order_OrderId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_Product_Brand_BrandId", table: "Product");
            migrationBuilder.DropForeignKey(name: "FK_Product_Category_CategoryId", table: "Product");
            migrationBuilder.DropForeignKey(name: "FK_ProductQuote_Product_ProductId", table: "ProductQuote");
            migrationBuilder.DropForeignKey(name: "FK_ProductQuote_Supplier_SupplierId", table: "ProductQuote");
            migrationBuilder.AddColumn<bool>(
                name: "IsCompleted",
                table: "ExpressTrack",
                nullable: false,
                defaultValue: false);
            migrationBuilder.AddColumn<DateTimeOffset>(
                name: "ModifiedTime",
                table: "ExpressTrack",
                nullable: false,
                defaultValue: new DateTimeOffset(new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), new TimeSpan(0, 0, 0, 0, 0)));
            migrationBuilder.AddForeignKey(
                name: "FK_ExpressTrackRecord_ExpressTrack_ExpressTrackId",
                table: "ExpressTrackRecord",
                column: "ExpressTrackId",
                principalTable: "ExpressTrack",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(
                name: "FK_Image_Product_ProductId",
                table: "Image",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_Customer_CustomerId",
                table: "OrderProduct",
                column: "CustomerId",
                principalTable: "Customer",
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
            migrationBuilder.DropForeignKey(name: "FK_ExpressTrackRecord_ExpressTrack_ExpressTrackId", table: "ExpressTrackRecord");
            migrationBuilder.DropForeignKey(name: "FK_Image_Product_ProductId", table: "Image");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Customer_CustomerId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Order_OrderId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_Product_Brand_BrandId", table: "Product");
            migrationBuilder.DropForeignKey(name: "FK_Product_Category_CategoryId", table: "Product");
            migrationBuilder.DropForeignKey(name: "FK_ProductQuote_Product_ProductId", table: "ProductQuote");
            migrationBuilder.DropForeignKey(name: "FK_ProductQuote_Supplier_SupplierId", table: "ProductQuote");
            migrationBuilder.DropColumn(name: "IsCompleted", table: "ExpressTrack");
            migrationBuilder.DropColumn(name: "ModifiedTime", table: "ExpressTrack");
            migrationBuilder.AddForeignKey(
                name: "FK_ExpressTrackRecord_ExpressTrack_ExpressTrackId",
                table: "ExpressTrackRecord",
                column: "ExpressTrackId",
                principalTable: "ExpressTrack",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(
                name: "FK_Image_Product_ProductId",
                table: "Image",
                column: "ProductId",
                principalTable: "Product",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(
                name: "FK_OrderProduct_Customer_CustomerId",
                table: "OrderProduct",
                column: "CustomerId",
                principalTable: "Customer",
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
