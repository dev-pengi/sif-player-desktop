import { FC, useRef } from "react";
import { useAppSelector } from "../../../../hooks";

const scrollTo = (element: HTMLElement) => {
  element.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
};

interface SettingSectionTabProps {
  title: string;
  isActive?: boolean;
  onSelect?: () => void;
  vertical?: boolean;
}

const SettingSectionTab: FC<SettingSectionTabProps> = ({
  title,
  isActive,
  onSelect,
}) => {
  const tabRef = useRef<HTMLDivElement>(null);
  const { primaryColor } = useAppSelector((state) => state.settings);
  return (
    <div
      style={{
        backgroundColor: isActive ? "#ffffff18" : "transparent",
      }}
      ref={tabRef}
      className={`relative px-3 py-1.5 ${
        isActive ? `text-${primaryColor}` : "text-neutral-400"
      } hover:text-neutral-100 cursor-pointer rounded-md text-[15px]`}
      onClick={() => {
        onSelect();
        scrollTo(tabRef.current);
      }}
    >
      {/* <AnimatePresence>
        {isActive && (
          <>
            {vertical ? (
              <motion.div
                layoutId="verticalSettingSectionTab"
                className="absolute left-0 right-0 mx-auto -bottom-2 h-0.5 w-[75%] rounded-lg"
                style={{
                  backgroundColor: primaryColor,
                }}
                variants={{
                  visible: {
                    opacity: 1,
                  },
                  hidden: {
                    opacity: 0,
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
              />
            ) : (
              <motion.div
                layoutId="settingSectionTab"
                className="absolute top-0 bottom-0 my-auto -left-2 w-0.5 h-[75%] rounded-lg"
                style={{
                  backgroundColor: primaryColor,
                }}
                variants={{
                  visible: {
                    opacity: 1,
                  },
                  hidden: {
                    opacity: 0,
                  },
                }}
                initial="hidden"
                animate="visible"
                exit="hidden"
              />
            )}
          </>
        )}
      </AnimatePresence> */}
      {title}
    </div>
  );
};

export default SettingSectionTab;
