import { useForm, useFieldArray } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { NextPage } from "next";
import { useEffect, useRef } from "react";

interface FormValues {
  questions: {
    text: string;
  }[];
}

const Home: NextPage = () => {
  const validationSchema = Yup.object<FormValues>().shape({
    questions: Yup.array().of(
      Yup.object().shape({
        text: Yup.string().required("Required"),
      })
    ),
  });

  const {
    control,
    register,
    formState: { errors },
    clearErrors,
    setValue,
    unregister,
    handleSubmit,
    trigger,
  } = useForm({
    mode: "onChange",
    resolver: yupResolver(validationSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "questions",
  });

  const isInitRender = useRef<boolean>(true);

  const appendQuestion = () => {
    append({ text: "" });

    if (errors.root?.type === "min") {
      clearErrors("root");
    }
  };

  useEffect(() => {
    if (!fields.length && !isInitRender.current) {
      trigger("questions");
    }

    if (isInitRender.current) {
      isInitRender.current = false;
    }
  }, [fields, register, setValue, unregister, trigger]);

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <h1>Yup Validation - Field Array</h1>
      {fields.map((question, questionIndex) => (
        <div key={question.id}>
          <input
            {...register(`questions[${questionIndex}].text`)}
            control={control}
            defaultValue=""
          />

          <button
            type="button"
            onClick={() => {
              remove(questionIndex);
              trigger();
            }}
          >
            Remove question {question.id}
          </button>
        </div>
      ))}
      <p>Errors: {JSON.stringify(errors)}</p>
      <button type="button" onClick={appendQuestion}>
        Add question
      </button>
      <input type="submit" />
    </form>
  );
};
export default Home;
