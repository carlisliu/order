import CONST from './const';
import {
    Organization
} from '../models';

export async function queryByUserId(userId) {
    return await Organization.findOne({
        userId: userId
    });
}