import classnames from "classnames";
import { useEffect, useRef } from "react";
import { useProjectQuery } from "../contexts/ApiContext";
import { bgColorForTag, mapQueryFor, textColorForTag } from "../utils";
import ReactMarkdown from "react-markdown";
import Loading from "./Loading";
import Link from "next/link";
import { Router, useRouter } from "next/router";

export interface ProjectOverlayProps
  extends React.HTMLAttributes<HTMLDivElement> {
  projectId?: string;
  anchorId?: number;
  onClose: () => void;
}

const ProjectOverlay: React.FC<ProjectOverlayProps> = ({
  className,
  anchorId,
  projectId,
  onClose,
  ...rest
}) => {
  const { data, loading } = useProjectQuery(projectId, anchorId);
  const onCloseRef = useRef(onClose);
  const projectIdRef = useRef(projectId);
  const router = useRouter();

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (projectIdRef.current && ev.key === "Escape") {
        console.log("CLOSE HERE");
        onCloseRef.current();
        ev.preventDefault();
        return false;
      }
    };
    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    projectIdRef.current = projectId;
  }, [projectId]);

  const referenceTag = data?.project.tags[0];
  const textColor = textColorForTag(referenceTag!);
  const bgColor = bgColorForTag(referenceTag!);

  return (
    <section
      className={classnames(
        "bg-slate-800 flex flex-col items-center p-4 transition-opacity duration-500 overflow-y-auto text-slate-300",
        className,
        {
          "opacity-0 pointer-events-none": !projectId,
          "opacity-100": projectId,
          "justify-center": loading,
        }
      )}
      {...rest}
    >
      {loading ? (
        <Loading className="flex-1" />
      ) : data ? (
        <div className="flex flex-col w-full max-w-3xl">
          <div className="flex flex-row justify-between items-center">
            {data.project.forkedFromProjectId ? (
              <span>
                <span>this is a fork, </span>
                <Link
                  href={{
                    pathname: "/projects/[projectId]",
                    query: { projectId: data.project.forkedFromProjectId },
                  }}
                >
                  <a
                    className={classnames(
                      "underline underline-offset-2",
                      textColor
                    )}
                  >
                    check out the original
                  </a>
                </Link>
              </span>
            ) : (
              <span>root project</span>
            )}

            <button className="text-xs" onClick={onClose}>
              ESC
            </button>
          </div>

          <div className={classnames("w-full h-1 my-4", bgColor)} />

          <div
            className="flex-none w-full h-96 bg-no-repeat bg-origin-border bg-center bg-cover my-4"
            style={{ backgroundImage: `url(${data.project.imageUrls[0]})` }}
          />

          <div className={classnames("w-full h-1 mb-4", bgColor)} />

          <h1 className={classnames("text-3xl mb-6 text-white")}>
            {data.project.name}
          </h1>

          <ul className="flex flex-row flex-wrap">
            {data.project.tags.map((tag) => (
              <li
                key={tag}
                className={classnames(
                  "mr-4 mb-2 underline underline-offset-2",
                  textColor
                )}
              >
                {tag}
              </li>
            ))}
          </ul>

          {data.project.proposedSolution ? (
            <>
              <span className="uppercase text-xs">
                {data.project.proposedSolution.status}
              </span>
            </>
          ) : (
            <div className="mt-2">
              This problem has no solution yet, be the first to{" "}
              <Link
                href={{
                  pathname: "/projects/[projectid]/fork",
                  query: { projectId: data.project.id },
                }}
              >
                <a
                  className={classnames(
                    "underline underline-offset-2",
                    textColor
                  )}
                >
                  propose one
                </a>
              </Link>
            </div>
          )}

          <div className={classnames("w-full h-1 my-4", bgColor)} />

          <section className="contents-markdown">
            <ReactMarkdown>{data.project.contents}</ReactMarkdown>
          </section>

          <div className={classnames("w-full h-1 my-4", bgColor)} />

          <h2 className="uppercase text-2xl mb-6">Where</h2>

          <div className={classnames("w-full h-0.5 my-4", bgColor)} />

          {data.anchors.map((anchor) => (
            <div key={anchor.id}>
              {anchor.imageUrl ? (
                <img
                  src={anchor.imageUrl}
                  alt={anchor.name}
                  className="m-auto max-w-full"
                />
              ) : null}

              <h3 className="text-xl mb-2">{anchor.name}</h3>

              <span>
                affects a{" "}
                <code className="uppercase text-sm">{anchor.impactRange}</code>{" "}
                around{" "}
              </span>
              <button
                className="underline underline-offset-2"
                onClick={() => {
                  router.push(
                    {
                      pathname: "/",
                      query: mapQueryFor(anchor),
                    },
                    undefined,
                    { shallow: true }
                  );
                }}
              >
                <code>
                  {anchor.latitude.toFixed(6)}, {anchor.longitude.toFixed(6)}
                </code>
              </button>

              <section>
                <ReactMarkdown>{anchor.description}</ReactMarkdown>
              </section>

              <div className={classnames("w-full h-0.5 my-4", bgColor)} />
            </div>
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default ProjectOverlay;
