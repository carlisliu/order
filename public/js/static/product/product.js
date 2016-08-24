class Product {
    constructor(category, name = '', price = 0.0, unit = '', hot = false) {
        this.category = category;
        this.name = name;
        this.price = price;
        this.unit = unit;
        this.hot = hot;
    }

    save() {
        var product = this.toJSON();
    }

    toJSON() {
        return {
            category: this.category,
            name: this.name,
            price: this.price,
            unit: this.unit,
            hot: this.hot
        };
    }
}

export default Product;