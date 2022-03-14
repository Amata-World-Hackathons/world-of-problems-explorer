import type { NextPage } from "next";
import mapbox, { Map } from "mapbox-gl";
import { useForm } from "react-hook-form";
import { useRouter } from "next/router";

mapbox.accessToken =
  "pk.eyJ1IjoiYW1hdGFoYWNrc25qYW1zIiwiYSI6ImNsMHAzNWdkdDFnOHQzZHBlMmx0Mml6a3IifQ.aKW4wLfYZuEPgoisxwRjdw";

import Loading from "../../../../components/Loading";
import {
  ProblemSpace,
  Project,
  useProjectAnchorMutations,
  useProjectQuery,
} from "../../../../contexts/ApiContext";
import {
  ChangeEvent,
  ChangeEventHandler,
  useEffect,
  useRef,
  useState,
} from "react";
import { allTags, bgColorForTag, textColorForTag } from "../../../../utils";
import { useAuth } from "../../../../contexts/AuthContext";
import classnames from "classnames";
import { useResizeDetector } from "react-resize-detector";

const ProjectAnchorForm: React.FC<{ project: Project }> = ({ project }) => {
  const {
    width,
    height,
    ref: mapContainer,
  } = useResizeDetector<HTMLDivElement>();
  const router = useRouter();
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: "",
      imageUrl: project.imageUrls[0],
      contents: "",
      impactRange: "neighbourhood",
      callToActionUrl: project.callToActionUrl,
    },
  });
  const [tags, setTags] = useState<{ id: string; text: string }[]>(
    project ? project.tags.map((t) => ({ id: t, text: t })) : []
  );
  const [clickedCoords, setClickedCoords] = useState({
    lat: 0,
    lng: 0,
  });

  const { user } = useAuth();

  const { createProjectAnchor } = useProjectAnchorMutations();

  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>(project.imageUrls);

  const debounceRef = useRef<NodeJS.Timeout>();
  const mapRef = useRef<Map>(null);

  useEffect(() => {
    if (images.length < 1) return;
    setImageUrls(images.map((image) => URL.createObjectURL(image)));

    // uploadFile(images[0]);
  }, [images]);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return; // initialize map only once

    const map = new Map({
      container: mapContainer.current!,
      style: "mapbox://styles/amatahacksnjams/cl0p3l629000d15s8e4ekv0uj",
      center: [0, 0],
      zoom: 2,
      minZoom: 1,
    });

    (mapRef as { current: Map }).current = map;

    let marker: mapbox.Marker | null = null;
    map.on("click", (e) => {
      setClickedCoords({ lat: e.lngLat.lat, lng: e.lngLat.lng });

      if (marker) {
        marker.remove();
      }

      marker = new mapbox.Marker()
        .setLngLat([e.lngLat.lng, e.lngLat.lat])
        .addTo(map);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapContainer.current]);

  const referenceTag = project.tags[0];
  const textColor = textColorForTag(referenceTag!);
  const bgColor = bgColorForTag(referenceTag!);

  return (
    <section className="w-full max-w-xl m-auto mt-24">
      <h1 className={classnames("text-3xl mb-4", textColor)}>Impact marker</h1>

      <div className={classnames("my-4 h-1", bgColor)} />

      <form
        onKeyDown={(e) => e.stopPropagation()}
        onSubmit={handleSubmit(async (data) => {
          const changes = {
            name: data.name || "Untitled",
            projectId: project.id,
            latitude: clickedCoords.lat,
            longitude: clickedCoords.lng,
            impactRange: data.impactRange,
            imageUrl: imageUrls[0],
            contents: data.contents,
            callToActionUrl: data.callToActionUrl,
          };

          const anchor = await createProjectAnchor(changes as any);

          router.push({
            pathname: "/",
            query: {
              lat: anchor.latitude,
              lng: anchor.longitude,
              zoom: 13,
            },
          });
        })}
      >
        <label
          htmlFor="name"
          className="uppercase font-mono text-xs text-slate-200 mt-4"
        >
          Impact marker name:
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          className="w-full mb-4 py-2 px-1 text-slate-900"
          placeholder="e.g. Poverty struck neighbourhood will benefit from programme"
        />

        <div className={classnames("my-4 h-1", bgColor)} />

        <div ref={mapContainer} className="w-full h-72" />

        <label
          htmlFor="range"
          className="uppercase font-mono text-xs text-slate-200 mt-4"
        >
          Impact range:
        </label>
        <select
          id="range"
          {...register("range")}
          className="w-full max-w-sm block p-2 text-slate-900"
        >
          <option value="neighbourhood">Neighbourhood</option>
          <option value="state">State</option>
          <option value="country">Country</option>
          <option value="continent">Continent</option>
          <option value="location">Location</option>
        </select>

        <div className={classnames("my-4 h-1", bgColor)} />

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
        <div className={classnames("my-4 h-1", bgColor)} />

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

const NewProjectAnchorPage: NextPage = () => {
  const router = useRouter();
  const projectId = router.query.projectId as string;
  const { data } = useProjectQuery(projectId);

  return (
    <div className="bg-slate-800 text-slate-300 overflow-y-auto h-screen">
      {!data ? (
        <Loading className="block fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      ) : (
        <ProjectAnchorForm project={data.project} />
      )}
    </div>
  );
};

export default NewProjectAnchorPage;
