import express from "express";
import database from "./db";
import University from "./models/UniversityModel";
//import Bourse from "./models/BourseModel";
import bodyParser from "body-parser";
import universityRoutes from "./routes/UniversityRoutes";
import authRoutes from "./routes/AuthRoute";
import scholarshipRoutes from "./routes/ScholarshipRoutes";
import mastersRoutes from "./routes/MasterRoutes";
import studentsinscriptionRoutes from "./routes/StudentsInscriptionRoutes";
import studentsRoute from "./routes/StudentsRoute";
import morgan from "morgan";
import cors from "cors";
import Admins from "./models/AdminModel";
import Scholarship from "./models/ScholarshipModel";
import Masters from "./models/MastersModel";
import StudentsInscription from "./models/StudentsInscriptionModel";
import Students from "./models/StudentsModel";
import bcrypt from "bcrypt";
import CONSTANT from "./config";
import cookieParser from "cookie-parser";
import { authMiddleware } from "./middlewares/authMiddleware";
const app = express();
app.get("/api", (req, res) => {
  res.send("Hello World!");
});

const PORT = process.env.PORT || 3000;
// Middleware to log HTTP requests
app.use(morgan("tiny"));

// Middleware to enable CORS
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app's origin
    credentials: true,
  })
);

// Middleware to parse JSON request bodies
app.use(bodyParser.json({ limit: "100mb" }));

// Middleware to parse URL-encoded form bodies
app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
//for cookies
app.use(cookieParser());
// Use the route files
app.use("/api/", authRoutes);
app.use("/api/scholarship", authMiddleware, scholarshipRoutes);
app.use("/api/university", authMiddleware, universityRoutes);
app.use("/api/masters", authMiddleware, mastersRoutes);
app.use("/api/students", authMiddleware, studentsRoute);
app.use("/api/student_inscription", authMiddleware, studentsinscriptionRoutes);
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// app.use("/api/bourse",)

class BootStrap {
  constructor() {}
  async init() {
    try {
      await database.sync({ alter: true });
      await database.authenticate();
      await this.addTableRelations();
      await this.bootstrap();
      console.log("Connection has been established successfully.");
    } catch (error) {
      console.error("Unable to connect to the database:", error);
    }
  }
  async bootstrap() {
    try {
      const find = await Admins.count({
        where: {
          username: "sysadmin",
        },
      });
      if (!find) {
        await Admins.create({
          username: "sysadmin",
          password_hash: await bcrypt.hash(
            CONSTANT.ADMIN_PASSWORD || "password",
            10
          ),
        });
      }
    } catch (err) {}
  }
  async addTableRelations() {
    StudentsInscription.belongsTo(Students, { foreignKey: "student_id" });
    Students.hasMany(StudentsInscription, {
      foreignKey: "student_id",
    });
    StudentsInscription.belongsTo(Masters, { foreignKey: "master_id" });
    StudentsInscription.belongsTo(University, { foreignKey: "university_id" });
    Masters.belongsTo(University, { foreignKey: "university_id" });
    Masters.belongsTo(Scholarship, { foreignKey: "id_bourse" });
    await University.sync({ alter: true });
    await Scholarship.sync({ alter: true });
    await Masters.sync({ alter: true });
    await Students.sync({ alter: true });
    await Admins.sync({ alter: true });
    await StudentsInscription.sync({ alter: true });
  }
}
new BootStrap().init();
