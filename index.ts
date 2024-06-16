import express from "express";
import dotenv from "dotenv";
import ProductRouter from "./src/router/product";
import UserRouter from "./src/router/user";
dotenv.config()

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use('/Api',ProductRouter)
app.use('/User',UserRouter)


app.listen(port,()=>{
    console.log(`server is running on port ${port}`)
});