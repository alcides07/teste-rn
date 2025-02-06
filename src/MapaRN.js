import React, { useState, useRef } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

// Caminho para o arquivo GeoJSON
const geoUrl = "/rn.json";

const MapaRN = () => {
  const [hoveredMunicipio, setHoveredMunicipio] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const mapContainerRef = useRef(null);

  const handleMouseEnter = (event, name) => {
    const rect = mapContainerRef.current.getBoundingClientRect();
    setHoveredMunicipio(name);
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  return (
    <div style={{ width: "100%", height: "100vh" }} ref={mapContainerRef}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 4000,
          center: [-36, -5.5],
        }}
        style={{ position: "relative" }}
      >
        <ZoomableGroup>
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const { name } = geo.properties;
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(event) => handleMouseEnter(event, name)}
                    onMouseLeave={() => {
                      setHoveredMunicipio(null);
                    }}
                    style={{
                      default: {
                        fill: hoveredMunicipio === name ? "#FF5722" : "#607D8B",
                        outline: "none",
                      },
                      hover: {
                        fill: "#FF5722",
                        outline: "none",
                      },
                      pressed: {
                        fill: "#E64A19",
                        outline: "none",
                      },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ZoomableGroup>
      </ComposableMap>
      {hoveredMunicipio && (
        <div
          style={{
            position: "absolute",
            top: position.y + 10,
            left: position.x + 10,
            padding: "5px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            borderRadius: "3px",
            pointerEvents: "none",
          }}
        >
          {hoveredMunicipio}
        </div>
      )}
    </div>
  );
};

export default MapaRN;
