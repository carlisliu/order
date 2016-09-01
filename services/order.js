import CONST from './const';
import {
    Order,
    OrderDetail
} from '../models';

export async function queryOrderById(id) {
    return await Order.findOne({
        _id: id
    });
}

export async function queryOrders(page, size) {
    let currentPage = page || 0;
    let pageSize = size || CONST.DEFAULT_PAGE_SIZE;
    return await Order.find().limit(currentPage * size, (page + 1) * pageSize);
}

export async function save(order) {
    order.details.forEach(function(detail, index) {
        var orderDetailModel = Object.assign(new OrderDetail(), detail);
        this[index] = orderDetailModel;
    }, order.details);

    let orderModel = Object.assign(new Order(), order);

    return await orderModel.save();
}

export async function update(newOrder) {
    const order = await queryOrderById(newOrder._id);

    const toUpdate = [];

    order.details.forEach(function(detail) {

    });

    return orderModel._findAndModify('update', function() {});
}