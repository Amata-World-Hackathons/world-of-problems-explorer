import { useMapboxView } from "./MapboxMap";

const ZOOM_THRESHOLD_START_TRANSITION = 2.3;
const ZOOM_THRESHOLD_INTERACTABLE_DURATION = 0.7;

const AbstractSpaceOverlay: React.FC<
  React.HTMLAttributes<HTMLDivElement>
> = () => {
  const view = useMapboxView();

  if (view.loading || view.zoom > ZOOM_THRESHOLD_START_TRANSITION) {
    return null;
  }

  const opacity = Math.min(
    1.0,
    (ZOOM_THRESHOLD_START_TRANSITION - view.zoom) /
      ZOOM_THRESHOLD_INTERACTABLE_DURATION
  );

  return (
    <div
      className="absolute top-0 left-0 bottom-0 right-0 bg-slate-800 pointer-events-none z-10"
      style={{ opacity }}
    ></div>
  );
};

export default AbstractSpaceOverlay;
