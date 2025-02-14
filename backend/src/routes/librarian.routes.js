import express from "express";
import { 
  registerStudent, 
  registerBook, 
  issueBook, 
  returnBook, 
  searchStudents, 
  searchBooks ,
  login
} from "../controllers/librarian.controller.js";
import authMiddleware from "../middleware/librarian.middleware.js";

const router = express.Router();

router.post('/login',login)
router.post("/register-student",authMiddleware, registerStudent);
router.post("/register-book",authMiddleware, registerBook);
router.post("/issue-book",authMiddleware, issueBook);
router.post("/return-book",authMiddleware, returnBook);
router.get("/search-student",authMiddleware, searchStudents);
router.get("/search-book",authMiddleware, searchBooks);

export default router;
