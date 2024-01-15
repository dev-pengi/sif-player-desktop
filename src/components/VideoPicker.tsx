import { FC, useRef, RefObject, useState, useEffect } from "react";
import { usePlayerContext } from "../contexts";
import { useNavigate } from "react-router-dom";
import { extractUUIDFromBlobUrl } from "../utils";
import { useDispatch } from "react-redux";
import { playerActions } from "../store";
import { useAppSelector } from "../hooks";

interface VideoPickerProps {
  handleLoadStart: () => void;
}
const VideoPicker: FC<VideoPickerProps> = ({ handleLoadStart }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const fileInputRef: RefObject<HTMLInputElement> = useRef(null);
  const [isDragOver, setDragOver] = useState(false);
  const { videoFile, setVideoFile } = usePlayerContext();
  const { primaryColor } = useAppSelector((state) => state.settings);

  useEffect(() => {
    if (videoFile) {
      const reader = new FileReader();

      reader.onloadstart = () => {};

      reader.onload = (event) => {
        const blob = new Blob([event.target.result], { type: "video/mp4" });
        const blobUrl = URL.createObjectURL(blob);
        const extractedID = extractUUIDFromBlobUrl(blobUrl);
        navigate(`/player?src=${extractedID}&type=local`);
      };

      reader.readAsArrayBuffer(videoFile);
      handleLoadStart();
    } else {
      navigate("/");
    }
  }, [videoFile]);

  const handleFileInputChange = () => {
    const selectedFiles = fileInputRef.current?.files;
    if (selectedFiles) {
      handleSelectedFiles(selectedFiles);
    }
  };

  const handleSelectedFiles = async (files: FileList) => {
    const fileData = files[0];
    dispatch(
      playerActions.updateData({
        name: fileData.name,
        type: fileData.type,
        size: fileData.size,
      })
    );
    setVideoFile(fileData);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    handleSelectedFiles(files);
  };

  const handleFileInputClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{
        color: primaryColor,
      }}
      className={`border-2 border-dashed  ${
        isDragOver ? "border-current text-current" : "border-neutral-600"
      } duration-100 capitalize w-max px-16 py-9 rounded-lg flex items-center justify-center flex-col`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <h3 className="mt-2 capitalize">
        {isDragOver ? "Release File" : "Drag & Drop Video here"}
      </h3>
      <span className="text-[12px] mt-4">or</span>
      <button
        style={{
          color: primaryColor,
        }}
        onClick={handleFileInputClick}
        className="py-2 px-9 mt-4 text-[14px] text-current border-[2px] border-current hover:text-white hover:bg-current duration-200 border-solid rounded-[4px]"
      >
        <p className="text-white">Browse Files</p>
      </button>
      <input
        type="file"
        accept="video/*,.mkv"
        style={{
          display: "none",
        }}
        onChange={handleFileInputChange}
        ref={fileInputRef}
      />
    </div>
  );
};

export default VideoPicker;
