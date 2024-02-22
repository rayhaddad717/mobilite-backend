import sequelize from "sequelize";
import database from "../db";
import * as Sequelize from "sequelize";
class AllStudents extends Sequelize.Model {
  declare id: number;
  declare name: string;
}
AllStudents.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Name: {
      type: Sequelize.DataTypes.TEXT,
    },
    Family:{
      type: Sequelize.DataTypes.TEXT,
    },
    Nbr_dossier:{
        type:Sequelize.DataTypes.INTEGER,
    },
    Diplome:{
        type:Sequelize.DataTypes.INTEGER, //type diplome
    },
    Phone:{
        type:Sequelize.DataTypes.INTEGER,
    },
    Email:{
        type:Sequelize.DataTypes.TEXT,
    },
    Departement:{
        type:Sequelize.DataTypes.TEXT, //type departement
    },
    Annee:{
        type:Sequelize.DataTypes.INTEGER,
    },
    Branch:{
        type:Sequelize.DataTypes.INTEGER, //type branch
    },
    Average:{
       type:Sequelize.DataTypes.INTEGER,
    },
    Notes:{
        type:Sequelize.DataTypes.TEXT,
    },
    Eligible:{
        type:Sequelize.DataTypes.BOOLEAN,
    },
    Expected_Grad_date:{
        type:Sequelize.DataTypes.DATE,
    },
    Comment:{
        type:Sequelize.DataTypes.TEXT,
    }

    
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default AllStudents;
