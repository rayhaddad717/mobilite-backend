import sequelize from "sequelize";
import database from "../db";
import * as Sequelize from "sequelize";
import Masters from "./MastersModel";
import Students from "./StudentsModel";
class StudentsInscription extends Sequelize.Model {
  declare id: number;
  declare student_id: number;
  declare master_id: number;
  declare university_id: number;
  declare is_admitted: boolean;
  declare is_confirmed: boolean;
  declare has_scholarship: boolean;
  declare motivation_letter_file: string | null; //base 64 pdf
  declare recommendation_letter_file: string | null; //base 64 pdf
  declare cv_file: string | null; //base 64 pdf
  declare admission_letter_file: string | null; //base 64 pdf
  declare nomination_letter_file: string | null; //base 64 pdf
  declare master?: Masters;
  declare student?: Students;
}
StudentsInscription.init(
  {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    student_id: {
      type: Sequelize.DataTypes.INTEGER,
    },
    master_id: {
      type: Sequelize.DataTypes.INTEGER,
    },
    university_id: {
      type: Sequelize.DataTypes.INTEGER,
    },
    is_admitted: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    is_confirmed: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    has_scholarship: {
      type: Sequelize.DataTypes.BOOLEAN,
    },
    motivation_letter_file: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true, // Nullable field
    },
    recommendation_letter_file: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true, // Nullable field
    },
    cv_file: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true, // Nullable field
    },
    admission_letter_file: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true, // Nullable field
    },
    nomination_letter_file: {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true, // Nullable field
    },
  },
  {
    sequelize: database,
    timestamps: true,
  }
);
export default StudentsInscription;
