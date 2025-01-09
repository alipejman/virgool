import { ParseFilePipe, UploadedFiles } from "@nestjs/common";

export function uploadedOptionalFiles() {
  return UploadedFiles(
    new ParseFilePipe({
      fileIsRequired: false,
      validators: [],
    })
  );
}
