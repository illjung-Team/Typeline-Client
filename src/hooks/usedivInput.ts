import { useState } from "react";

const usedivInput = (initialValue: string = "") => {
  const [value, setdivValue] = useState(initialValue);

  const reset = () => {
    setdivValue("");
  };

  return { value, setdivValue, reset };
};

export default usedivInput;
