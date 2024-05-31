import React, {
  useState,
  useEffect,
  type TouchEvent,
  type ReactNode,
} from "react";

const minSwipeDistance = 5;
const partialSwipeDistance = 30; // Distance for partial swipe
const fullSwipeDistance = 100; // Distance for full swipe

interface SwipeableProps {
  children: ReactNode;
  deleteButton: ReactNode;
  onDeleteButton?: () => void;
  signalFullLeftSwipe?: () => void;
  signalPartialLeftSwipe?: () => void;
}

const Swipeable: React.FC<SwipeableProps> = ({ children,deleteButton,  signalPartialLeftSwipe, signalFullLeftSwipe }) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [position, setPosition] = useState<number>(0); // Position state to handle translation
  const [swipeAction, setSwipeAction] = useState<"options" | "delete" | null>(
    null,
  ); // State to manage swipe actions

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (!(e.target as HTMLElement).closest(".swipeable")) {
          setPosition(0); // Reset position if clicked outside the swipeable div
          setSwipeAction(null); // Reset swipe action
      }
    };

    document.addEventListener("mousedown", handleOutsideClick as EventListener);
    document.addEventListener(
      "touchstart",
      handleOutsideClick as EventListener,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleOutsideClick as EventListener,
      );
      document.removeEventListener(
        "touchstart",
        handleOutsideClick as EventListener,
      );
    };
  }, []);

  const onTouchStart = (e: TouchEvent) => {
    setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
    if (!e.targetTouches[0]?.clientX) {
      return;
    }

    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (touchStart === null) return;
    if (!e.targetTouches[0]?.clientX) return;

    const touchCurrent = e.targetTouches[0].clientX;
    const distance = touchStart - touchCurrent;
    const isLeftSwipe = distance > minSwipeDistance;

    if (isLeftSwipe) {
      setPosition(-distance); // Move left based on swipe distance
    }
    setTouchEnd(touchCurrent);
  };

  const onTouchEnd = () => {
    if (touchStart === null || touchEnd === null) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;

    if (isLeftSwipe) {
      if (distance > fullSwipeDistance) {
        console.log("full swipe left - delete");
        if(signalFullLeftSwipe){
          signalFullLeftSwipe()
        }
        setPosition(-fullSwipeDistance); // Move left by fullSwipeDistance
        setSwipeAction("delete");
      } else if (distance > partialSwipeDistance) {
        console.log("partial swipe left - show options");
        if(signalPartialLeftSwipe){
          signalPartialLeftSwipe()
        }
        setPosition(-partialSwipeDistance); // Move left by partialSwipeDistance
        setSwipeAction("options");
      } else {
        setPosition(0); // Reset position if swipe distance is less than minimum
        setSwipeAction(null); // Reset swipe action
      }
    } else {
      setPosition(0); // Reset position if swipe distance is less than minimum
      setSwipeAction(null); // Reset swipe action
    }

    // Reset touch start and end
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    swipeAction !== "delete" && 
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="flex flex-row flex-grow swipeable"
      style={{
        // left: position > 0 ? `${position}px` : "0", // Adjust left position based on swipe distance
        // transform: `translateX(${position / 2}px)`,
        transition: position === 0 ? "transform 0.3s ease-out" : "none", // Smooth transition only when resetting
        width: `calc(100% - ${Math.abs(position) * 2}px)`, // Adjust width based on position

      }}
    >
      <div className={touchStart &&  touchEnd &&  touchStart - touchEnd  > 5 ? "w-56": 'flex-grow'}
        style={{
          // transform: position >= 0 ? `scaleX(${1 - Math.abs(position) / fullSwipeDistance})` : "scaleX(1)", // Adjust scaleX based on swipe distance if position >= 0

          transform: `scaleX(${position <= 0 && position > - 105 ? 1 - ((Math.abs(position)*0.1) / fullSwipeDistance) : 0})`, // Adjust scaleX based on swipe distance
          transformOrigin: "left", // Keep origin at the right side
          transition: "transform 0.3s ease-out", // Add transition for smooth scaling
          opacity: position >= fullSwipeDistance ? 0 : 1, // Hide the div when fullSwipeDistance is reached
        }}
      >
        {children}
        </div>
        {swipeAction === "options" && deleteButton}
    </div>
  );
};

export default Swipeable;
