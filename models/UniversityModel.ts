import database from "../db";
import * as Sequelize from "sequelize";
class University extends Sequelize.Model {
  declare id: number;
  declare university_name: string;
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
    is_free: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default University;
