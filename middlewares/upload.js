import multer from "multer";
import patch from "path";
import { HttpError } from "../helpers/HttpError.js";

const destination = patch.resolve("tmp");
// console.log("destination", destination);
const storage = multer.diskStorage({
  destination,
  filename: (req, file, cb) => {
    const prefix = Date.now();
    //const newFileName = prefix + "_" + file.originalname;
    const newFileName = file.originalname;
    // console.log("newFileName", newFileName);
    cb(null, newFileName);
  },
});
const fileFilter = (req, file, cb) => {
  const extention = file.originalname.split(".").pop();
  //  console.log('file.originalname', file.originalname)
  if (extention !== "jpg" && extention !== "png") {
    cb(
      HttpError(
        404,
        `${extention} no valid extention file (alloved value "jpg" and "png")`
      )
    );
  }
};

const limits = {
  fileSize: 1024 * 1024 * 10,
};
//const upload = multer({ storage, limits, fileFilter });
const upload = multer({ storage});
export default upload;
