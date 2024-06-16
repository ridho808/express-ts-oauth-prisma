"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_1 = require("../../controller/product");
const jwtverify_1 = __importDefault(require("../../middleware/jwtverify"));
const ProductRouter = (0, express_1.Router)();
ProductRouter.use(jwtverify_1.default);
ProductRouter.get('/findAll', product_1.findAllProduct);
ProductRouter.post('/createProduct', product_1.CreateProduct);
ProductRouter.patch('/updateProduct/:id', product_1.updateProduct);
ProductRouter.delete('/deleteProduct', product_1.DeleteProduct);
exports.default = ProductRouter;
