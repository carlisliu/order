import {DEFAULT_PAGE_SIZE} from './const';
import {Product as model} from '../models';

export async function findProductById (id) {
    return await model.findOne({_id: id});
}

export async function findProducts (page, size) {
    let currentPage = page || 0;
    let pageSize = size || DEFAULT_PAGE_SIZE;

    return await model.find().limit(currentPage * size, (page + 1) * pageSize);
}