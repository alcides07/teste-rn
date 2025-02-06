// src/MapaRN.js
import React, { useState } from "react";
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

  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 4000,
          center: [-36, -5.5],
        }}
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
                    onMouseEnter={() => {
                      setHoveredMunicipio(name);
                    }}
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
            top: 20,
            left: 20,
            padding: "10px",
            background: "white",
            border: "1px solid #ccc",
          }}
        >
          {hoveredMunicipio}
        </div>
      )}
    </div>
  );
};

export default MapaRN;
