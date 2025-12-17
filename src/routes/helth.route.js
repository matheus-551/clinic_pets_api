import { Router } from "express";

const router = Router();

router.get("/helth", (req, res) => res.sendStatus(200).json({ message: "OK" }));

export default router;