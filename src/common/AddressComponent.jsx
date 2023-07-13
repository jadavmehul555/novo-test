import { useState, useRef, useEffect } from "react";
import StateInputComponent from "./StateInputComponent";

export const INITIAL_ADDRESS = {
  address: "",
  city: "",
  state: "",
  zipCode: "",
  isSameAsPersonal: false,
  isSameAsBusiness: false,
};

function AddressComponent(props) {
  const stateRef = useRef();
  const [errors, setErrors] = useState({});

  const setValidatedZipCode = (value) => {
    if (!isNaN(value)) {
      const num = Number(value);
      onInputAddress({ zipCode: value ? num : "" });
    }
  };

  const onInputAddress = (value) => {
    // set isSameAsPersonal and isSameAsBusiness to false
    // and if update is coming from checkbox it then it become true
    props.updateAddress({
      isSameAsPersonal: false,
      isSameAsBusiness: false,
      ...value,
    });
  };

  // Giving control to parent - similar to useimperativehandle hook
  // Using ref for simplicity
  useEffect(() => {
    const validate = () => {
      const validState = stateRef.current.validate();
      const messages = {};
      if (!props.value.address) {
        messages.address = "Address is required";
      }
      if (!props.value.city) {
        messages.city = "City is required";
      }
      if (props.value.zipCode.toString().length !== 5) {
        messages.zipCode = "Zip should have 5 digits";
      }
      if (!props.value.zipCode) {
        messages.zipCode = "Zip code is required";
      }
      setErrors(messages);
      return Object.keys(messages).length === 0 && validState;
    };

    if (props.inputRef) {
      props.inputRef.current = {
        validate,
      };
    }
  }, [props.inputRef, props.value]);

  return (
    <>
      <div className="md:flex md:items-center mb-4">
        <div className="md:w-1/3">
          <label className="text-sm">Address</label>
        </div>
        <div className="md:w-2/3">
          <input
            className="border rounded"
            type="text"
            value={props.value.address}
            onInput={(e) => onInputAddress({ address: e.target.value })}
          ></input>
          {errors.address && (
            <p className="text-red-500 text-xs italic ">{errors.address}</p>
          )}
        </div>
      </div>
      <div>
        <div className="flex ">
          {props.showSameAsPersonal && (
            <div
              className="mb-2 cursor-pointer"
              onClick={() =>
                onInputAddress({
                  isSameAsPersonal: !props.value.isSameAsPersonal,
                })
              }
            >
              <input
                readOnly
                type="checkbox"
                checked={props.value.isSameAsPersonal}
              />
              <span className="text-sm ml-2 mb-2">Same as Personal</span>
            </div>
          )}

          {props.showSameAsBusiness && (
            <div
              className="mb-2 ml-7 cursor-pointer"
              onClick={() =>
                onInputAddress({
                  isSameAsBusiness: !props.value.isSameAsBusiness,
                })
              }
            >
              <input
                readOnly
                type="checkbox"
                className="ml-3"
                checked={props.value.isSameAsBusiness}
              />
              <span className="text-sm ml-2">Same as Business</span>
            </div>
          )}
        </div>
      </div>

      <div className="md:flex md:items-center mb-4">
        <div className="md:w-1/3">
          <label className="text-sm">City</label>
        </div>
        <div className="md:w-2/3">
          <input
            className="border rounded "
            type="text"
            value={props.value.city}
            onInput={(e) => onInputAddress({ city: e.target.value })}
          ></input>
          {errors.city && (
            <p className="text-red-500 text-xs italic ">{errors.city}</p>
          )}
        </div>
      </div>

      <StateInputComponent
        inputRef={stateRef}
        value={props.value.state}
        setValue={(val) => onInputAddress({ state: val })}
      ></StateInputComponent>
      <div className="md:flex md:items-center mb-4">
        <div className="md:w-1/3">
          {" "}
          <label className="text-sm">Zip Code</label>
        </div>
        <div className="md:w-2/3">
          <input
            className="border rounded "
            type="text"
            value={props.value.zipCode}
            onInput={(e) => setValidatedZipCode(e.target.value)}
            maxLength="5"
          ></input>
          {errors.zipCode && (
            <p className="text-red-500 text-xs italic ">{errors.zipCode}</p>
          )}
        </div>
      </div>
    </>
  );
}

export default AddressComponent;
