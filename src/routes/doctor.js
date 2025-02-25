import express from "express";
import { createDoctor, getAllDoctors, getDoctorById, updateDoctor, deleteDoctor } from "../controllers/doctor.js";
import { upload } from "../config/multer.js";
const router = express.Router();

router.post('/create', createDoctor);  // ✅ POST request
router.get('/all', getAllDoctors);
router.get('/:id', getDoctorById);
router.put('/update/:id', upload.array("images", 2), updateDoctor); // Allow up to 5 images
router.delete('/delete/:id', deleteDoctor);

export default router;
