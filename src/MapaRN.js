import React, { useState, useRef, useEffect } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";

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
          const qtdDistribuicao = Math.floor(Math.random() * 100);
          const doacaoTotal = Math.floor(Math.random() * 50) + 10;
          const doacaoPessoaFisica = Math.floor(Math.random() * doacaoTotal);
          const doacaoEntidadeBeneficiaria = doacaoTotal - doacaoPessoaFisica;
          const distribuicao = Math.floor(Math.random() * qtdDistribuicao);

          return {
            ...feature,
            properties: {
              ...feature.properties,
              qtd_distribuicao: qtdDistribuicao,
              pontos: [
                {
                  name: "ponto exemplo",
                  distribuicao,
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
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    onMouseEnter={(event) => handleMouseEnter(event, name)}
                    onMouseLeave={() => setHoveredMunicipio(null)}
                    onClick={() => handleClick(name)}
                    style={{
                      default: {
                        fill:
                          geo.properties.qtd_distribuicao > 50
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
            padding: "10px",
            background: "rgba(0, 0, 0, 0.7)",
            color: "white",
            borderRadius: "5px",
            zIndex: 1000,
          }}
        >
          <h3>{selectedMunicipio.properties.name}</h3>
          <p>
            Informações adicionais sobre {selectedMunicipio.properties.name}
          </p>
          <p>Pontos:</p>
          {selectedMunicipio.properties.pontos.map((ponto) => (
            <div key={ponto.name}>
              <button
                onClick={() =>
                  setSelectedMunicipio({
                    ...selectedMunicipio,
                    selectedPonto: ponto,
                  })
                }
              >
                {ponto.name} - Distribuição: {ponto.distribuicao}
              </button>
              <br />
            </div>
          ))}
          {selectedMunicipio.selectedPonto && (
            <div
              style={{
                position: "absolute",
                top: "200px",
                left: "20px",
                padding: "10px",
                background: "rgba(0, 0, 0, 0.7)",
                color: "white",
                borderRadius: "5px",
                zIndex: 999,
              }}
            >
              <h4>{selectedMunicipio.selectedPonto.name}</h4>
              <p>
                Distribuição: {selectedMunicipio.selectedPonto.distribuicao}
              </p>
              <p>
                Doação total: {selectedMunicipio.selectedPonto.doacao_total}
              </p>
              <p>
                Doação pessoa física:{" "}
                {selectedMunicipio.selectedPonto.doacao_pessoa_fisica}
              </p>
              <p>
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
