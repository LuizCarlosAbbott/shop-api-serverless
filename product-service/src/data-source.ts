import { DataSource } from "typeorm";
import { ProductEntity } from "./entity/Product";
import { StockEntity } from "./entity/Stock";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: 5432,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    logging: true,
    entities: [ProductEntity, StockEntity],
    migrations: [],
    subscribers: [],
})
