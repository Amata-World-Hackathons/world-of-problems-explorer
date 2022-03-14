import type { NextPage } from "next";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { WithContext as ReactTags } from "react-tag-input";

import Loading from "../../components/Loading";
import { ProblemSpace, useProjectQuery } from "../../contexts/ApiContext";
import { useState } from "react";
import { allTags } from "../../utils";

const allTagsAsSuggestions = allTags.map((tag) => ({ id: tag, text: tag }));

const NewProjectPage: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;
  const { data, loading } = useProjectQuery(projectId);
  const [tags, setTags] = useState<{ id: string; text: string }[]>([]);

  const { register, handleSubmit } = useForm();
  const [startDate, setStartDate] = useState(new Date());

  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: { id: string; text: string }) => {
    setTags([...tags, tag]);
  };

  return (
    <div className="bg-slate-800 text-slate-300 overflow-y-auto min-h-screen">
      {loading ? (
        <Loading className="block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <section className="w-full max-w-xl m-auto mt-24">
          <h1 className="text-3xl mb-4">Start a new project</h1>

          <form
            onSubmit={handleSubmit((data) => {
              console.log("DO SOMETHING HERE");
            })}
          >
            <input
              type="text"
              {...register("name")}
              className="w-full mb-4 py-2 px-1"
              placeholder="The name of your project"
            />

            <ReactTags
              tags={tags}
              suggestions={allTagsAsSuggestions}
              handleAddition={handleAddition}
              handleDelete={handleDelete}
            />

            <DatePicker
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              className="mb-4 px-1 py-2"
            />

            <textarea
              {...register("contents")}
              rows={10}
              className="w-full p-2"
              placeholder="The contents of the page"
            />
            <small className="text-slate-400 text-xs">
              Markdown format is supported
            </small>
          </form>
        </section>
      )}
    </div>
  );
};

export default NewProjectPage;
