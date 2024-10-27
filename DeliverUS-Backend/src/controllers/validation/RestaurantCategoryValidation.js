import { check } from 'express-validator'
import { RestaurantCategory } from '../../models/models.js'

const maxFileSize = 2000000 // around 2Mb

const checkRCategoryAlreadyExists  = async(value, {req}) =>{
    try{
        const category = await RestaurantCategory.findOne({where:{name:value}})
        if (category !== null){
            return Promise.reject(new Error('La categoría'+value+'ya existe'))
        }
        return Promise.resolve()
    }catch(err){
        return Promise.reject(new Error(err))
    }
}


const create = [
  check('name').exists().isString().isLength({ min: 1, max: 255 }).trim(),
  check('name').custom(checkRCategoryAlreadyExists)
  


]


export { create }
