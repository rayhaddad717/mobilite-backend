import { format } from "date-fns";
import CONSTANT from "../config";
import {
  CreateOrEditStudentsRequest,
  DeleteStudentsRequest,
  GetStudentsRequest,
} from "../typings";
import ExcelJS from "exceljs";
import University from "../models/UniversityModel";
import Scholarship from "../models/ScholarshipModel";
import Students from "../models/StudentsModel";
export class StudentsController {
  //GET
  async getStudents(params: GetStudentsRequest) {
    try {
      return await Students.findByPk(params.id);
    } catch (error) {
      throw error;
    }
  }
  //LIST
  async listStudents() {
    try {
      return await Students.findAll({ order: [["id", "desc"]] });
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteStudents(payload: DeleteStudentsRequest) {
    try {
      return await Students.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE OR EDIT
  async createOrEditStudents(payload: CreateOrEditStudentsRequest) {
    try {
      let student: Students;
      if (payload.id) {
        const res = await Students.update(payload, {
          where: {
            id: payload.id,
          },
          returning: true,
        });
        student = res[1][0];
        return CONSTANT.HTTP_RESPONSES.OK<Students>(
          student,
          "Student edited successfully"
        );
      } else {
        student = await Students.create({
          ...payload,
        });
        return CONSTANT.HTTP_RESPONSES.CREATED<Students>(
          student,
          "Student created successfully"
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
      const students = await Students.findAll({
        order: [["id", "desc"]],
      });
      // Create a new workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Students");

      // Define columns in the worksheet
      worksheet.columns = [
        { header: "ID", key: "id", width: 20 },
        { header: "Student Name ", key: "student_name", width: 20 },
        { header: "Average", key: "average", width: 20 },
        { header: "Department", key: "department", width: 20 },
        { header: "Branch", key: "branch", width: 20 },
        { header: "Year", key: "year", width: 20 },

        // Add more columns as necessary
      ];

      // Add rows to the worksheet from the fetched universities
      students.forEach((student) => {
        const studentDetails = {
          ...student.toJSON(),
          student_name: student.name + " " + student.family_name,
          department: `Genie ${
            student.departement === "GE"
              ? "Electrique"
              : student.departement === "GM"
              ? "Mecanique"
              : student.departement === "GC"
              ? "Civile"
              : "Petro"
          }`,
          branch: `ULFG ${"I".repeat(student.branch)}`,
          year: student.annee,
        };
        worksheet.addRow(studentDetails);
      });
      return workbook;
    } catch (error) {
      throw error;
    }
  }
}
export const studentController = new StudentsController();
