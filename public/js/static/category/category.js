import $ from "jquery";

class Category {
    constructor(name, description) {
        this.name = name;
        this.description = description;
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

            }).fail(err => {

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