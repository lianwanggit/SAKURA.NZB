using System;
using System.Collections.Generic;
using Microsoft.Data.Entity.Migrations;

namespace SAKURA.NZB.Data.Migrations
{
    public partial class initial3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Image_Product_ProductId", table: "Image");
            migrationBuilder.DropForeignKey(name: "FK_Order_Customer_CustomerId", table: "Order");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_ExchangeRate_ExchangeRateId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Order_OrderId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_Product_Category_CategoryId", table: "Product");
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Product",
                nullable: false);
            migrationBuilder.AlterColumn<int>(
                name: "CategoryId",
                table: "Product",
                nullable: true);
            migrationBuilder.AddColumn<string>(
                name: "Desc",
                table: "Product",
                nullable: true);
            migrationBuilder.AddColumn<int>(
                name: "Qty",
                table: "OrderProduct",
                nullable: false,
                defaultValue: 0);
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
                name: "FK_Product_Category_categoryId",
                table: "Product",
                column: "categoryId",
                principalTable: "Category",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
            migrationBuilder.RenameColumn(
                name: "CategoryId",
                table: "Product",
                newName: "categoryId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_Image_Product_ProductId", table: "Image");
            migrationBuilder.DropForeignKey(name: "FK_Order_Customer_CustomerId", table: "Order");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_ExchangeRate_ExchangeRateId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_OrderProduct_Order_OrderId", table: "OrderProduct");
            migrationBuilder.DropForeignKey(name: "FK_Product_Category_categoryId", table: "Product");
            migrationBuilder.DropColumn(name: "Desc", table: "Product");
            migrationBuilder.DropColumn(name: "Qty", table: "OrderProduct");
            migrationBuilder.AlterColumn<int>(
                name: "categoryId",
                table: "Product",
                nullable: false);
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Product",
                nullable: true);
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
            migrationBuilder.RenameColumn(
                name: "categoryId",
                table: "Product",
                newName: "CategoryId");
        }
    }
}
