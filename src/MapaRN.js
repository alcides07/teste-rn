import React, { useState, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Marker,
} from "react-simple-maps";
import { geoCentroid } from "d3-geo";

const geoUrl = "/rn.json";

const MapaRN = () => {
  const [municipios, setMunicipios] = useState([]);
  const [hoveredMunicipio, setHoveredMunicipio] = useState(null);
  const [selectedMunicipio, setSelectedMunicipio] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const mapContainerRef = useRef(null);

  useEffect(() => {
    fetch(geoUrl)
      .then((response) => response.json())
      .then((data) => {
        const updatedData = data.features.map((feature) => {
          const distribuicaoMunicipio = Math.floor(Math.random() * 100);
          const distribuicaoPonto = parseInt(distribuicaoMunicipio / 2);
          const doacaoTotal = Math.floor(Math.random() * 50) + 10;
          const doacaoPessoaFisica = Math.floor(Math.random() * doacaoTotal);
          const doacaoEntidadeBeneficiaria = doacaoTotal - doacaoPessoaFisica;

          return {
            ...feature,
            properties: {
              ...feature.properties,
              qtd_distribuicao: distribuicaoMunicipio,
              pontos: [
                {
                  name: "Ponto exemplo 1",
                  distribuicao: distribuicaoPonto,
                  doacao_total: doacaoTotal,
                  doacao_pessoa_fisica: doacaoPessoaFisica,
                  doacao_entidade_beneficiaria: doacaoEntidadeBeneficiaria,
                },
                {
                  name: "Ponto exemplo 2",
                  distribuicao: distribuicaoPonto,
                  doacao_total: doacaoTotal,
                  doacao_pessoa_fisica: doacaoPessoaFisica,
                  doacao_entidade_beneficiaria: doacaoEntidadeBeneficiaria,
                },
              ],
            },
          };
        });
        setMunicipios(updatedData);
      });
  }, []);

  const handleMouseEnter = (event, name) => {
    const rect = mapContainerRef.current.getBoundingClientRect();
    const municipio = municipios.find((m) => m.properties.name === name);

    setHoveredMunicipio(municipio);
    setPosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    });
  };

  const handleClick = (name) => {
    const municipio = municipios.find((m) => m.properties.name === name);
    setSelectedMunicipio(municipio);
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
          <Geographies geography={municipios}>
            {({ geographies }) =>
              geographies.map((geo) => {
                const { name } = geo.properties;
                const centroid = geoCentroid(geo);
                return (
                  <React.Fragment key={geo.rsmKey}>
                    <Geography
                      geography={geo}
                      onMouseEnter={(event) => handleMouseEnter(event, name)}
                      onMouseLeave={() => setHoveredMunicipio(null)}
                      onClick={() => handleClick(name)}
                      style={{
                        default: {
                          fill:
                            geo.properties.qtd_distribuicao > 80
                              ? "#4CAF50"
                              : "#607D8B",
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
                    <Marker coordinates={centroid}>
                      <text
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="2"
                        fontWeight="bold"
                      >
                        {geo.properties.qtd_distribuicao}
                      </text>
                    </Marker>
                  </React.Fragment>
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
            padding: "10px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderRadius: "8px",
            pointerEvents: "none",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            fontSize: "16px",
            lineHeight: "1.5",
          }}
        >
          {hoveredMunicipio.properties.name}
          <br />
          Quantidade de distribuição:{" "}
          {hoveredMunicipio.properties.qtd_distribuicao}
        </div>
      )}

      {selectedMunicipio && (
        <div
          style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            padding: "20px",
            background: "rgba(0, 0, 0, 0.8)",
            color: "white",
            borderRadius: "10px",
            zIndex: 1000,
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            maxWidth: "300px",
          }}
        >
          <h3 style={{ margin: "0 0 10px 0", fontSize: "18px" }}>
            {selectedMunicipio.properties.name}
          </h3>
          <p style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
            Quantidade de distribuição:{" "}
            {selectedMunicipio.properties.qtd_distribuicao}
          </p>
          <p style={{ margin: "0 0 10px 0", fontSize: "14px" }}>
            Informações adicionais sobre {selectedMunicipio.properties.name}
          </p>
          <p style={{ margin: "0 0 10px 0", fontSize: "14px" }}>Pontos:</p>
          {selectedMunicipio.properties.pontos.map((ponto) => (
            <div key={ponto.name} style={{ marginBottom: "10px" }}>
              <button
                style={{
                  padding: "8px 12px",
                  background: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                }}
                onClick={() =>
                  setSelectedMunicipio({
                    ...selectedMunicipio,
                    selectedPonto: ponto,
                  })
                }
              >
                {ponto.name} - Distribuição: {ponto.distribuicao}
              </button>
            </div>
          ))}
          {selectedMunicipio.selectedPonto && (
            <div
              style={{
                position: "absolute",
                top: "250px",
                left: "20px",
                padding: "20px",
                background: "rgba(0, 0, 0, 0.8)",
                color: "white",
                borderRadius: "10px",
                zIndex: 999,
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                maxWidth: "300px",
              }}
            >
              <h4 style={{ margin: "0 0 10px 0", fontSize: "16px" }}>
                {selectedMunicipio.selectedPonto.name}
              </h4>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                Distribuição: {selectedMunicipio.selectedPonto.distribuicao}
              </p>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                Doação total: {selectedMunicipio.selectedPonto.doacao_total}
              </p>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                Doação pessoa física:{" "}
                {selectedMunicipio.selectedPonto.doacao_pessoa_fisica}
              </p>
              <p style={{ margin: "0 0 8px 0", fontSize: "14px" }}>
                Doação pessoa entidade:{" "}
                {selectedMunicipio.selectedPonto.doacao_entidade_beneficiaria}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MapaRN;
