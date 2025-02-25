import { Router } from "express";

const router = Router();
const version = "v1";

router.get("/", (req, res) => {
  res.json({ message: "Hello, world!" });
});

router.get("/test", (req, res) => {
  res.json({ message: "Test route" });
});

export default router;
