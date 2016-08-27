import $ from "jquery";

class Product {
    constructor(category, id = null, name = '', price = 0.0, unit = '', hot = false) {
        this.id = id;
        this.category = category;
        this.name = name;
        this.price = price;
        this.unit = unit;
        this.hot = hot;
    }

    save() {
        var product = this.toJSON();
        $.ajax({
            url: '/product',
            method: 'PUT',
            data: product
        }).done(res => {
            console.log(res);
        }).fail(error => {
            console.error(error);
        });
    }

    toJSON() {
        return {
            id: this.id,
            category: this.category,
            name: this.name,
            price: this.price,
            unit: this.unit,
            hot: this.hot
        };
    }
}

export default Product;