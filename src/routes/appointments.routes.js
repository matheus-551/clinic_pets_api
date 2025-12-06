import { Router } from "express";
import AppointmentsController from "../modules/appointments/appointments.controller.js";

const router = Router();

router.get("/appointments", AppointmentsController.getAll);
router.get("/appointments/:id", AppointmentsController.getById);
router.post("/appointments", AppointmentsController.create);
router.put("/appointments/:id", AppointmentsController.update);
router.delete("/appointments/:id", AppointmentsController.remove);

export default router;