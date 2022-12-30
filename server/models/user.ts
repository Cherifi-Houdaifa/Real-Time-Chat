// user model
import { Sequelize, DataTypes, Model } from "sequelize";

export default function (sequelize: Sequelize) {
    const User = sequelize.define<UserInterface>("user", {
        username: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
            },
        },
    });

    return User;
}
interface UserInterface extends Model {
    username: string;
    password: string;
}
