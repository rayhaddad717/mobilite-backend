import { format } from "date-fns";
import CONSTANT from "../config";
import StudentsInscription from "../models/StudentsInscriptionModel";
import {
  CreateOrEditStudentsInscriptionRequest,
  DeleteStudentsInscriptionRequest,
  GetStudentsInscriptionRequest,
} from "../typings";
import ExcelJS from "exceljs";
import Masters from "../models/MastersModel";
import University from "../models/UniversityModel";

export class StudentsInscriptionController {
  //GET
  async getStudentsInscription(params: GetStudentsInscriptionRequest) {
    try {
      return await StudentsInscription.findByPk(params.id);
    } catch (error) {
      throw error;
    }
  }
  //LIST
  async listStudentsInscription() {
    try {
      return await StudentsInscription.findAll({ order: [["id", "desc"]] });
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteStudentsInscription(payload: DeleteStudentsInscriptionRequest) {
    try {
      return await StudentsInscription.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE OR EDIT
  async createOrEditStudentsInscription(payload: CreateOrEditStudentsInscriptionRequest) {
    try {
      let student_inscription: StudentsInscription;
      if (payload.id) {
        const res = await StudentsInscription.update(payload, {
          where: {
            id: payload.id,

          },
          returning: true,
        });
        student_inscription = res[1][0];
        return CONSTANT.HTTP_RESPONSES.OK<StudentsInscription>(
          student_inscription,
          "Students Inscription edited successfully"
        );
      } else {
        student_inscription = await StudentsInscription.create({
                id: payload.id,
                name: payload.name,
                family: payload.family,
                nbr_dossier: payload.nbr_dossier,
                type_diploma: payload.type_diploma,
                phone: payload.phone,
                email: payload.email,
                departement: payload.departement,
                year: payload.year,
                branch: payload.branch,
                average: payload.average,
                grades: payload.grades,
                eligible: payload.eligible,
                expected_grad_date: payload.expected_grad_date,
                id_university: payload.id_university,
                comment: payload.comment,
        });
        return CONSTANT.HTTP_RESPONSES.CREATED<StudentsInscription>(
          student_inscription,
          "Students Inscription created successfully"
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // EXPORT TO EXCEL
  async exportToExcel() {
    try {
      // Fetch all masters from the database
      const masters = await StudentsInscription.findAll({
        order: [["id", "desc"]],
        include: [
          {
            model: University,
          },
          {
            model: Masters,
          },
        ],
      });
      // Create a new workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("StudentsInscription");

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
      // scholarships.forEach((m) => {
      //   const ScholarshipDetail = {
      //     ...master.toJSON(),
      //     recrutement_sur_dossier: master.recrutement_sur_dossier
      //       ? "Yes"
      //       : "No",
      //     oral_exam: master.oral_exam ? "Yes" : "No",
      //     entretien_motivation: master.entretien_motivation ? "Yes" : "No",
      //     written_exam: master.written_exam ? "Yes" : "No",
      //     university_name: master.University?.university_name,
      //     scholarship_name: master.Scholarship?.name,
      //     result_dates: format(master.result_dates, "PPP"),
      //     date_candidature_deposit: format(
      //       master.date_candidature_deposit,
      //       "PPP"
      //     ),
      //   };
      //   worksheet.addRow(ScholarshipDetail);
      //});
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
export const student_inscriptionController = new StudentsInscriptionController();
