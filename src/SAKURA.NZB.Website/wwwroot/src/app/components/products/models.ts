export class Category {
	id: number;
	name: string;

	constructor(obj) {
		this.id = obj.id;
		this.name = obj.name;
	}
}

export class Brand {
	id: number;
	name: string;

	constructor(obj) {
		this.id = obj.id;
		this.name = obj.name;
	}
}

export class Supplier {
	id: number;
	name: string;
	address: string;
	phone: string

	constructor(obj) {
		this.id = obj.id;
		this.name = obj.name;
		this.address = obj.address;
		this.phone = obj.phone;
	}
}

export class Quote {
	id: number;
	productId: number;
	supplierId: number;
	supplier: Supplier;
	price: number;

	constructor(obj) {
		this.id = obj.id;
		this.productId = obj.productId;
		this.supplierId = obj.supplierId;
		this.supplier = obj.supplier;
		this.price = obj.price;
	}

	currencyConvert(rate: number) {
		return isNaN(this.price) ? '\u00A0' : (this.price * rate).toFixed(2).toString().replace(/\.?0+$/, "");
	}
}

export class Product {
	id: number;
	name: string;
	desc: string;
	categoryId: number;
	category: Category;
	brandId: number;
	brand: Brand;
	images: any[];
	quotes: Quote[];
	price: number;
	selected = false;

	constructor(obj) {
		this.id = obj.id;
		this.name = obj.fullName;
		this.desc = obj.desc;
		this.categoryId = obj.categoryId;
		this.category = obj.category;
		this.brandId = obj.brandId;
		this.brand = obj.brand;
		this.images = obj.images;
		this.quotes = obj.quotes;
		this.price = obj.price;
	}
}

export enum BaseType { Category, Brand, Supplier }