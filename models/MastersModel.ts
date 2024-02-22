import sequelize from "sequelize";
import database from "../db";
import * as Sequelize from "sequelize";
class Masters extends Sequelize.Model {
  declare id: number;
  declare name: string;
}
Masters.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    university_id:{
        type:Sequelize.DataTypes.INTEGER,
    },
    name: {
      type: Sequelize.DataTypes.TEXT,
    },
    departement_target:{
        type:Sequelize.DataTypes.TEXT,
    },
    type_diploma:{
        type:Sequelize.DataTypes.TEXT,
    },
    language_required:{
        type:Sequelize.DataTypes.TEXT,
    },
    recrutement_sur_dossier:{
        type:Sequelize.DataTypes.BOOLEAN,
    },
    exemption_fees:{
        type:Sequelize.DataTypes.FLOAT,
    },
    entretien_motivation:{
        type:Sequelize.DataTypes.BOOLEAN,
    },
    oral_exam:{
        type:Sequelize.DataTypes.BOOLEAN,
    },
    written_exam :{
        type:Sequelize.DataTypes.BOOLEAN,
    },
    nb_students:{
        type:Sequelize.DataTypes.INTEGER,
    },
    result_dates:{
        type:Sequelize.DataTypes.DATE,
    },
    date_candidature_deposit:{
        type:Sequelize.DataTypes.DATE,
    },
    id_bourse:{
        type:Sequelize.DataTypes.INTEGER,
    } 

  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default Masters;
