import { initServer } from "./config/app.js";
import { config } from "dotenv"; //Decirle a Node que se usa DOTENV
import { connect } from "./config/mongo.js";
import { defaultCategory } from '../Almacenadora/src/category/category.controller.js'



config()
initServer()
connect()
await defaultCategory();