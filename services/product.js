import {
    DEFAULT_PAGE_SIZE
} from './const';
import {
    Product
} from '../models';

export async function findProductById(id) {
    return await Product.findOne({
        _id: id
    });
}

export async function findProducts(page, size) {
    let currentPage = page || 0;
    let pageSize = size || DEFAULT_PAGE_SIZE;
    return await Product.find().limit(currentPage * size, (page + 1) * pageSize);
}

export async function save(product) {
    return await new Product(product).save();
}