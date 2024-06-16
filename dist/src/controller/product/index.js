"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeleteProduct = exports.updateProduct = exports.CreateProduct = exports.findAllProduct = void 0;
const client_1 = require("../../generated/client");
const prisma = new client_1.PrismaClient();
const findAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let Product = yield prisma.product.findMany();
        return res.status(200).json({ status: 200, message: 'success get data', data: Product });
    }
    catch (error) {
        return res.status(500).json({ status: 400, message: 'Internal Server Error', data: error });
    }
});
exports.findAllProduct = findAllProduct;
const CreateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name_product, description_product } = req.body;
        let Product = yield prisma.product.create({ data: {
                name_product, description_product
            } });
        return res.status(200).json({ status: 200, message: 'success create data', data: Product });
    }
    catch (error) {
        return res.status(500).json({ status: 500, message: 'Internal Server Error', data: error });
    }
});
exports.CreateProduct = CreateProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name_product, description_product } = req.body;
        let Product = yield prisma.product.update({
            where: { id: Number(id) },
            data: {
                name_product, description_product
            }
        });
        return res.status(200).json({ status: 200, message: 'success update data', data: { id, Product } });
    }
    catch (error) {
        return res.status(400).json({ status: 400, message: 'Bad Request', data: error });
    }
});
exports.updateProduct = updateProduct;
const DeleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        let Product = yield prisma.product.delete({
            where: { id: Number(id) }
        });
        return res.status(200).json({ status: 200, message: 'success delete data', data: { id, Product } });
    }
    catch (error) {
        return res.status(400).json({ status: 400, message: 'Bad Request', data: error.meta.cause });
    }
});
exports.DeleteProduct = DeleteProduct;
