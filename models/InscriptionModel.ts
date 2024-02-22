import sequelize from "sequelize";
import database from "../db";
import * as Sequelize from "sequelize";
class Inscription extends Sequelize.Model {
  declare id: number;
  declare Inscription_name: string;
}
Inscription.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_student:{
      type: Sequelize.DataTypes.INTEGER,
    },
    id_master:{
      type: Sequelize.DataTypes.INTEGER,
    },
    is_admitted:{
      type: Sequelize.DataTypes.BOOLEAN,
    },
    is_confirmed:{
      type: Sequelize.DataTypes.BOOLEAN,
    },
    is_boursier:{
      type: Sequelize.DataTypes.BOOLEAN,
    }
    
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default Inscription;
