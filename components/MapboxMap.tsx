import _ from "lodash";
import turfDistance from "@turf/distance";
import mapbox, { Map } from "mapbox-gl";
import classnames from "classnames";
import { useResizeDetector } from "react-resize-detector";
import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import { FeatureCollection, MultiPolygon, Point, Polygon } from "geojson";
import {
  ApiResult,
  ProjectAnchor,
  ProjectAnchorsQueryParams,
  useProjectAnchorsQuery,
} from "../contexts/ApiContext";
import mapboxgl from "mapbox-gl";
import { useRouter } from "next/router";

mapbox.accessToken =
  "pk.eyJ1IjoiYW1hdGFoYWNrc25qYW1zIiwiYSI6ImNsMHAzNWdkdDFnOHQzZHBlMmx0Mml6a3IifQ.aKW4wLfYZuEPgoisxwRjdw";

const LAYERS_COUNTRIES = "countries-layer";
const LAYERS_ANCHORS = "anchors-layer";

const SOURCE_COUNTRIES = "countries";
const SOURCE_ANCHORS = "anchors";

export interface MapFocalRegion {
  name: string;
  type: "abstract" | "continent" | "country" | "state";
}

interface MapboxView {
  zoom: number;
  loading: boolean;
  focalRegion?: MapFocalRegion;
}

interface MapboxContextValue {
  view: MapboxView;
  projectAnchorsResult: ApiResult<FeatureCollection<Point, ProjectAnchor>>;
  setProjectAnchorsQuery: (params: ProjectAnchorsQueryParams) => void;
}

const MapboxContext = React.createContext<MapboxContextValue>({
  view: {
    zoom: 1,
    loading: true,
  },
  projectAnchorsResult: { loading: true },
  setProjectAnchorsQuery: () => {},
});

interface EnhancedPopup extends mapbox.Popup {
  _featureId?: string | number;
  _interacted: boolean;
}

export interface MapboxMapProps extends React.HTMLAttributes<HTMLDivElement> {
  onClickAnchor: (anchor: ProjectAnchor) => void;
}

