import database from "../db";
import * as Sequelize from "sequelize";
class University extends Sequelize.Model {
  declare id: number;
  declare university_name: string;
  declare country: string;
}
University.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    university_name: {
      type: Sequelize.DataTypes.TEXT,
    },
    country: {
      type: Sequelize.DataTypes.TEXT,
    },
    is_free: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    website: {
      type: Sequelize.DataTypes.TEXT,
    },
    convention_info: {
      type: Sequelize.DataTypes.TEXT,
    },
    convention_date: {
      type: Sequelize.DataTypes.DATE,
    },
    procedure_inscription: {
      type: Sequelize.DataTypes.TEXT,
    },
    // ,
    // image:{
    //   type:Sequelize.DataTypes.TEXT,
    // }
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default University;
