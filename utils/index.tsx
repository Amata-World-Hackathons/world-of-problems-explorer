import { ProblemSpace, ProjectAnchor } from "../contexts/ApiContext";

type Subject =
  | "technology"
  | "health"
  | "environment"
  | "society"
  | "humanitarian"
  | "unknown";

export function subjectForTag(tag: ProblemSpace): Subject {
  switch (tag) {
    case "technology":
    case "artificial intelligence":
    case "augmented reality":
      return "technology";

    case "health":
    case "medicine":
    case "well-being":
    case "spirituality":
    case "exercise":
      return "health";

    case "environment":
    case "pollution":
    case "water-pollution":
    case "air-pollution":
    case "deforestation":
    case "endangered-species":
      return "environment";

    case "society":
    case "culture":
    case "history":
    case "poverty":
    case "obesity":
      return "society";

    case "charity":
    case "humanitarian":
    case "disaster-relief":
    case "humanitarian-aid":
      return "humanitarian";
  }
}

export function bgColorForTag(tag: ProblemSpace) {
  const subject = subjectForTag(tag);

  switch (subject) {
    case "environment":
      return "bg-green-500";

    case "health":
      return "bg-pink-500";

    case "humanitarian":
      return "bg-red-500";

    case "society":
      return "bg-teal-500";

    case "technology":
      return "bg-sky-500";

    default:
      return "bg-slate-500";
  }
}

export function textColorForTag(tag: ProblemSpace) {
  const subject = subjectForTag(tag);

  switch (subject) {
    case "environment":
      return "text-green-500";

    case "health":
      return "text-pink-500";

    case "humanitarian":
      return "text-red-500";

    case "society":
      return "text-teal-500";

    case "technology":
      return "text-sky-500";

    default:
      return "text-slate-500";
  }
}

export function hashUrlForAnchor(anchor: ProjectAnchor) {
  let zoom = 2.1;
  switch (anchor.impactRange) {
    case "location":
      zoom = 15;
      break;

    case "neighbourhood":
      zoom = 12;
      break;

    case "state":
      zoom = 9.8;
      break;

    case "country":
      zoom = 7;
      break;

    case "continent":
      zoom = 4;
      break;
  }

  return `/${anchor.latitude}/${anchor.longitude}/${zoom}`;
}
