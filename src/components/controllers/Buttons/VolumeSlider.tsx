import { FC, useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import Slider from "rc-slider";
import Button from "./Button";
import { MaxSoundIcon, MinSoundIcon, MuteSoundIcon } from "../../../assets";
import "rc-slider/assets/index.css";
import { useVolume } from "../../../hooks";
import { useAppSelector } from "../../../hooks";
import { throttle } from "lodash";

const VolumeSlider: FC = ({}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isButtonHovering, setIsButtonHovering] = useState(false);

  const { volume, isMuted } = useAppSelector((state) => state.volume);
  const { isPanelHovering } = useAppSelector((state) => state.controls);
  const { allowAnimations } = useAppSelector((state) => state.settings);

  const { handleVolumeChange, handleToggleMute } = useVolume();

  const iconVariants = {
    visible: { opacity: 1, scale: 1 },
    hidden: { opacity: 0, scale: 0.2 },
  };

  const sliderControls = useAnimation();
  const maxSoundControls = useAnimation();
  const minSoundControls = useAnimation();
  const muteSoundControls = useAnimation();

  const currentMaxVar = useRef("hidden");
  const currentMinVar = useRef("hidden");
  const currentMuteVar = useRef("visible");

  const handleIconsAnimations = () => {
    if (isMuted || volume === 0) {
      if (currentMaxVar.current !== "hidden") maxSoundControls.start("hidden");
      if (currentMinVar.current !== "hidden") minSoundControls.start("hidden");
      if (currentMuteVar.current !== "visible")
        muteSoundControls.start("visible");
      currentMaxVar.current = "hidden";
      currentMinVar.current = "hidden";
      currentMuteVar.current = "visible";
    } else if (volume > 50) {
      if (currentMaxVar.current !== "visible")
        maxSoundControls.start("visible");
      if (currentMinVar.current !== "hidden") minSoundControls.start("hidden");
      if (currentMuteVar.current !== "hidden")
        muteSoundControls.start("hidden");
      currentMaxVar.current = "visible";
      currentMinVar.current = "hidden";
      currentMuteVar.current = "hidden";
    } else if (volume <= 50 && volume > 0) {
      if (currentMaxVar.current !== "hidden") maxSoundControls.start("hidden");
      if (currentMinVar.current !== "visible")
        minSoundControls.start("visible");
      if (currentMuteVar.current !== "hidden")
        muteSoundControls.start("hidden");
      currentMaxVar.current = "hidden";
      currentMinVar.current = "visible";
      currentMuteVar.current = "hidden";
    }
  };

  useEffect(() => {
    handleIconsAnimations();
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      currentMaxVar.current = null;
      currentMinVar.current = null;
      currentMuteVar.current = null;
    };
  }, []);

  useEffect(() => {
    if (!(isPanelHovering || isDragging)) sliderControls.start("hidden");
    else if (isButtonHovering) sliderControls.start("visible");
  }, [isPanelHovering, isDragging, isButtonHovering]);

  const handleVolumeSlide = useCallback(
    throttle((value: number) => {
      setIsDragging(true);
      handleVolumeChange(value);
    }, 30),
    []
  );

  return (
    <Button
      style={{
        borderRadius: 6,
      }}
      className="pl-2.5 pr-1.5 py-1.5"
      onMouseEnter={() => setIsButtonHovering(true)}
      onMouseLeave={() => setIsButtonHovering(false)}
    >
      <div className="flex items-center justify-start w-full h-[22px] text-[22px]">
        <div className="w-[22px] h-[22px] relative" onClick={handleToggleMute}>
          <motion.div
            className="absolute left-0 right-0 top-0 bottom-0 h-max w-max m-auto"
            variants={iconVariants}
            initial="visible"
            animate={maxSoundControls}
            transition={{
              duration: allowAnimations ? 0.1 : 0,
            }}
          >
            <MaxSoundIcon />
          </motion.div>
          <motion.div
            className="absolute left-0 right-0 top-0 bottom-0 h-max w-max m-auto"
            variants={iconVariants}
            initial="hidden"
            animate={minSoundControls}
            transition={{
              duration: allowAnimations ? 0.1 : 0,
            }}
          >
            <MinSoundIcon />
          </motion.div>
          <motion.div
            className="absolute left-0 right-0 top-0 bottom-0 h-max w-max m-auto"
            variants={iconVariants}
            initial="hidden"
            animate={muteSoundControls}
            transition={{
              duration: allowAnimations ? 0.1 : 0,
            }}
          >
            <MuteSoundIcon />
          </motion.div>
        </div>
        <motion.div
          className="overflow-hidden"
          variants={{
            visible: {
              opacity: 1,
              width: "max-content",
            },
            hidden: {
              opacity: 0,
              width: 0,
            },
          }}
          initial="hidden"
          animate={sliderControls}
          transition={{
            duration: allowAnimations ? 0.15 : 0,
          }}
        >
          <Slider
            step={1}
            value={volume}
            min={0}
            max={100}
            onChange={handleVolumeSlide}
            onChangeComplete={() => setIsDragging(false)}
            keyboard={false}
            style={{ width: 60, marginLeft: 15, marginRight: 10 }}
            styles={{
              handle: {
                border: "none",
                boxShadow: "none",
                cursor: "pointer",
                opacity: 1,
              },
              track: {
                backgroundColor: "#fff",
              },
              rail: {
                backgroundColor: "#555",
              },
            }}
          />
        </motion.div>
      </div>
    </Button>
  );
};

export default VolumeSlider;
