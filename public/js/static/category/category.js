import $ from "jquery";

class Category {
    constructor(name, description) {
        this.name = name;
        this.description = description;
    }

    validate() {
        if (!this.name) {
            throw new Error("Category's name is required.");
        }
        return true;
    }

    save() {
        var category = this.toJSON();
        $.ajax({
            url: '/category',
            method: 'PUT',
            data: category
        }).done(res => {
            console.log(res);
        }).fail(error => {
            console.error(error);
        });
    }

    remove(id) {
        if (id) {
            $.ajax({
                url: '/category/' + id,
                method: 'DELETE'
            }).done(res => {
                console.log(res);
            }).fail(error => {
                console.error(error);
            });
        }
    }

    toJSON() {
        return {
            name: this.name,
            description: this.description
        };
    }
}

export default Category;