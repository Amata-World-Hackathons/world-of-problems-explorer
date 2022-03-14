import slug from "slug";
import { FeatureCollection, Point } from "geojson";
import React, { useEffect, useMemo, useState } from "react";

import {
  query,
  where,
  collection,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  doc,
  QueryConstraint,
} from "firebase/firestore";
import { firebaseDb } from "./globals/firebaseApp";

export type TechnologyProblems =
  | "technology"
  | "artificial intelligence"
  | "augmented reality";

export type HealthProblems =
  | "health"
  | "medicine"
  | "well-being"
  | "spirituality"
  | "exercise";

export type EnvironmentalProblems =
  | "environment"
  | "pollution"
  | "water-pollution"
  | "air-pollution"
  | "deforestation"
  | "endangered-species";

export type SocietalProblems =
  | "society"
  | "culture"
  | "history"
  | "poverty"
  | "obesity";

export type HumanitarianProblems =
  | "humanitarian"
  | "charity"
  | "disaster-relief"
  | "humanitarian-aid";

export type ProblemSpace =
  | TechnologyProblems
  | EnvironmentalProblems
  | HealthProblems
  | SocietalProblems
  | HumanitarianProblems;

export interface Project {
  id: string;
  name: string;
  tags: ProblemSpace[];
  contents: string;
  imageUrls: string[];
  projectLeadId: string;
  forkedFromProjectId?: string;
  status:
    | "abandoned"
    | "unknown"
    | "open-to-ideas"
    | "looking-for-collaborators"
    | "looking-for-volunteers"
    | "fundraising"
    | "research-and-development"
    | "active-development"
    | "mass-market";
  createdDate: Date;
  lastUpdated: Date;
  callToActionUrl?: string;
}

export interface ProjectAnchor {
  id: number;
  name: string;
  projectId: string;
  latitude: number;
  imageUrl?: string;
  longitude: number;
  relevance: number;
  contents: string;
  impactRange: "location" | "neighbourhood" | "state" | "country" | "continent";
  callToActionUrl?: string;
}

interface Api {
  query: () => void;
}

const ApiContext = React.createContext(null);

export const ApiContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return <ApiContext.Provider value={null}>{children}</ApiContext.Provider>;
};

export interface ApiResult<T> {
  data?: T;
  loading: boolean;
  error?: string;
}

export function useProjectQuery(projectId?: string, anchorId?: number) {
  const [result, setResult] = useState<
    ApiResult<{
      project: Project;
      anchor?: ProjectAnchor;
      anchors: ProjectAnchor[];
    }>
  >({ loading: true });
  const debouncedRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    // if (debouncedRef.current) {
    //   clearTimeout(debouncedRef.current);
    // }

    if (!projectId) {
      setResult({ loading: false });
      return;
    }

    async function exec() {
      const snapshot = await getDoc(
        doc(firebaseDb, "wope-projects", projectId!)
      );

      const asnapshots = await getDocs(
        query(collection(firebaseDb, "wope-project-anchors"))
      );

      let anchors: ProjectAnchor[] = [];
      asnapshots.forEach((doc) =>
        anchors.push({
          ...doc.data(),
          id: doc.id,
        } as any)
      );

      setResult({
        data: {
          anchors,
          project: {
            ...snapshot.data(),
            id: snapshot.id,
            createdDate: new Date(snapshot.data()!.createdDate.seconds * 1000),
            lastUpdated: new Date(snapshot.data()!.lastUpdated.seconds * 1000),
          } as any,
        },
        loading: false,
      });
    }

    exec();

    // (debouncedRef as any).current = setTimeout(async () => {
    //   const project = dummyProjects.find((p) => p.id === projectId)!;
    //   const anchors = dummyAnchors.filter((a) => a.projectId === projectId);
    //   const anchor = anchorId
    //     ? anchors.find((a) => a.id === anchorId)
    //     : undefined;

    //   setResult({
    //     data: { project, anchors, anchor },
    //     loading: false,
    //   });
    // }, 1000);
  }, [debouncedRef, anchorId, projectId]);

  useEffect(() => {
    if (projectId) {
      setResult({ loading: true });
    }
  }, [projectId, anchorId]);

  return result;
}

