import { Request } from "express";
import { mkdirSync } from "fs";
import { extname, join } from "path";
import { BadRequestExeption } from "../enums/messages.enum";
import { BadRequestException } from "@nestjs/common";
import { diskStorage } from "multer";



export type File = Express.Multer.File;
export type callBackDestination = (error: Error, destination: string) => void
export type callBackFileName = (error: Error, fileName: string) => void
export function multerDestination(fieldName: string) {
  return function (
    req: Request,
    file: Express.Multer.File,
    callBack: callBackDestination
  ): void {
    let path = join("public", "uploads", fieldName);
    mkdirSync(path, { recursive: true });
    callBack(null, path);
  };
}
export function multerFileName(
  req: Request,
  file: Express.Multer.File,
  callBack: callBackFileName
): void {
  const ext = extname(file.originalname).toLocaleLowerCase();
  if (!IsValidFormat(ext)) {
    callBack(new BadRequestException(BadRequestExeption.InvalidTypePhoto), null);
  } else {
    const fileName = `${Date.now()}${ext}`;
    callBack(null, fileName);
  }
}

function IsValidFormat(ext: string) {
  return [".jpg", ".png", ".jpeg"].includes(ext);
}

export function multerStorage(folderName: string) {
  return diskStorage({
    destination: multerDestination(folderName),
    filename: multerFileName,
  });
}
