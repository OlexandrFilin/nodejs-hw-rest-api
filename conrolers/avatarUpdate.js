import Jimp from "jimp";
import path from "path";
import fs from "fs/promises";
import userModel from "../models/User.js";
import { HttpError } from "../helpers/HttpError.js";
import { isWrapperControler } from "../decorators/index.js";

const updateAvatars = async (req, res) => {
    //переміщуємо отриманий з запиту файл з папки tmp в папку  public/avatar
    //path - це  повний шлях до файлу, включаючі його назву в папці tmp
    //filename - імя файлу (звертати увагу на регістр не кемелкейс)
    const { path: pathFileTemp, filename } = req.file;
    const { _id } = req.user;
    //створюємо абсолютний шлях до нового розташування файлу для його перенесення з папки tmp
    try {
      const result = await Jimp.read(pathFileTemp);
      result.resize(250, 250).write(pathFileTemp);
      const extentFile = filename.split(".").pop();
      const newFileName = req.user.userName + "." + extentFile;
      const newPathAbsolute = path.resolve("public", "avatars", newFileName);
      await fs.rename(pathFileTemp, newPathAbsolute);
      const newPathRelative = path.join("avatars", newFileName);
      await userModel.findByIdAndUpdate(_id, { avatarURL: newPathRelative });
      res.json({
        user: {
          avatarURL: newPathRelative,
        },
      });
    } catch (error) {
      throw HttpError(500, "Failed attempt to change avatar ");
    }
  };
  const updateAvatar = isWrapperControler(updateAvatars);
  export default updateAvatar ;    
  