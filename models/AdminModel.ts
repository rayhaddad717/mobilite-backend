import database from "../db";
import * as Sequelize from "sequelize";
class Admins extends Sequelize.Model {
  declare id: number;
  declare username: string;
  declare password_hash: string;
}
Admins.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.DataTypes.TEXT,
    },
    password_hash: {
      type: Sequelize.DataTypes.TEXT,
    },
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default Admins;
