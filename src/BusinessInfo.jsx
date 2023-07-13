import { useState, useRef, useEffect } from "react";
import AddressComponent, { INITIAL_ADDRESS } from "./common/AddressComponent";
import StateInputComponent from "./common/StateInputComponent";
import {
  getBusinessDetails,
  updateBusinessDetails,
  getPersonalDetails
} from "./api.service";

function BusinessInfo(props) {
  const addressRef = useRef(null);
  const stateRef = useRef();

  const [personalAddress, setPersonalAddress] = useState();

  const [businessName, setBusinessName] = useState("");
  const [stateRegistered, setStateRegistered] = useState("");
  const [address, setAddress] = useState(INITIAL_ADDRESS);

  const [businessNameError, setBusinessNameError] = useState("");

  // Update address object
  const updateAddress = (newValue) => {
    if (newValue.isSameAsPersonal) {
      setAddress(() => ({ ...personalAddress, ...newValue }));
    } else {
      setAddress((curr) => ({ ...curr, ...newValue }));
    }
  };

  const save = () => {
    // Drop address values if it is same as personal
    const updatedAddress = address.isSameAsPersonal
      ? {
          isSameAsPersonal: true
        }
      : address;

    const data = {
      businessName,
      stateRegistered,
      ...updatedAddress
    };

    return updateBusinessDetails(data);
  };

  // check whether fields are valid or not
  const validateInputs = () => {
    const validState = stateRef.current.validate();
    const validAddress = addressRef.current.validate();

    if (!businessName) {
      setBusinessNameError("Business Name is required");
    } else {
      setBusinessNameError("");
    }
    return businessName && validState & validAddress;
  };

  // Make the API call to save the info
  const saveInfo = () => {
    if (validateInputs()) {
      save().then((res) => {
        if (res.status === "success") {
          props.onNext();
        }
      });
    }
  };

  // Get Personal address details to populate when checkbox is clicked
  const getPersonalAddress = () => {
    return getPersonalDetails();
  };

  useEffect(() => {
    // Get personal address details
    const asnycFunc = async () => {
      const data = await getPersonalAddress();
      const businessData = await getBusinessDetails();

      if (businessData) {
        const addressObject = {
          address: data.address,
          city: data.city,
          state: data.state,
          zipCode: data.zipCode,
          ...(businessData.isSameAsPersonal ? data : {}),
          isSameAsBusiness: businessData.isSameAsBusiness,
          isSameAsPersonal: businessData.isSameAsPersonal
        };
        setAddress(addressObject);
        setBusinessName(businessData.businessName);
        setStateRegistered(businessData.stateRegistered);
      }

      setPersonalAddress({
        address: data.address,
        city: data.city,
        zipCode: data.zipCode,
        state: data.state,
        isSameAsBusiness: false,
        isSameAsPersonal: false
      });
    };
    asnycFunc();
  }, []);

  return (
    <div className="max-w-xl rounded overflow-hidden shadow-lg p-8 border m-auto mt-12">
      <h1 className="my-2">Business Info</h1>
      <hr></hr>

      <div className="md:flex md:items-center mb-4 mt-2">
        <div className="md:w-1/3">
          <label className="text-sm">Business Name</label>
        </div>
        <div className="md:w-2/3">
          <input
            className="border rounded "
            type="text"
            value={businessName}
            onInput={(e) => setBusinessName(e.target.value)}
          ></input>
          {businessNameError && (
            <p className="text-red-500 text-xs italic ">{businessNameError}</p>
          )}
        </div>
      </div>

      {/* State registered */}
      <StateInputComponent
        inputRef={stateRef}
        label="State Registered"
        value={stateRegistered}
        setValue={setStateRegistered}
      ></StateInputComponent>

      {/* Common address component */}
      <AddressComponent
        inputRef={addressRef}
        showSameAsPersonal
        value={address}
        updateAddress={(value) => updateAddress(value)}
      />

      <div>
        <button
          onClick={() => props.onBack()}
          className="bg-blue-500 hover:bg-blue-700 text-white p-1 px-2 mr-5"
        >
          Back
        </button>

        <button
          onClick={() => saveInfo()}
          className="bg-blue-500 hover:bg-blue-700 text-white p-1 px-2"
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default BusinessInfo;
