import type { NextPage } from "next";
import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";

import { type RouterInputs, api } from "@/utils/api";
import { Cross1Icon } from "@radix-ui/react-icons";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ModalProps = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  filePath: string | undefined;
};

type FormValues = RouterInputs["data"]["analyze"];

const Modal: NextPage<ModalProps> = ({ open, setOpen, filePath }) => {
  const [response, setResponse] = useState<string>();
  const [writeQuestion, setWriteQuestion] = useState(false);
  const questions = [
    "Tell me about the data",
    "How do I find CustomerID who bought biggest Quantity?",
  ]; // preset questions about data

  const { mutateAsync, isSuccess, isPending } = api.data.analyze.useMutation();

  const { register, handleSubmit, setValue } = useForm<FormValues>();

  const onValid: SubmitHandler<FormValues> = ({ path, question }) => {
    void mutateAsync({ path, question }).then((res) => {
      if (res.data) {
        setResponse(res.data);
      }
    });
  };

  const handleValueChange = (value: string) => {
    if (value !== "None") {
      setWriteQuestion(false);
      setValue("question", value);
    } else {
      setWriteQuestion(true);
      setValue("question", "");
    }
  };

  useEffect(() => {
    if (filePath) {
      setValue("path", filePath);
    }
  }, [filePath, setValue]);

  return (
    <div
      className={`${open ? "flex-x-center" : "hidden"} fixed left-0 top-0 h-full w-full bg-gray-500 bg-opacity-50`}
    >
      <div className="flex-y mx-2 h-2/3 w-full overflow-scroll rounded-md bg-white dark:bg-slate-700 lg:w-2/3">
        <div className="flex items-center justify-end">
          <Cross1Icon
            className="m-2 cursor-pointer"
            onClick={() => setOpen(false)}
          />
        </div>
        <div className="mx-2 mt-2">
          <div className="flex-x-center font-sans text-xl font-semibold">
            Ask your AI data analyst about the data!
          </div>
          <div className="mt-4">
            <form
              className="flex flex-col items-end space-y-1 lg:flex-row lg:items-start lg:space-y-0"
              onSubmit={handleSubmit(onValid)}
            >
              <div className="w-full">
                <Select onValueChange={handleValueChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a question" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Questions</SelectLabel>
                      {questions.map((question, idx) => {
                        return (
                          <SelectItem key={idx} value={question}>
                            {question}
                          </SelectItem>
                        );
                      })}
                      <SelectItem value="None">
                        Write a question myself
                      </SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {writeQuestion && (
                  <Input
                    className="mt-1"
                    {...register("question", {
                      required: true,
                    })}
                    placeholder="Write a question you want to ask to AI data analyst."
                  />
                )}
              </div>
              <div className="flex pl-0.5">
                <Button variant="outline">Ask</Button>
              </div>
            </form>
          </div>
          {isPending && (
            <div className="mt-2 text-center text-sm text-gray-700 dark:text-white">
              Waiting for AI&apos;s analysis...
            </div>
          )}
          {isSuccess && (
            <div className="mt-2 whitespace-pre-wrap text-gray-700 dark:text-white">
              {response}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
