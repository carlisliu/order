import {
    User as model
} from '../models';

export async function findUserById(id) {
    return await model.findOne({
        _id: id
    });
}

export async function findUserByUserId(id) {
    return await model.findOne({
        id: id
    });
}

export async function removeById(id) {
    return await model.remove({
        id: id
    });
}

export async function addUser(user) {
    return await new model(user).save();
}