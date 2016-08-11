import {User as model} from '../models';

export async function findUserById (id) {
    return await model.findOne({_id: id});
}

export async function findUserByUserId (id) {
    return await model.findOne({id: id});
}