import { useEffect } from 'react'
import './App.css'
import Script from 'next/script'

function App() {
  useEffect(() => {
  }, []);

  return (
    <>
      <div className="App">
        <div
          style={{
            width: 300,
            height: 300,
            cursor: "pointer",
            backgroundImage:
              "radial-gradient(rgb(227, 227, 227) 5%, rgb(227, 227, 227) 25%, rgb(240, 240, 240) 35%)",
            borderRadius: 25
          }}
          id="videoBtn"
        >
          <img
            src="data:image/png;base64,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"
            alt="Logo"
            style={{ width: 150, cursor: "pointer", padding: 75 }}
          />

          <img id="img" crossOrigin="anonymous" />

          <canvas id="canvas" width="100px" height="100px" style={{
            display: "none"
          }} />
        </div>

        <section id="videoContainer"
          style={{
            overflow: "hidden",
            display: "none"
          }}
        >
          <div
            id="overlay"
            style={{
              top: 9,
              left: 9,
              zIndex: 1,
              boxSizing: "border-box",
              border: "50px solid rgba(0, 0, 0, 0.3)",
              boxShadow: "rgba(255, 0, 0, 0.5) 0px 0px 0px 5px inset",
              width: "300px",
              height: "300px",
              position: "absolute",
              display: "none"
            }}
          />
          <video
            id="video"
            muted
            autoPlay
            playsInline
            style={{
              display: 'none',
              width: 300,
              height: 300,
              overflow: 'hidden',
              objectFit: "cover"
            }}
          />
        </section>

        <div id="resultContainer" style={{ display: "none" }}>
          <div id="status" />
          <pre id="result" />
        </div>
        <div id="uploadContainer">
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            accept="image/*"
            className="file-input"
          />
          <button id="imgBtn" className="upload-button">Upload a file</button>
        </div>
      </div>

      <Script src="https://cdn.jsdelivr.net/npm/@undecaf/zbar-wasm@latest/dist/index.js"></Script>
      <Script src="/script.js" />
    </>
  )
}

export default App
