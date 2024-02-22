import sequelize from "sequelize";
import database from "../db";
import * as Sequelize from "sequelize";
class Scholarship extends Sequelize.Model {
  declare id: number;
  declare name: string;
  declare duration: number;
  declare dateFrom: Date;
  declare dateTo: Date;
  declare value: number;
  declare condition_obtention: string;
}
Scholarship.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.TEXT,
    },
    duration: {
      type: Sequelize.DataTypes.INTEGER,
    },
    dateFrom: {
      type: Sequelize.DataTypes.DATE,
    },
    dateTo: {
      type: Sequelize.DataTypes.DATE,
    },
    value: {
      type: Sequelize.DataTypes.FLOAT,
    },
    condition_obtention: {
      type: Sequelize.DataTypes.TEXT,
    },
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default Scholarship;
