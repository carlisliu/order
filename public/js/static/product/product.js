import $ from "jquery";

class Product {
    constructor(name, category, price, unit = '', hot = false) {
        this.id = null;
        this.category = category;
        this.name = name;
        this.price = price;
        this.unit = unit;
        this.hot = hot;
    }

    validate() {
        let properties = ['category', 'name', 'price'];
        for (let prop of properties) {
            if (!properties[prop]) {
                throw new Error(prop + ' is invalid');
            }
        }
        return true;
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