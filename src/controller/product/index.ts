import { Request, Response } from 'express'
import { PrismaClient } from '../../generated/client';

const prisma = new PrismaClient();
export const findAllProduct = async (req: Request, res: Response) => {
    try {
        let Product = await prisma.product.findMany()
        return res.status(200).json({status : 200, message : 'success get data', data : Product})
    } catch (error) {
        return res.status(500).json({status : 400, message : 'Internal Server Error',data:error})
    }
}


export const CreateProduct = async (req: Request, res: Response) => {
    try {
        const {name_product,description_product} = req.body
        let Product = await prisma.product.create({data:{
            name_product,description_product
        }})
        return res.status(200).json({status : 200, message : 'success create data', data : Product})
    } catch (error) {
        return res.status(500).json({status : 500, message : 'Internal Server Error',data:error})
    }
}

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const {id} = req.params
        const {name_product,description_product} = req.body
        let Product = await prisma.product.update({
            where : {id : Number(id)},
            data : {
                name_product,description_product
            }
        })
        return res.status(200).json({status : 200, message : 'success update data', data : {id,Product}})
    } catch (error) {
        return res.status(400).json({status : 400, message : 'Bad Request',data:error})
    }
}


export const DeleteProduct = async (req: Request, res: Response) => {
    try {
        const {id} = req.query
        let Product = await prisma.product.delete({
            where : {id : Number(id)}
        })
        return res.status(200).json({status : 200, message : 'success delete data', data : {id,Product}})
    } catch (error : any) {
        return res.status(400).json({status : 400, message : 'Bad Request',data:error.meta.cause})
    }
}