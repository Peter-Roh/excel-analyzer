import Head from "next/head";
import {
  type Dispatch,
  type SetStateAction,
  type UIEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { useDropzone } from "react-dropzone";

import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Footer from "@/components/pages/footer";
import Modal from "@/components/pages/modal";
import {
  DownloadIcon,
  FileTextIcon,
  QuestionMarkIcon,
} from "@radix-ui/react-icons";
import { readExcel } from "@/lib/utils";

type BeforeDropProps = {
  setExcelFile: Dispatch<SetStateAction<File | undefined>>;
  setData: Dispatch<SetStateAction<unknown[] | undefined>>;
};

type AfterDropProps = {
  data: unknown[] | undefined;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

function BeforeDrop({ setExcelFile, setData }: BeforeDropProps) {
  const FILE_EXTENSION = ["csv", "xlsx", "xls"];

  const validator = (file: File) => {
    if (file.size / 1024 / 1024 > 3) {
      return {
        code: "size-too-large",
        message: "file is larger than 3 MB",
      };
    }

    if (
      !FILE_EXTENSION.includes(
        file?.name?.split(".").pop()?.toLowerCase() ?? "",
      )
    ) {
      return {
        code: "file-invalid-type",
        message: "Only .csv, .xlsx, or .xls files are allowed.",
      };
    }

    return null;
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const showExcelFile = async (file: File) => {
        const fileData = await readExcel(file);
        setData(fileData);
      };

      if (acceptedFiles[0]) {
        void showExcelFile(acceptedFiles[0]);
        setExcelFile(acceptedFiles[0]);
      }
    },
    [setExcelFile, setData],
  );

  const { getRootProps, getInputProps, isDragActive, fileRejections } =
    useDropzone({
      onDrop,
      validator,
    });

  useEffect(() => {
    if (fileRejections.length > 0) {
      alert(fileRejections[0]?.errors[0]?.message);
    }
  }, [fileRejections]);

  return (
    <>
      <div
        {...getRootProps()}
        className={`flex-y-center mx-auto my-auto min-h-[65vh] w-4/5 cursor-pointer rounded-md border border-dashed ${isDragActive ? "border-emerald-600 bg-gray-200 text-emerald-600" : "border-gray-500 text-gray-500"}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <>
            <FileTextIcon className="h-16 w-16" />
            <span className="mt-4">Drop your file here.</span>
          </>
        ) : (
          <>
            <DownloadIcon className="h-16 w-16" />
            <span className="mt-4 px-4 text-center">
              Drop your excel file. (Only .csv, .xlsx, or .xls file / max size 3
              MB)
            </span>
          </>
        )}
      </div>
      <Footer />
    </>
  );
}

function AfterDrop({ data, setOpen }: AfterDropProps) {
  const [excelData, setExcelData] = useState<unknown[]>([]);
  const [page, setPage] = useState(0);
  const [more, setMore] = useState(true);

  const handleScroll = (event: UIEvent<HTMLElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollHeight - scrollTop <= clientHeight * 1.5) {
      if (more) {
        setPage((prevPage) => prevPage + 1);
      }
    }
  };

  useEffect(() => {
    if (more && data) {
      const newData = data.slice(50 * page, 50 * (page + 1));
      setExcelData((prev) => [...prev, ...newData]);
      if (newData.length < 50) {
        setMore(false);
      }
    }
  }, [page, data, more]);

  return (
    <>
      <div className="flex-x-center px-2 pb-4">
        <Button
          className="w-full text-emerald-700 dark:text-emerald-400 lg:w-1/3"
          variant="outline"
          onClick={() => setOpen(true)}
        >
          <QuestionMarkIcon className="h-4 w-4 stroke-2" />
          Ask AI
        </Button>
      </div>
      <div
        className="h-[85vh] w-full overflow-y-auto px-4 pb-4 scrollbar-hide"
        onScroll={handleScroll}
      >
        <Table>
          <TableBody>
            {excelData.map((row, rowIdx) => {
              return (
                <TableRow key={rowIdx}>
                  {(row as unknown[]).map((cell, cellIdx) => {
                    return (
                      <TableCell
                        key={cellIdx}
                        className="border px-2 py-1 text-center"
                      >
                        {cell as string}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

export default function Home() {
  const [excelFile, setExcelFile] = useState<File>();
  const [data, setData] = useState<unknown[]>();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      <Head>
        <title>Excel Analyzer</title>
      </Head>
      <div className="flex-y h-screen min-h-screen w-full">
        <div className="mx-auto py-8 text-center text-3xl font-bold text-emerald-700 underline underline-offset-2 dark:text-emerald-500">
          Excel Analyzer
        </div>
        {excelFile ? (
          <AfterDrop data={data} setOpen={setOpen} />
        ) : (
          <BeforeDrop setExcelFile={setExcelFile} setData={setData} />
        )}
      </div>
      <Modal open={open} setOpen={setOpen} />
    </>
  );
}