export function useProjectsQuery({
  skip,
  search,
}: {
  skip?: boolean;
  search?: string;
}) {
  const [result, setResult] = useState<ApiResult<Project[]>>({ loading: true });
  const debouncedRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debouncedRef.current) {
      clearTimeout(debouncedRef.current);
    }

    if (skip) {
      setResult({ loading: false });
      return;
    }

    async function exec() {}

    exec();

    (debouncedRef as any).current = setTimeout(async () => {
      const snapshots = await getDocs(
        query(collection(firebaseDb, "wope-projects"))
      );

      let filtered: Project[] = [];
      snapshots.forEach((doc) =>
        filtered.push({
          ...doc.data(),
          id: doc.id,
          createdDate: new Date(doc.data().createdDate.seconds * 1000),
          lastUpdated: new Date(doc.data().lastUpdated.seconds * 1000),
        } as any)
      );

      if (search) {
        const normalizedSearch = search.toLowerCase();
        filtered = filtered.filter(
          (project) =>
            project.name.toLowerCase().includes(normalizedSearch) ||
            project.tags.some((tag) => tag.includes(normalizedSearch))
        );
      }

      setResult({
        data: filtered,
        loading: false,
      });
    }, 300);
  }, [debouncedRef, search, skip]);

  useEffect(() => {
    setResult({ loading: true });
  }, [search]);

  return result;
}

const MAX_RELEVANCE = 10;

export interface ProjectAnchorsQueryParams {
  date?: Date;
  search?: string;
  tags?: ProblemSpace[];
  zoom?: number;
}

export function useProjectAnchorsQuery({
  date,
  search,
  tags,
  zoom,
}: ProjectAnchorsQueryParams) {
  const [result, setResult] = useState<
    ApiResult<FeatureCollection<Point, ProjectAnchor>>
  >({
    loading: true,
  });
  const debouncedRef = React.useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (debouncedRef.current) {
      clearTimeout(debouncedRef.current);
    }

    (debouncedRef as any).current = setTimeout(async () => {
      const snapshots = await getDocs(
        query(collection(firebaseDb, "wope-project-anchors"))
      );

      let filtered: ProjectAnchor[] = [];
      snapshots.forEach((doc) =>
        filtered.push({
          ...doc.data(),
          id: doc.id,
        } as any)
      );

      const projSnaps = await getDocs(
        query(collection(firebaseDb, "wope-projects"))
      );

      let projects: Project[] = [];
      projSnaps.forEach((doc) =>
        filtered.push({
          ...doc.data(),
          id: doc.id,
          createdDate: new Date(doc.data().createdDate.seconds * 1000),
          lastUpdated: new Date(doc.data().lastUpdated.seconds * 1000),
        } as any)
      );

      if (tags) {
        filtered = filtered.filter((anchor) => {
          const project = projects.find((p) => p.id === anchor.projectId);

          return project?.tags.some((tag) => tags.includes(tag));
        });
      }

      const data: FeatureCollection<Point, ProjectAnchor> = {
        type: "FeatureCollection",
        features: filtered.map((anchor) => {
          // const searchPenaltyFactor = !search ? 1 : anchor;
          return {
            id: anchor.id,
            type: "Feature",
            properties: { ...anchor, relevance: MAX_RELEVANCE },
            geometry: {
              type: "Point",
              coordinates: [anchor.longitude, anchor.latitude],
            },
          };
        }),
      };

      (debouncedRef as any).current = null;
      setResult({
        data,
        loading: false,
      });
    }, 1000);
  }, [debouncedRef, search, tags]);

  useEffect(() => {
    setResult({ loading: true });
  }, [search, tags]);

  return result;
}

async function createProject(project: Omit<Project, "id">) {
  // const docRef = await addDoc(collection(firebaseDb, "wope-projects"), project);
  const id = slug(project.name!, "-");
  const projectToAdd = {
    ...project,
    id,
  };

  await setDoc(doc(firebaseDb, "wope-projects", id), projectToAdd);

  return projectToAdd as Project;
}

async function editProject(project: Project) {
  await setDoc(doc(firebaseDb, "wope-projects", project.id), project);

  return project as Project;
}

export function useProjectMutations() {
  return useMemo(() => ({ createProject, editProject }), []);
}

async function createProjectAnchor(anchor: Omit<ProjectAnchor, "id">) {
  // const docRef = await addDoc(collection(firebaseDb, "wope-projects"), project);
  const id = Math.round(Math.random() * 1e7);
  const anchorToAdd = {
    ...anchor,
    id,
  };

  await setDoc(
    doc(firebaseDb, "wope-project-anchors", id.toString()),
    anchorToAdd
  );

  return anchorToAdd as ProjectAnchor;
}

export function useProjectAnchorMutations() {
  return useMemo(() => ({ createProjectAnchor }), []);
}
