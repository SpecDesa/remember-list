import React, { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

interface ExpandableButtonProps {
  displayTextBefore: string | number;
  displayTextAfter: string | number;
  increaseFunc: () => void;
  decreaseFunc: () => void;
  removeFunc: () => void;
}

const ExpandableButton: React.FC<ExpandableButtonProps> = ({
  displayTextBefore,
  displayTextAfter,
  increaseFunc,
  decreaseFunc,
  removeFunc,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const toggleOptions = (expandClick?: boolean) => {
    if (expandClick) {
      setExpanded(!expanded);
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    const newTimeoutId = setTimeout(() => {
      console.log("Delayed for 1 second.");
      setExpanded(false);
    }, 2000);

    setTimeoutId(newTimeoutId);
  };

  // Clear timeout when component unmounts or expanded state changes
  useEffect(() => {
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [timeoutId, expanded]);

  return (
    <div>
      <Button
        variant={"default"}
        className={`flex rounded-full ${expanded ? "hidden" : ""}`}
        // className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
        onClick={() => toggleOptions(true)}
      >
        <span>{displayTextBefore}</span>
      </Button>
      <div className={`${expanded ? "" : "hidden"}`}>
        <div className="flex items-center justify-center space-x-2">
          <Button
            onClick={() => {
              toggleOptions(false);
              decreaseFunc();
            }}
          >
            -
          </Button>
          <div>{displayTextAfter}</div>
          <Button
            onClick={() => {
              toggleOptions(false);
              increaseFunc();
            }}
          >
            +
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExpandableButton;
