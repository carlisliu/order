import CONST from './const';
import model from '../models/product';

export async function findProductById (id) {
    return await model.findOne({_id: id});
}

export async function findProducts (page, size) {
    let currentPage = page || 0;
    let pageSize = size || CONST.DEFAULT_PAGE_SIZE;

    return await model.find().limit(currentPage * size, (page + 1) * pageSize);
}