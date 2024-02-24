import { format } from "date-fns";
import CONSTANT from "../config";
import {
  CreateOrEditMastersRequest,
  DeleteMastersRequest,
  GetMastersRequest,
} from "../typings";
import ExcelJS from "exceljs";
import Masters from "../models/MastersModel";
import University from "../models/UniversityModel";
import Scholarship from "../models/ScholarshipModel";
export class MastersController {
  //GET
  async getMasters(params: GetMastersRequest) {
    try {
      return await Masters.findByPk(params.id);
    } catch (error) {
      throw error;
    }
  }
  //LIST
  async listMasters() {
    try {
      return await Masters.findAll({
        order: [["id", "desc"]],
        include: [{ model: University }],
      });
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteMasters(payload: DeleteMastersRequest) {
    try {
      return await Masters.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE OR EDIT
  async createOrEditMasters(payload: CreateOrEditMastersRequest) {
    try {
      let master: Masters;
      if (payload.id_bourse === -1) {
        payload.id_bourse = null;
      }
      if (payload.id) {
        const res = await Masters.update(payload, {
          where: {
            id: payload.id,
          },
          returning: true,
        });
        master = res[1][0];
        return CONSTANT.HTTP_RESPONSES.OK<Masters>(
          master,
          "Master edited successfully"
        );
      } else {
        master = await Masters.create({
          name: payload.name,
          university_id: payload.university_id,
          departement_target: payload.departement_target,
          type_diploma: payload.type_diploma,
          language_required: payload.language_required,
          recrutement_sur_dossier: payload.recrutement_sur_dossier,
          exemption_fees: payload.exemption_fees,
          entretien_motivation: payload.entretien_motivation,
          oral_exam: payload.oral_exam,
          date_d_appel: payload.date_d_appel,
          written_exam: payload.written_exam,
          nb_students: payload.nb_students,
          result_dates: payload.result_dates,
          date_candidature_deposit: payload.date_candidature_deposit,
          id_bourse: payload.id_bourse === -1 ? null : payload.id_bourse,
        });
        return CONSTANT.HTTP_RESPONSES.CREATED<Masters>(
          master,
          "Master created successfully"
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // EXPORT TO EXCEL
  async exportToExcel() {
    try {
      // Fetch all scholarships from the database
      const scholarships = await Masters.findAll({
        order: [["id", "desc"]],
        include: [
          {
            model: University,
          },
          {
            model: Scholarship,
          },
        ],
      });
      // Create a new workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Masters");

      // Define columns in the worksheet
      worksheet.columns = [
        { header: "I", key: "id", width: 20 },
        { header: "University ", key: "university_name", width: 20 },
        { header: "Scholarship ID", key: "scholarship_name", width: 20 },
        { header: "Name", key: "name", width: 20 },
        { header: "Department Target", key: "departement_target", width: 20 },
        { header: "Diplome Type", key: "type_diploma", width: 20 },
        { header: "Language Required", key: "language_required", width: 20 },
        {
          header: "Recruitement sur dossier",
          key: "recrutement_sur_dossier",
          width: 20,
        },
        { header: "Exemption fees", key: "exemption_fees", width: 20 },
        {
          header: "Entretien De Motivation",
          key: "entretien_motivation",
          width: 20,
        },
        { header: "Oral Exam", key: "oral_exam", width: 20 },
        { header: "Written Exam", key: "written_exam", width: 20 },
        { header: "Nb Students", key: "nb_students", width: 20 },
        { header: "Result Dates", key: "result_dates", width: 20 },
        {
          header: "Candidature Deposit Date",
          key: "date_candidature_deposit",
          width: 20,
        },

        // Add more columns as necessary
      ];

      // Add rows to the worksheet from the fetched universities
      scholarships.forEach((master) => {
        const ScholarshipDetail = {
          ...master.toJSON(),
          recrutement_sur_dossier: master.recrutement_sur_dossier
            ? "Yes"
            : "No",
          date_d_appel: master.date_d_appel
            ? format(master.date_d_appel, "PPP")
            : "No",
          oral_exam: master.oral_exam ? format(master.oral_exam, "PPP") : "No",
          entretien_motivation: master.entretien_motivation
            ? format(master.entretien_motivation, "PPP")
            : "No",
          written_exam: master.written_exam
            ? format(master.written_exam, "PPP")
            : "No",
          university_name: master.University?.university_name,
          scholarship_name: master.Scholarship?.name,
          result_dates: format(master.result_dates, "PPP"),
          date_candidature_deposit: format(
            master.date_candidature_deposit,
            "PPP"
          ),
        };
        worksheet.addRow(ScholarshipDetail);
      });
      return workbook;
    } catch (error) {
      throw error;
    }
  }

  // BULK ADD FROM EXCEL
  async importFromExcel(workbook: ExcelJS.Workbook) {
    try {
      const worksheet = workbook.getWorksheet(1); // Get the first worksheet
      if (!worksheet) throw "Empty Workbook";
      worksheet.eachRow(async (row, rowNumber) => {
        if (rowNumber > 1) {
          // Assuming the first row is headers
          // Extract data from each row to create a Master entry
          const department_name = row.getCell(1).value;
          // Add more fields as necessary

          // Create Master entry in the database
          try {
            await Masters.create({
              department_name,
            });
          } catch (error) {
            console.error("Error creating Master entry:", error);
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
export const masterController = new MastersController();
