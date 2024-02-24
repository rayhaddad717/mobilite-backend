import sequelize from "sequelize";
import database from "../db";
import * as Sequelize from "sequelize";
import StudentsInscription from "./StudentsInscriptionModel";
class Students extends Sequelize.Model {
  declare id: number;
  declare name: string;
  declare notes: { [x: string]: number }[];
  declare nbr_dossier: number;
  declare family_name: string;
  declare phone: number;
  declare email: string;
  declare departement: string;
  declare annee: number;
  declare branch: number;
  declare average: number;
  declare eligible: boolean;
  declare expected_grad_date: Date;
  declare comment: string;
  declare StudentsInscriptions?: StudentsInscription[];
}
Students.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nbr_dossier: {
      type: Sequelize.DataTypes.INTEGER,
    },
    name: {
      type: Sequelize.DataTypes.TEXT,
    },
    family_name: {
      type: Sequelize.DataTypes.TEXT,
    },
    phone: {
      type: Sequelize.DataTypes.INTEGER,
    },
    email: {
      type: Sequelize.DataTypes.TEXT,
    },
    departement: {
      type: Sequelize.DataTypes.TEXT, //type departement
    },
    annee: {
      type: Sequelize.DataTypes.INTEGER,
    },
    branch: {
      type: Sequelize.DataTypes.INTEGER, //type branch
    },
    average: {
      type: Sequelize.DataTypes.INTEGER,
    },
    notes: {
      type: Sequelize.DataTypes.JSONB,
    },
    eligible: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    expected_grad_date: {
      type: Sequelize.DataTypes.DATE,
    },
    comment: {
      type: Sequelize.DataTypes.TEXT,
    },
  },
  {
    // Enable timestamps
    sequelize: database,
    timestamps: true,
  }
);
export default Students;
