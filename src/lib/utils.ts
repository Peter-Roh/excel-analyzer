import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { read, utils } from "xlsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const readExcel = (file: File) => {
  return new Promise<unknown[]>((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target!.result as ArrayBuffer);
      const workbook = read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0]!;
      const sheet = workbook.Sheets[sheetName]!;
      const excelData = utils.sheet_to_json(sheet, { header: 1 });
      resolve(excelData);
    };

    reader.onerror = (err) => {
      reject(err);
    };

    reader.readAsArrayBuffer(file);
  });
};
