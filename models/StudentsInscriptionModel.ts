import sequelize from "sequelize";
import database from "../db";
import * as Sequelize from "sequelize";
class StudentsInscription extends Sequelize.Model {
  declare id: number;
  declare name: string;
}
StudentsInscription.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.DataTypes.TEXT,
    },
    family:{
      type: Sequelize.DataTypes.TEXT,
    },
    nbr_dossier:{
        type:Sequelize.DataTypes.INTEGER,
    },
    type_diploma:{
        type:Sequelize.DataTypes.INTEGER, //type diplome
    },
    phone:{
        type:Sequelize.DataTypes.INTEGER,
    },
    email:{
        type:Sequelize.DataTypes.TEXT,
    },
    departement:{
        type:Sequelize.DataTypes.TEXT, //type departement
    },
    year:{
        type:Sequelize.DataTypes.INTEGER,
    },
    branch:{
        type:Sequelize.DataTypes.INTEGER, //type branch
    },
    average:{
       type:Sequelize.DataTypes.INTEGER,
    },
    grades:{
        type:Sequelize.DataTypes.TEXT,
    },
    eligible:{
        type:Sequelize.DataTypes.BOOLEAN,
    },
    expected_grad_date:{
        type:Sequelize.DataTypes.DATE,
    },
    id_university:{
        type:Sequelize.DataTypes.INTEGER,
    },
    comment:{
        type:Sequelize.DataTypes.TEXT,
    } 
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default StudentsInscription;
