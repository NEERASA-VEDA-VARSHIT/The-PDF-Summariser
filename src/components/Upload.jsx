import React, { useContext } from "react";
import { AppContext } from "../context/AppContext";

const Upload = () => {
  const { state, setState } = useContext(AppContext);

  const handleFileChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      uploadedFile: event.target.files[0],
    }));
  };

  const handleUpload = () => {
    if (state.uploadedFile) {
      console.log("Uploading file:", state.uploadedFile.name);
      // Add your upload logic here
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div>
      <h2>Upload File</h2>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default Upload;
