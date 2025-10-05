import { Router } from "express";
import { extracurricularController } from "../controllers/ExtracurricularController";
import { authenticateToken, requireAdmin } from "../middleware/auth";

const router = Router();

// Public routes
router.get(
  "/",
  extracurricularController.getAllExtracurricular.bind(
    extracurricularController
  )
);
router.get(
  "/:id",
  extracurricularController.getExtracurricularById.bind(
    extracurricularController
  )
);

// Protected routes (admin only)
router.post(
  "/",
  authenticateToken,
  requireAdmin,
  extracurricularController.createExtracurricular.bind(
    extracurricularController
  )
);
router.put(
  "/:id",
  authenticateToken,
  requireAdmin,
  extracurricularController.updateExtracurricular.bind(
    extracurricularController
  )
);
router.delete(
  "/:id",
  authenticateToken,
  requireAdmin,
  extracurricularController.deleteExtracurricular.bind(
    extracurricularController
  )
);

export default router;
