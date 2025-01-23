import { FC, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../../hooks";
import clsx from "clsx";
import getSubtitleImages from "./utils/getSubtitleImages";
import { SubtitleImage } from "../../../types";

const SubtitlesCanvas: FC = () => {
  const { controllersDeps } = useAppSelector((state) => state.controls);
  const { subtitles } = useAppSelector((state) => state.player);
  const { currentTime } = useAppSelector((state) => state.timer);

  const [selectedSubtitles, setSelectedSubtitles] = useState<SubtitleImage[]>(
    []
  );

  const currentPlayingSubtitle = useRef<number | null>(null);

  const subtitleCanvasRef = useRef<HTMLCanvasElement>(null);

  const fetchSubtitles = async (subtitles) => {
    const subtitlesImages = await getSubtitleImages(subtitles);
    setSelectedSubtitles(subtitlesImages);
  };

  useEffect(() => {
    if (!subtitles || !subtitleCanvasRef.current) return

    if (!selectedSubtitles.length) {
      fetchSubtitles(subtitles);
      return;
    }
  }, [subtitles, selectedSubtitles]);

  useEffect(() => {
    if (!subtitleCanvasRef.current || !selectedSubtitles.length) return;

    const canvas = subtitleCanvasRef.current;
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const currentSubtitles = selectedSubtitles.find(
      (subtitle) => currentTime >= subtitle.start && currentTime <= subtitle.end
    );

    if (!currentSubtitles) {
      return ctx.clearRect(0, 0, canvas.width, canvas.height);
    }

    const currentSubtitleIndex = selectedSubtitles.indexOf(currentSubtitles);

    if (currentPlayingSubtitle.current === currentSubtitleIndex) return;

    currentPlayingSubtitle.current = currentSubtitleIndex;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const subtitleWidth =
      (screenWidth / currentSubtitles.videoWidth) * currentSubtitles.width;
    const subtitleHeight =
      (screenHeight / currentSubtitles.videoHeight) * currentSubtitles.height;

    canvas.width = subtitleWidth;
    canvas.height = subtitleHeight;

    const img = new Image();
    img.src = currentSubtitles.image;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  }, [currentTime, selectedSubtitles]);

  return (
    <div className="fixed top-0 left-0 w-full h-full pointer-events-none">
      <div
        className={clsx(
          "absolute left-0 right-0 w-max mx-auto duration-100",
          controllersDeps.length === 0 ? "bottom-7 " : "bottom-28"
        )}
      >
        <canvas ref={subtitleCanvasRef} />
      </div>
    </div>
  );
};

export default SubtitlesCanvas;