const MapboxMap: React.FC<MapboxMapProps> = ({
  children,
  className,
  onClickAnchor,
}) => {
  const {
    width,
    height,
    ref: mapContainer,
  } = useResizeDetector<HTMLDivElement>();
  const mapRef = useRef<Map>(null);
  const onClickAnchorRef = useRef(onClickAnchor);
  const popupRef = useRef<EnhancedPopup>(null);
  const [center, setCenter] = useState<[number, number]>([
    -0.1440787, 51.501364,
  ]);
  const [zoom, setZoom] = useState(1);
  const [anchorsQuery, setAnchorsQuery] = useState<ProjectAnchorsQueryParams>(
    {}
  );
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const projectAnchorsResult = useProjectAnchorsQuery(anchorsQuery);

  console.log("ZOOM", zoom);

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return; // initialize map only once

    const map = new Map({
      container: mapContainer.current!,
      style: "mapbox://styles/amatahacksnjams/cl0p3l629000d15s8e4ekv0uj",
      center,
      zoom: zoom,
      minZoom: 0,
    });

    map.on("move", () => {
      const lat = map.getCenter().lat;
      const lng = map.getCenter().lng;
      setCenter([lng, lat]);
      setZoom(map.getZoom());
    });

    (mapRef as { current: Map }).current = map;

    map.on("load", () => {
      map.addSource(SOURCE_COUNTRIES, {
        type: "geojson",
        data: "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson",
      });

      map.addLayer({
        id: LAYERS_COUNTRIES,
        type: "fill",
        source: SOURCE_COUNTRIES,
        paint: {
          "fill-color": "rgba(200, 100, 240, 0.4)",
          "fill-color-transition": {
            delay: 1000,
            duration: 3000,
          },
          "fill-outline-color": "rgba(200, 100, 240, 1)",
        },
      });

      const IMG = "iconimg";
      const size = 200;
      map.addImage(
        IMG,
        {
          width: size,
          height: size,
          data: new Uint8ClampedArray(size * size * 4),

          onAdd: function () {
            const canvas = document.createElement("canvas");
            canvas.width = size;
            canvas.height = size;
            this.context = canvas.getContext("2d");
          },

          render: function () {
            const duration = 1000;
            const t = (performance.now() % duration) / duration;

            const radius = (size / 2) * 0.3;
            const outerRadius = (size / 2) * 0.7 * t + radius;
            const context = this.context;

            // Draw the outer circle.
            context.clearRect(0, 0, this.width, this.height);
            context.beginPath();
            context.arc(
              this.width / 2,
              this.height / 2,
              outerRadius,
              0,
              Math.PI * 2
            );
            context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
            context.fill();

            // Draw the inner circle.
            context.beginPath();
            context.arc(
              this.width / 2,
              this.height / 2,
              radius,
              0,
              Math.PI * 2
            );
            context.fillStyle = "rgba(255, 100, 100, 1)";
            context.strokeStyle = "white";
            context.lineWidth = 2 + 4 * (1 - t);
            context.fill();
            context.stroke();

            // Update this image's data with data from the canvas.
            this.data = context.getImageData(
              0,
              0,
              this.width,
              this.height
            ).data;

            // Continuously repaint the map, resulting
            // in the smooth animation of the dot.
            map.triggerRepaint();

            // Return `true` to let the map know that the image was updated.
            return true;
          },
        } as any,
        {
          pixelRatio: 2,
        }
      );

      map.addSource(SOURCE_ANCHORS, {
        type: "geojson",
        data: {
          type: "FeatureCollection",
          features: [],
        },
      });
      console.log("CALL ADD HERE");
      map.addLayer({
        id: LAYERS_ANCHORS,
        type: "symbol",
        source: SOURCE_ANCHORS,
        layout: {
          "icon-image": IMG,
        },
      });

      map.on("click", LAYERS_ANCHORS, (e) => {
        if (!consumeEvent(e)) return;
        console.log("CLICKED ANCHOR", e, e.features![0]);

        if (onClickAnchorRef.current) {
          onClickAnchorRef.current(e.features![0].properties as ProjectAnchor);
        }
        // setPopupToFeature(e.features![0]);
      });

      map.on("click", LAYERS_COUNTRIES, (e) => {
        if (!consumeEvent(e)) return;
        console.log("CLICKED COUNTRY", e);

        zoomToFeature(map, e.features![0]);
      });

      map.on("mouseenter", LAYERS_COUNTRIES, () => {
        map.getCanvas().style.cursor = "pointer";
      });

      map.on("mouseleave", LAYERS_COUNTRIES, () => {
        map.getCanvas().style.cursor = "";
      });

      map.on("mouseenter", LAYERS_ANCHORS, (e) => {
        console.log("ENTER", e, e.features![0]);
        // setPopupToFeature(e.features![0]);
        map.getCanvas().style.cursor = "pointer";
      });

      function consumeEvent(ev: mapbox.MapMouseEvent) {
        if (ev.originalEvent.cancelBubble) return false;
        ev.originalEvent.cancelBubble = true;
        ev.originalEvent.preventDefault();

        return true;
      }

      function setPopupToFeature(feature: mapbox.MapboxGeoJSONFeature) {
        if (
          popupRef.current?._featureId &&
          popupRef.current._featureId === feature.properties?.id
        )
          return;

        const geometry = feature.geometry as Point;
        if (popupRef.current) {
          const popup = popupRef.current;
          popup.removeClassName("opacity-100");
          popup.addClassName("opacity-0");
          setTimeout(() => {
            popup.remove();
          }, 3000);
        }

        const newPopup = new mapboxgl.Popup({
          offset: 20,
          closeButton: false,
          focusAfterOpen: false,
        })
          .setLngLat(geometry.coordinates as any)
          .setHTML(`<p>${JSON.stringify(feature.properties)}</p>`)
          .addTo(map) as EnhancedPopup;

        newPopup.addClassName(
          "opacity-100 transition-opacity duration-700 rounded-lg"
        );
        newPopup._featureId = feature.id;
        newPopup._interacted = true;
        (popupRef as any).current = newPopup;
      }

      setLoading(false);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapContainer.current]);

  useEffect(() => {
    if (window.location.hash) {
      const match = window.location.hash.match(/\/-?\d+(\.\d+)?/g);

      if (match) {
        mapRef.current?.setCenter([
          parseFloat(match[1].replace("/", "")),
          parseFloat(match[0].replace("/", "")),
        ]);
        mapRef.current?.setZoom(parseFloat(match[2].replace("/", "")));
        setTimeout(() => router.replace({ hash: "" }), 300);
      }
    }
  }, [router]);

  useEffect(() => {
    if (mapRef.current) {
      mapRef.current.resize();
    }
  }, [width, height, mapRef]);

  useEffect(() => {
    if (!mapRef.current) return;

    const projectAnchors = projectAnchorsResult.data;

    if (projectAnchors) {
      const impl = mapRef.current.getSource(SOURCE_ANCHORS) as
        | mapbox.GeoJSONSource
        | undefined;
      if (impl) {
        impl.setData(projectAnchors);
      }
    } else {
    }
  }, [mapRef, projectAnchorsResult.data]);

  const contextValue = useMemo(
    () => ({
      view: {
        zoom,
        loading,
      },
      projectAnchorsResult,
      setProjectAnchorsQuery: setAnchorsQuery,
    }),
    [loading, zoom, projectAnchorsResult]
  );

  return (
    <div ref={mapContainer} className={classnames(className, "relative")}>
      <MapboxContext.Provider value={contextValue}>
        {children}
      </MapboxContext.Provider>
    </div>
  );
};

export function useMapboxView() {
  return useContext(MapboxContext).view;
}

export function useGlobalProjectAnchorsQuery(
  params: ProjectAnchorsQueryParams
) {
  const { projectAnchorsResult, setProjectAnchorsQuery } =
    useContext(MapboxContext);

  useEffect(() => {
    setProjectAnchorsQuery(params);
  }, [setProjectAnchorsQuery, params]);

  return projectAnchorsResult;
}

export default MapboxMap;

function zoomToFeature(map: mapbox.Map, feature: mapbox.MapboxGeoJSONFeature) {
  const { geometry } = feature;

  let bounds = null;
  switch (geometry.type) {
    case "MultiPolygon": {
      const { coordinates } = geometry as MultiPolygon;
      const firstCoords = coordinates[0][0] as any;
      bounds = new mapbox.LngLatBounds(firstCoords[0], firstCoords[0]);

      for (let s1 of coordinates) {
        for (let s2 of s1) {
          for (let coord of s2) {
            bounds.extend(coord as any);
          }
        }
      }

      break;
    }

    case "Polygon": {
      const { coordinates } = geometry as Polygon;
      const firstCoords = coordinates[0] as any;
      bounds = new mapbox.LngLatBounds(firstCoords[0], firstCoords[0]);

      for (let polygon of coordinates) {
        for (let coord of polygon) {
          bounds.extend(coord as any);
        }
      }

      break;
    }

    default: {
      const { coordinates } = geometry as any;
      bounds = new mapbox.LngLatBounds(coordinates[0], coordinates[0]);
      for (let coord of coordinates) {
        bounds.extend(coord);
      }
      break;
    }
  }

  map.fitBounds(bounds, { padding: 5 });
}
