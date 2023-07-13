import { useState, useRef, useEffect } from "react";
import "./App.css";
import AddressComponent, { INITIAL_ADDRESS } from "./common/AddressComponent";

import { updatePersonalDetails, getPersonalDetails } from "./api.service";

function PersonalDetails(props) {
  const addressRef = useRef(null);
  const [name, setName] = useState("");
  const [ssn, setSsn] = useState("");

  const [address, setAddress] = useState(INITIAL_ADDRESS);

  const [inputValidations, setInputValidations] = useState({});

  const setValidatedSsn = (value) => {
    if (!isNaN(value)) {
      const num = Number(value);
      setSsn(value ? num : "");
    }
  };

  const validateInputs = () => {
    const validations = {};
    if (!name) {
      validations.name = "Name is Required";
    }

    if (ssn.toString().length !== 9) {
      validations.ssn = "SSN should cotain 9 digits";
    }

    if (!ssn) {
      validations.ssn = "SSN is Required";
    }
    setInputValidations(validations);
    return Object.keys(validations).length === 0;
  };

  const updateAddress = (newValue) => {
    setAddress((curr) => ({ ...curr, ...newValue }));
  };

  const save = () => {
    const data = {
      name,
      ssn,
      ...address
    };

    return updatePersonalDetails(data);
  };

  const saveInformation = () => {
    const validAddress = addressRef.current.validate();

    if (validateInputs() && validAddress) {
      save().then((res) => {
        if (res.status === "success") {
          props.onNext();
        }
      });
    }
  };

  useEffect(() => {
    getPersonalDetails().then((data) => {
      if (data) {
        const addressObject = {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode
        };
        setAddress(addressObject);
        setName(data.name);
        setSsn(data.ssn);
      }
    });
  }, []);

  return (
    <div className="max-w-xl rounded overflow-hidden shadow-lg p-8 border m-auto mt-12">
      <h1 className="my-2">Personal Info</h1>
      <hr></hr>

      <div className="md:flex md:items-center mb-4 mt-2">
        <div className="md:w-1/3">
          <label className="text-sm">Name</label>
        </div>
        <div className="md:w-2/3">
          <input
            className="border rounded "
            type="text"
            value={name}
            onInput={(e) => setName(e.target.value)}
          ></input>
          {inputValidations.name && (
            <p className="text-red-500 text-xs italic ">
              {inputValidations.name}
            </p>
          )}
        </div>
      </div>

      <div className="md:flex md:items-center mb-4">
        <div className="md:w-1/3">
          <label className="text-sm">SSN</label>
        </div>
        <div className="md:w-2/3">
          <input
            className="border rounded "
            type="text"
            value={ssn}
            onInput={(e) => setValidatedSsn(e.target.value)}
            maxLength="9"
          ></input>
          {inputValidations.ssn && (
            <p className="text-red-500 text-xs italic">
              {inputValidations.ssn}
            </p>
          )}
        </div>
      </div>

      <AddressComponent
        inputRef={addressRef}
        value={address}
        updateAddress={(value) => updateAddress(value)}
      />
      <div>
        <button
          onClick={() => saveInformation()}
          className="bg-blue-500 hover:bg-blue-700 text-white p-1 px-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PersonalDetails;
