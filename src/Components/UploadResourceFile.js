// src/components/UploadResourceFile.jsx
import React, { useState } from "react";
import axios from "axios";

const UploadResourceFile = () => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("");
  const [skillId, setSkillId] = useState("");
  const [folderName, setFolderName] = useState("");
  const [message, setMessage] = useState("");

  const onFileChange = (e) => setFile(e.target.files[0]);

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!file || !title || !type || !skillId) {
      setMessage("Please fill all required fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("type", type);
    formData.append("skillId", skillId);
    if (folderName) formData.append("folderName", folderName);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/resources/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      setMessage("File uploaded successfully!");
      // Optionally clear form or do something else
      setFile(null);
      setTitle("");
      setType("");
      setSkillId("");
      setFolderName("");
      console.log("Uploaded resource:", response.data);
    } catch (error) {
      setMessage("Upload failed: " + (error.response?.data || error.message));
    }
  };

  return (
    <div style={{ maxWidth: "500px", margin: "auto", padding: "20px" }}>
      <h3>Upload New Resource File</h3>
      {message && <p>{message}</p>}
      <form onSubmit={onSubmit} encType="multipart/form-data">
        <div>
          <label>File:</label>
          <input type="file" onChange={onFileChange} />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Resource title"
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type (e.g., pdf, video)"
            required
          />
        </div>
        <div>
          <label>Skill ID:</label>
          <input
            type="number"
            value={skillId}
            onChange={(e) => setSkillId(e.target.value)}
            placeholder="Associated Skill ID"
            required
          />
        </div>
        <div>
          <label>Folder Name (Optional):</label>
          <input
            type="text"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
            placeholder="Folder name"
          />
        </div>
        <button type="submit">Upload Resource</button>
      </form>
    </div>
  );
};

export default UploadResourceFile;
