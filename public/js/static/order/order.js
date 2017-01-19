class Order {

    constructor() {
        this.details = [];
    }

    add(item) {
        let detail = {
            id: item.id,
            name: item.name,
            price: item.price,
            count: item.count
        };
        this.details.push(detail);
    }

    update(item) {
        if (id) {
            let details = this.details;
            for (var i = details.length - 1; i >= 0; i--) {
                if (details[i].id === item.id) {
                    return (details[i] = item);
                }
            }
        }
        return undefined;
    }

    remove(id) {
        if (id) {
            let details = this.details;
            for (var i = details.length - 1; i >= 0; i--) {
                if (details[i].id === id) {
                    details.splice(i, 1);
                    return true;
                }
            }
        }
        return false;
    }

    total() {
        var sum = 0;
        this.details.map((item) => {
            return item.price * item.count;
        }).reduce((pre, curr) => {
            return pre.price * pre.count + curr;
        }, sum);
        return sum;
    }
}

export default Order;