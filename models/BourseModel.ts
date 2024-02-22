import sequelize from "sequelize";
import database from "../db";
import * as Sequelize from "sequelize";
class Bourse extends Sequelize.Model {
  declare id: number;
  declare name: string;
}
Bourse.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.TEXT,
    },
    duration:{
      type: Sequelize.DataTypes.INTEGER
    },
    dateFrom:{
      type: Sequelize.DataTypes.DATE
    },
    dateTo:{
      type:Sequelize.DataTypes.DATE
    },
    value:{
      type:Sequelize.DataTypes.FLOAT
    },
    condition_obtention:{
      type:Sequelize.DataTypes.TEXT
    }
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default Bourse;
