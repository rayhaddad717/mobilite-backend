import sequelize from "sequelize";
import database from "../db";
import * as Sequelize from "sequelize";
import University from "./UniversityModel";
import Scholarship from "./ScholarshipModel";
class Masters extends Sequelize.Model {
  declare id: number;
  declare university_id: number;
  declare name: string;
  declare departement_target: string;
  declare type_diploma: string;
  declare language_required: string;
  declare recrutement_sur_dossier: boolean;
  declare exemption_fees: number;
  declare entretien_motivation: boolean;
  declare oral_exam: boolean;
  declare written_exam: boolean;
  declare nb_students: number;
  declare result_dates: Date;
  declare date_candidature_deposit: Date;
  declare id_bourse: number;
  declare University?: University;
  declare Scholarship?: Scholarship;
}
Masters.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    university_id: {
      type: Sequelize.DataTypes.INTEGER,
    },
    name: {
      type: Sequelize.DataTypes.TEXT,
    },
    departement_target: {
      type: Sequelize.DataTypes.TEXT,
    },
    type_diploma: {
      type: Sequelize.DataTypes.TEXT,
    },
    language_required: {
      type: Sequelize.DataTypes.TEXT,
    },
    recrutement_sur_dossier: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    exemption_fees: {
      type: Sequelize.DataTypes.FLOAT,
    },
    entretien_motivation: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    oral_exam: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    written_exam: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    nb_students: {
      type: Sequelize.DataTypes.INTEGER,
    },
    result_dates: {
      type: Sequelize.DataTypes.DATE,
    },
    date_candidature_deposit: {
      type: Sequelize.DataTypes.DATE,
    },
    id_bourse: {
      type: Sequelize.DataTypes.INTEGER,
    },
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default Masters;
