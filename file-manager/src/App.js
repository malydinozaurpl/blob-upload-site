import { useState } from "react";

export default function FileManager() {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [dstContainer, setDstContainer] = useState("");

  const fetchFiles = async () => {
    if (!dstContainer) return alert("Podaj nazwę folderu!");
    const res = await fetch(`http://localhost:8000/listblobs/${dstContainer}`);
    const data = await res.json();
    setFiles(data);
  };

  const uploadFile = async () => {
    if (!selectedFile) return alert("Nie wybrano pliku!");
    if (!dstContainer) return alert("Podaj nazwę folderu!");
    const formData = new FormData();
    formData.append("entry", selectedFile);
    await fetch(`http://localhost:8000/upload/${dstContainer}`, {
      method: "POST",
      body: formData,
    });
    setSelectedFile(null);
    fetchFiles();
  };

  const deleteFile = async (filename) => {
    if (!dstContainer) return alert("Podaj nazwę folderu!");
    await fetch(`http://localhost:8000/upload/delete/${dstContainer}/${filename}`, {
      method: "DELETE",
    });
    fetchFiles();
  };

  const downloadFile = (filename) => {
    if (!dstContainer) return alert("Podaj nazwę folderu!");
    window.open(`http://localhost:8000/download/${dstContainer}/${filename}`, "_blank");
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1 style={styles.title}>📂 File Manager</h1>

        <input
          type="text"
          placeholder="Podaj nazwę folderu..."
          value={dstContainer}
          onChange={(e) => setDstContainer(e.target.value)}
          style={styles.input}
        />

        <input
          type="file"
          onChange={(e) => setSelectedFile(e.target.files[0])}
          style={styles.input}
        />

        <button onClick={uploadFile} style={styles.buttonBlue}>Wrzuc plik</button>
        <button onClick={fetchFiles} style={styles.buttonGray}>Wyświetl listę plików</button>

        <ul style={{ listStyle: "none", padding: 0, marginTop: "10px" }}>
          {files.map((file, idx) => (
            <li key={idx} style={styles.fileItemColumn}>
              <span style={{ wordBreak: "break-all" }}>{file}</span>
              <div style={styles.fileButtons}>
                <button onClick={() => downloadFile(file)} style={styles.buttonGreen}>Pobierz</button>
                <button onClick={() => deleteFile(file)} style={styles.buttonRed}>Usuń</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ---------------- Style CSS w JS ----------------
const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    backgroundColor: "#f3f3f3",
  },
  container: {
    padding: "20px",
    width: "400px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: {
    textAlign: "center",
    marginBottom: "10px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  input: {
    padding: "8px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px",
    width: "100%",
    boxSizing: "border-box",
  },
  buttonBlue: {
    padding: "10px",
    backgroundColor: "#3b82f6",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginBottom: "10px",
    width: "100%",
  },
  buttonGray: {
    padding: "10px",
    backgroundColor: "#6b7280",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    width: "100%",
    marginBottom: "10px",
  },
  buttonGreen: {
    padding: "6px 10px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "5px",
  },
  buttonRed: {
    padding: "6px 10px",
    backgroundColor: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
  fileItemColumn: {
    display: "flex",
    flexDirection: "column",
    padding: "6px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    marginBottom: "5px",
  },
  fileButtons: {
    marginTop: "5px",
    display: "flex",
    gap: "5px",
  },
};
