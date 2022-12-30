import { Sequelize } from "sequelize";
import getUserModel from "./user";

const sequelize = new Sequelize(
    typeof process.env.DB_URI === "string" ? process.env.DB_URI : "",
    {
        dialect: "postgres",
        dialectOptions: {
            native: true,
            ssl: true,
        },
    }
);

const models = {
    User: getUserModel(sequelize),
};

// Object.keys(models).forEach((key) => {
//     if ("associate" in models[key]) {
//         models[].associate(models);
//     }
// });

export default {
    models,
    sequelize,
};
