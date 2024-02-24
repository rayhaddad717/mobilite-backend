import database from "../db";
import * as Sequelize from "sequelize";
class Department extends Sequelize.Model {
  declare id: number;
  declare department_name: string;
}
Department.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    department_name: {
      type: Sequelize.DataTypes.TEXT,
    }
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default Department;
