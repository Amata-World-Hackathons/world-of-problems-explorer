import type { NextPage } from "next";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";
import { WithContext as ReactTags } from "react-tag-input";

import Loading from "../../components/Loading";
import {
  ProblemSpace,
  Project,
  useProjectMutations,
  useProjectQuery,
} from "../../contexts/ApiContext";
import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { allTags } from "../../utils";
import { useFileUploadService } from "../../contexts/FileUploadContext";
import { useAuth } from "../../contexts/AuthContext";

const allTagsAsSuggestions = allTags.map((tag) => ({ id: tag, text: tag }));

const ProjectForm: React.FC<{ project?: Project }> = ({ project }) => {
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: { ...project, imageUrl: project?.imageUrls[0] },
  });
  const [tags, setTags] = useState<{ id: string; text: string }[]>(
    project ? project.tags.map((t) => ({ id: t, text: t })) : []
  );

  const { user } = useAuth();

  const { createProject, editProject } = useProjectMutations();

  const { uploadFile } = useFileUploadService();

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(
    project ? project.imageUrls : []
  );

  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (images.length < 1) return;
    setImageUrls(images.map((image) => URL.createObjectURL(image)));

    // uploadFile(images[0]);
  }, [images]);

  function onImageChange(e: ChangeEvent<HTMLInputElement>) {
    // @ts-ignore
    setImages([...e.target.files!]);
  }

  const handleDelete = (i: number) => {
    setTags(tags.filter((tag, index) => index !== i));
  };

  const handleAddition = (tag: { id: string; text: string }) => {
    setTags([...tags, tag]);
  };

  return (
    <section className="w-full max-w-xl m-auto mt-24 px-2">
      <h1 className="text-3xl mb-4">Project details</h1>

      <hr className="my-4" />

      <form
        onKeyDown={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(async (data) => {
          const now = new Date();

          const changes = {
            name: data.name || "Untitled",
            tags: tags.map((t) => t.id as ProblemSpace),
            status: data.status || "unknown",
            contents: data.contents,
            createdDate: now,
            lastUpdated: now,
            callToActionUrl: data.callToActionUrl,
            projectLeadId: user!.uid,
            imageUrls,
          };

          let newProject: Project = changes as any;
          if (router.pathname.includes("edit")) {
            newProject = await editProject({ ...project, ...changes } as any);
          } else if (router.pathname.includes("fork")) {
            newProject = await createProject({
              ...changes,
              forkedFromProjectId: project!.id,
            } as any);
          } else {
            newProject = await createProject(changes as any);
          }

          router.push({
            pathname: "/projects/[projectId]",
            query: { projectId: newProject.id },
          });
        })}
      >
        <label
          htmlFor="name"
          className="uppercase font-mono text-xs text-slate-200 mt-4"
        >
          Project name:
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full mb-4 py-2 px-1 text-slate-900"
          placeholder="The name of your project"
        />

        <label
          htmlFor="tags"
          className="uppercase font-mono text-xs text-slate-200 mt-4"
        >
          Problem category:
        </label>
        <ReactTags
          id="tags"
          tags={tags}
          placeholder="charity, humanitarian, etc."
          suggestions={allTagsAsSuggestions}
          handleAddition={handleAddition}
          handleDelete={handleDelete}
          autocomplete
        />

        <label
          htmlFor="status"
          className="uppercase font-mono text-xs text-slate-200 mt-4"
        >
          Project status:
        </label>
        <select
          id="status"
          {...register("status")}
          className="w-full max-w-sm block p-2 text-slate-900"
        >
          <option value="unknown">Unknown</option>
          <option value="open-to-ideas">Open to ideas</option>
          <option value="looking-for-collaborators">
            Looking for collaboration
          </option>
          <option value="looking-for-volunteers">Looking for volunteers</option>
          <option value="fundraising">Fundraising</option>
          <option value="research-and-development">
            Research &#38; development
          </option>
          <option value="active-development">Active development</option>
          <option value="mass-market">Mass market</option>
          <option value="abandoned">Abandoned</option>
        </select>

        <hr className="my-4" />

        {imageUrls.map((imageUrl) => (
          <img
            key={imageUrl}
            src={imageUrl}
            alt="something"
            className="m-auto"
          />
        ))}

        <label
          htmlFor="imageUrl"
          className="uppercase font-mono text-xs text-slate-200 mt-4"
        >
          Image URLs:
        </label>
        <input
          id="name"
          type="text"
          {...register("imageUrl")}
          className="w-full mb-4 py-2 px-1 text-slate-900"
          placeholder="Link to a self-hosted image"
          onChange={(e) => {
            if (debounceRef.current) {
              clearTimeout(debounceRef.current);
            }

            debounceRef.current = setTimeout(() => {
              setImageUrls([e.target.value]);
            }, 500);
          }}
        />

        {/* <input type="file" accept="image/*" onChange={onImageChange} /> */}
        <hr className="my-4" />

        <label
          htmlFor="contents"
          className="uppercase font-mono text-xs text-slate-200 mt-4"
        >
          Page contents:
        </label>
        <textarea
          id="contents"
          {...register("contents")}
          rows={10}
          className="w-full p-2 text-slate-900"
          placeholder="The contents of the page"
        />
        <small className="text-slate-400 text-xs block">
          Markdown format is supported
        </small>

        <label
          htmlFor="contents"
          className="uppercase font-mono text-xs text-slate-200 mt-4"
        >
          Call to action (optional):
        </label>
        <input
          type="text"
          {...register("callToActionUrl")}
          className="w-full mb-2 py-2 px-1 text-slate-900"
          placeholder="https://mycharity.com/fundraiseme"
        />
        <small className="text-slate-400 text-xs block mb-4">
          A link to a call to action for those who would like to know more
        </small>

        <div className="flex flex-row justify-end">
          <button
            type="button"
            className="py-2 px-4"
            onClick={() =>
              project
                ? router.push({
                    pathname: "/projects/[projectId]",
                    query: { projectId: project.id },
                  })
                : router.push("/")
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            className="py-2 px-4 rounded-lg border-2 border-cyan-600 shadow-sm shadow-cyan-600"
          >
            Submit
          </button>
        </div>

        <hr className="my-4" />
      </form>
    </section>
  );
};

const NewProjectPage: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string | undefined;
  const { data, loading } = useProjectQuery(projectId);

  return (
    <div className="bg-slate-800 text-slate-300 overflow-y-auto h-screen">
      {loading ? (
        <Loading className="block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <ProjectForm project={data?.project} />
      )}
    </div>
  );
};

export default NewProjectPage;
