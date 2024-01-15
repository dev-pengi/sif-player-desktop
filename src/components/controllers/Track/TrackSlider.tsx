import { FC, useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { throttle } from "lodash";
import Indicator from "./Indicator";
import { usePlayer, useTimer } from "../../../hooks";
import { useAppSelector } from "../../../hooks";
import { formatTime } from "../../../utils";

const TrackSlider: FC = () => {
  const { primaryColor, showHoverThumbnail, allowAnimations } = useAppSelector(
    (state) => state.settings
  );
  const { videoSrc } = useAppSelector((state) => state.player);
  const { duration, buffered, timePercentage } = useAppSelector(
    (state) => state.timer
  );
  const { handlePlay, handlePause } = usePlayer();
  const { handleSeek } = useTimer();

  const [hoverPoint, setHoverPoint] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const [thumbnailPosition, setThumbnailPosition] = useState(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const sliderRef = useRef(null);

  const thumbnailVideoRef = useRef<HTMLVideoElement>(null);

  const handleCaptureFrame = useCallback(
    throttle(() => {
      const video = thumbnailVideoRef.current;
      if (!video) return;
      video.currentTime = hoverTime;
    }, 50),
    [hoverTime]
  );

  useEffect(() => {
    handleCaptureFrame();
  }, [hoverTime]);

  const calculateTime = useCallback(
    throttle((event: React.MouseEvent<HTMLDivElement>) => {
      const rect = sliderRef.current.getBoundingClientRect();
      const x = event.clientX - rect.left;
      let clickedPercentage = x / rect.width;

      clickedPercentage = Math.max(0, Math.min(clickedPercentage, 1));

      const newCurrentTime = clickedPercentage * duration;
      handleSeek(newCurrentTime);
    }, 50),
    [duration]
  );

  const handleHoverMouseMove = (event) => {
    const rect = sliderRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    let Percentage = x / rect.width;
    const thumbnailWidth = showHoverThumbnail ? 180 : 40;

    const limitedWidth = rect.width - thumbnailWidth / 2;
    if (limitedWidth - x < 0) {
      setThumbnailPosition(limitedWidth / rect.width);
    } else if (x < thumbnailWidth / 2) {
      setThumbnailPosition(thumbnailWidth / 2 / rect.width);
    } else {
      setThumbnailPosition(Percentage);
    }

    setHoverPoint(Percentage);
    setHoverTime(Percentage * duration);
  };

  const handleDragMouseMove = (event) => {
    event.preventDefault();
    if (isDragging) {
      handlePause();
      calculateTime(event);
    }
  };

  const handleMouseDown = (event) => {
    event.preventDefault();
    calculateTime(event);
    setIsDragging(true);
  };

  const handleMouseUp = (event) => {
    event.preventDefault();
    handlePlay();
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleDragMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleDragMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging]);

  return (
    <div
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => {
        setIsHovering(false);
      }}
      onMouseMove={handleHoverMouseMove}
      className="w-full h-[16px] relative flex items-center justify-center"
    >
      <div
        style={{
          left: thumbnailPosition * 100 + "%",
          backgroundColor: "transparent",
        }}
        className="bottom-6 flex items-center justify-center flex-col absolute transform -translate-x-1/2 pointer-events-none"
      >
        {showHoverThumbnail && (
          <motion.div
            className="mb-3 flex items-center justify-center rounded-md shadow-md bg-[#ffffff41] border-[2px] border-[#ffffff51] border-solid"
            initial={{
              opacity: 0,
              scale: 0.4,
            }}
            animate={{
              width: 180,
              height: 110,
              objectFit: "contain",
              opacity: isHovering ? 1 : 0,
              scale: isHovering ? 1 : 0.4,
              transformOrigin: "bottom",
            }}
            transition={{
              duration: allowAnimations ? 0.1 : 0,
            }}
          >
            <video
              ref={thumbnailVideoRef}
              src={videoSrc}
              autoPlay={false}
              muted={true}
              loop={false}
              style={{
                objectFit: "contain",
                width: "100%",
                height: "100%",
              }}
            />
          </motion.div>
        )}
        <motion.div
          initial={{
            opacity: 0,
            scale: 0.4,
          }}
          animate={{
            opacity: isHovering ? 1 : 0,
            scale: isHovering ? 1 : 0.4,
          }}
          transition={{
            duration: allowAnimations ? 0.1 : 0,
          }}
          className="rounded-md bg-[#ffffff41] px-2 py-1 text-xs text-white font-semibold shadow-md"
        >
          {formatTime(hoverTime)}
        </motion.div>
      </div>
      <motion.div
        className="w-full cursor-pointer relative bg-[#ffffff52] rounded-[1px] overflow-hidden"
        style={{
          height: "6px",
        }}
        initial={{
          scaleY: 0.6,
        }}
        animate={{
          scaleY: isHovering || isDragging ? 1 : 0.6,
        }}
        transition={{
          type: "tween",
          duration: allowAnimations ? 0.15 : 0,
        }}
        onMouseDown={handleMouseDown}
        ref={sliderRef}
      >
        <Indicator indicatorPercentage={buffered} backgroundColor="#ffffff40" />
        <Indicator
          indicatorPercentage={hoverPoint}
          hidden={!isHovering}
          backgroundColor="#ffffff7d"
        />
        <Indicator
          indicatorPercentage={timePercentage}
          backgroundColor={primaryColor}
        />
      </motion.div>
      <div
        style={{
          borderRadius: "50%",
          left: timePercentage * 100 + "%",
          width: 13,
          height: 13,
          backgroundColor: "transparent",
        }}
        className="bottom-0 top-0 m-auto flex items-center justify-center absolute transform -translate-x-1/2 pointer-events-none"
      >
        <motion.div
          style={{
            borderRadius: "50%",
            backgroundColor: primaryColor,
          }}
          animate={{
            opacity: isHovering || isDragging ? 1 : 0,
            width: isHovering || isDragging ? 13 : 0,
            height: isHovering || isDragging ? 13 : 0,
          }}
          transition={{
            duration: allowAnimations ? 0.1 : 0,
          }}
        ></motion.div>
      </div>
    </div>
  );
};

export default TrackSlider;
