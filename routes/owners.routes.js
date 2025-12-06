import { Router } from "express";
import OwnersController from "../modules/owners/owners.controller.js";

const router = Router();

router.get("/owners", OwnersController.getAll);
router.get("/owners/:id", OwnersController.getById);
router.post("/owners", OwnersController.create);
router.put("/owners/:id", OwnersController.update);
router.delete("/owners/:id", OwnersController.remove);

export default router;