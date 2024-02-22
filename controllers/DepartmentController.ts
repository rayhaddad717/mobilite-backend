import CONSTANT from "../config";
import Department from "../models/DepartmentModel";
import {
  CreateOrEditDepartmentRequest,
  DeleteDepartmentRequest,
  GetDepartmentRequest,
} from "../typings";
import ExcelJS from "exceljs";
export class DepartmentController {
  //GET
  async getDepartment(params: GetDepartmentRequest) {
    try {
      return await Department.findByPk(params.id);
    } catch (error) {
      throw error;
    }
  }
  //LIST
  async listDepartment() {
    try {
      return await Department.findAll({ order: [["id", "desc"]] });
    } catch (error) {
      throw error;
    }
  }
  // DELETE
  async deleteDepartment(payload: DeleteDepartmentRequest) {
    try {
      return await Department.destroy({ where: { id: payload.id } });
    } catch (error) {}
  }
  // CREATE OR EDIT
  async createOrEditDepartment(payload: CreateOrEditDepartmentRequest) {
    try {
      let department: Department;
      if (payload.id) {
        const res = await Department.update(payload, {
          where: {
            id: payload.id,
          },
          returning: true,
        });
        department = res[1][0];
        return CONSTANT.HTTP_RESPONSES.OK<Department>(
          department,
          "Department edited successfully"
        );
      } else {
        department = await Department.create({
          department_name: payload.department_name,
        });
        return CONSTANT.HTTP_RESPONSES.CREATED<Department>(
          department,
          "Department created successfully"
        );
      }
    } catch (error) {
      throw error;
    }
  }

  // EXPORT TO EXCEL
  async exportToExcel() {
    try {
      // Fetch all universities from the database
      const universities = await Department.findAll({
        order: [["id", "desc"]],
      });
      console.log(universities);
      // Create a new workbook and a worksheet
      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet("Universities");

      // Define columns in the worksheet
      worksheet.columns = [
        { header: "Id", key: "id", width: 10 },
        { header: "Name", key: "department_name", width: 30 },
        // Add more columns as necessary
      ];

      // Add rows to the worksheet from the fetched universities
      universities.forEach((Department) => {
        worksheet.addRow(Department.toJSON());
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
          // Extract data from each row to create a Department entry
          const department_name = row.getCell(1).value;
          // Add more fields as necessary

          // Create Department entry in the database
          try {
            await Department.create({
              department_name,
            });
          } catch (error) {
            console.error("Error creating Department entry:", error);
          }
        }
      });
    } catch (error) {
      throw error;
    }
  }
}
export const departmentController = new DepartmentController();
