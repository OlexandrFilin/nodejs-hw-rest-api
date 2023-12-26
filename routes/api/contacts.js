import { Router } from "express";

import contactControler from "../../conrolers/contacts-controler.js";

import isEmptyBody from "../../middlewares/isEmptyBody.js";
import isValidId from "../../middlewares/isValidID.js";
import { validateAccordingSchema } from "../../decorators/index.js";
import {
  addShemaContact,
  updateShemaContact,
  updateShemaContactFavorite,
} from "../../models/Contacts.js";

const { getAll, getById, add, update, remove, updateFavorite } =
  contactControler;

const router = Router();

router.get("/", getAll);

router.get("/:contactId", isValidId, getById);

router.post("/", isEmptyBody, validateAccordingSchema(addShemaContact), add);
router.put(
  "/:contactId",
  isValidId,
  isEmptyBody,
  validateAccordingSchema(updateShemaContact),
  update
);
router.patch(
  "/:contactId/favorite",
  isValidId,
  validateAccordingSchema(updateShemaContactFavorite,"missing field favorite"),
  updateFavorite
);

router.delete("/:contactId", isValidId, remove);

export default router;
