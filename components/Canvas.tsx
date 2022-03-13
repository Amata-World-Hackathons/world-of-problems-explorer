import * as d3 from "d3";
import classnames from "classnames";
import { useResizeDetector } from "react-resize-detector";
import { useEffect, useRef, useState } from "react";

// "pk.eyJ1IjoiYW1hdGFicnlhbiIsImEiOiJjbDBwMm4wZ2ExcXZvM2pwd3RjMzdibjJmIn0.6tfNsOc97LQrfnI4JvE4oA"

export default function Canvas({ className }: { className?: string }) {
  const {
    width = 0,
    height = 0,
    ref: parentRef,
  } = useResizeDetector<HTMLDivElement>();
  const svgRef = useRef<SVGSVGElement>(null);
  const [geojson, setGeojson] = useState();

  useEffect(() => {
    async function exec() {
      if (svgRef.current) {
        svgRef.current.addEventListener("wheel", (e) => {
          console.log("WHEEL", e);
        });
      }

      const resp = await fetch(
        "https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson"
      );
      const data = await resp.json();

      console.log("ALL GEO", data);

      setGeojson(data);
    }

    exec();
  }, []);

  const projection = d3
    .geoNaturalEarth1()
    .scale(width / (1.3 * Math.PI))
    .translate([width / 2, height / 2]);

  const pathgen = d3.geoPath().projection(projection);

  return (
    <div ref={parentRef} className={classnames(className, "w-full h-full m-0")}>
      <svg id="canvas" ref={svgRef} width={width} height={height}>
        <g>
          {(geojson || { features: [] }).features.map((data, index) => (
            <path
              key={index}
              fill="#69b3a2"
              stroke="#fff"
              d={pathgen(data) || undefined}
              className="cursor-pointer"
              onClick={() => console.log("CLICKED", data)}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}
