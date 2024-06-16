import {  Router } from "express";
import { CreateProduct, DeleteProduct, findAllProduct, updateProduct } from "../../controller/product";
import jwtVerify from "../../middleware/jwtverify";

const ProductRouter = Router()

ProductRouter.use(jwtVerify)
ProductRouter.get('/findAll',findAllProduct)
ProductRouter.post('/createProduct',CreateProduct)
ProductRouter.patch('/updateProduct/:id',updateProduct)
ProductRouter.delete('/deleteProduct',DeleteProduct)

export default ProductRouter;