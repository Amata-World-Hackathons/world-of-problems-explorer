import _ from "lodash";
import classnames from "classnames";
import React, { useEffect, useRef, useState } from "react";
import { Project, useProjectsQuery } from "../contexts/ApiContext";
import Loading from "./Loading";
import Link from "next/link";

interface TextWithMatchProps extends React.HTMLAttributes<HTMLSpanElement> {
  match?: string;
  children: string;
  matchClassName?: string;
}

const TextWithMatch: React.FC<TextWithMatchProps> = ({
  match,
  children,
  matchClassName = "font-bold underline underline-offset-2",
}) => {
  const regex = new RegExp(match || "", "ig");
  const matches = children.match(regex);
  const parts =
    match && matches
      ? (_.flatten(
          _.zip(
            children.split(regex).map((t) => ({ text: t, match: false })),
            matches.map((t) => ({ text: t, match: true }))
          )
        ).filter((a) => a) as { text: string; match: boolean }[])
      : [{ text: children, match: false }];

  return (
    <>
      {parts.map(({ text, match: isMatch }, index) => (
        <span
          key={index}
          className={classnames({
            [matchClassName]: isMatch,
          })}
        >
          {text}
        </span>
      ))}
    </>
  );
};

export interface ProjectSearchInputProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onSelectProject: (projectId: string) => void;
}

const ProjectsSearchInput: React.FC<ProjectSearchInputProps> = ({
  className,
  onSelectProject,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [active, setActive] = useState(false);
  const isActiveRef = useRef(active);
  const [search, setSearch] = useState("");
  const [activeProject, setActiveProject] = useState<Project | undefined>();

  const { data, loading } = useProjectsQuery({ skip: !active, search });

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      if (ev.key === "/" && !isActiveRef.current) {
        ev.preventDefault();
        setActive(true);
        inputRef.current?.focus();
        return false;
      } else if (ev.key === "Escape") {
        ev.preventDefault();
        setActive(false);
        return false;
      }
    };
    window.addEventListener("keydown", listener);

    return () => window.removeEventListener("keydown", listener);
  }, []);

  useEffect(() => {
    isActiveRef.current = active;
    if (!active) {
      setActiveProject(undefined);
      inputRef.current?.blur();
      setSearch("");
    }
  }, [active]);

  useEffect(() => {
    setActiveProject(undefined);
  }, [search]);

  return (
    <>
      <div
        className={classnames(
          "fixed top-0 bottom-0 left-0 right-0 transition-opacity duration-300 bg-slate-800 z-30",
          {
            "opacity-0 pointer-events-none": !active,
            "opacity-90 pointer-events-auto": active,
          }
        )}
        onClick={() => setActive(false)}
      />
      <div
        className={classnames("transition duration-300 flex flex-col", {
          [className || ""]: !active,
          "w-72": !active,
          "fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-screen w-full max-w-lg py-14 z-40":
            active,
        })}
      >
        <input
          ref={inputRef}
          type="text"
          value={search}
          placeholder="Quick search..."
          className={classnames("py-2 px-4 rounded-full w-full")}
          onKeyDown={(e) => {
            switch (e.key) {
              case "ArrowDown": {
                if (!data || data.length! < 0) {
                  break;
                }
                const index = activeProject
                  ? data?.findIndex((p) => p.id === activeProject.id)
                  : undefined;
                const newIndex = Number.isFinite(index)
                  ? (index! + 1) % data.length
                  : 0;
                if (data[newIndex]) {
                  setActiveProject(data[newIndex]);
                }
                break;
              }

              case "ArrowUp": {
                if (!data || data.length! < 0) {
                  break;
                }
                const index = activeProject
                  ? data?.findIndex((p) => p.id === activeProject.id) ||
                    data.length
                  : data.length;
                const newIndex = index - 1;
                if (data[newIndex]) {
                  setActiveProject(data[newIndex]);
                }
                break;
              }

              case "Enter":
                if (activeProject) {
                  setActive(false);
                  onSelectProject(activeProject.id);
                  e.stopPropagation();
                  e.preventDefault();
                  return false;
                }
                break;

              case "Escape":
                setActive(false);
                e.stopPropagation();
                e.preventDefault();
                return false;
                break;

              default:
                break;
            }

            return false;
          }}
          onFocus={() => setActive(true)}
          onChange={(ev) => setSearch(ev.target.value)}
        />

        <ul
          className={classnames("flex-1 flex flex-col w-full", {
            hidden: !active,
            "py-8": active,
          })}
        >
          {loading ? (
            <li className="flex-1 w-full p-4 flex flex-col justify-center items-center">
              <Loading />
            </li>
          ) : (
            (active ? data || [] : []).map((project) => (
              <li
                key={project.id}
                className={classnames(
                  "w-full p-4 rounded-lg mb-2",
                  activeProject?.id && activeProject.id === project.id
                    ? "bg-blue-400"
                    : "bg-slate-100"
                )}
              >
                <Link
                  href={{
                    pathname: "/projects/[projectId]",
                    query: { projectId: project.id },
                  }}
                >
                  <a
                    onClick={() => setActive(false)}
                    className="hover:underline underline-offset-2"
                  >
                    <TextWithMatch match={search}>{project.name}</TextWithMatch>
                  </a>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </>
  );
};

export default ProjectsSearchInput;
