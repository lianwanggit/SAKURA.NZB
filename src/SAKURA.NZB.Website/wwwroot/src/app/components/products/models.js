System.register([], function(exports_1) {
    var Category, Brand, Supplier, Quote, Product, BaseType;
    return {
        setters:[],
        execute: function() {
            Category = (function () {
                function Category(obj) {
                    this.id = obj.id;
                    this.name = obj.name;
                }
                return Category;
            })();
            exports_1("Category", Category);
            Brand = (function () {
                function Brand(obj) {
                    this.id = obj.id;
                    this.name = obj.name;
                }
                return Brand;
            })();
            exports_1("Brand", Brand);
            Supplier = (function () {
                function Supplier(obj) {
                    this.id = obj.id;
                    this.name = obj.name;
                    this.address = obj.address;
                    this.phone = obj.phone;
                }
                return Supplier;
            })();
            exports_1("Supplier", Supplier);
            Quote = (function () {
                function Quote(obj) {
                    this.id = obj.id;
                    this.productId = obj.productId;
                    this.supplierId = obj.supplierId;
                    this.supplier = obj.supplier;
                    this.price = obj.price;
                }
                Quote.prototype.currencyConvert = function (rate) {
                    return !this.price || isNaN(this.price) ? 'CNY' : (this.price * rate).toFixed(2).toString().replace(/\.?0+$/, "");
                };
                return Quote;
            })();
            exports_1("Quote", Quote);
            Product = (function () {
                function Product(obj) {
                    this.id = obj.id;
                    this.name = obj.name;
                    this.desc = obj.desc;
                    this.categoryId = obj.categoryId;
                    this.category = obj.category;
                    this.brandId = obj.brandId;
                    this.brand = obj.brand;
                    this.images = obj.images;
                    this.quotes = obj.quotes;
                    this.price = obj.price;
                }
                return Product;
            })();
            exports_1("Product", Product);
            (function (BaseType) {
                BaseType[BaseType["Category"] = 0] = "Category";
                BaseType[BaseType["Brand"] = 1] = "Brand";
                BaseType[BaseType["Supplier"] = 2] = "Supplier";
            })(BaseType || (BaseType = {}));
            exports_1("BaseType", BaseType);
        }
    }
});
//# sourceMappingURL=models.js.map