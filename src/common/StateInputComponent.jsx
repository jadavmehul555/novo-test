import { useEffect, useState } from "react";

function StateInputComponent(props) {
  const [error, setError] = useState("");

  // Giving control to parent using ref - similar to useimperativehandle hook
  // Using ref for simplicity
  useEffect(() => {
    if (props.inputRef) {
      props.inputRef.current = {
        validate: () => {
          if (!props.value) {
            setError("State is required");
            return false;
          } else if (props.value.length !== 2) {
            setError("State should have two letters");
            return false;
          }
          setError("");
          return true;
        }
      };
    }
  }, [props.inputRef, props.value]);

  // Convert state to uppercase and regex to allow only letters
  const setValidatedState = (value) => {
    if (!value) {
      // this will reset value to empty
      props.setValue("");
    }
    const string = value.toUpperCase();
    if (string.match(/^[A-Z]+$/)) {
      props.setValue(string);
    }
  };

  return (
    <>
      <div className="md:flex md:items-center mb-4">
        <div className="md:w-1/3">
          <label className="text-sm">{props.label || "State"}</label>
        </div>
        <div className="md:w-2/3">
          <input
            type="text"
            className="border rounded "
            value={props.value}
            onInput={(e) => setValidatedState(e.target.value)}
            maxLength="2"
          ></input>
          {error && <p className="text-red-500 text-xs italic ">{error}</p>}
        </div>
      </div>
    </>
  );
}

export default StateInputComponent;
