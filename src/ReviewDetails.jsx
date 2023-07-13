import { useEffect, useState } from "react";
import {
  getPersonalDetails,
  getDebitCardDetails,
  getBusinessDetails,
  resetFakeBackend
} from "./api.service";

export default function ReviewDetails(props) {
  const [personal, setPersonal] = useState({});
  const [business, setBusiness] = useState({});
  const [debitCard, setDebitCard] = useState({});

  const formatAddressLine = (address, city, state, zipCode) => {
    return `${address}, ${city}, ${state} - ${zipCode}`;
  };

  useEffect(() => {
    Promise.all([
      getPersonalDetails(),
      getBusinessDetails(),
      getDebitCardDetails()
    ]).then((res) => {
      const [personalData, businessData, debitCardData] = res;

      setPersonal({
        Name: personalData.name,
        SSN: personalData.ssn,
        Address: formatAddressLine(
          personalData.address,
          personalData.city,
          personalData.state,
          personalData.zipCode
        )
      });

      setBusiness({
        "Business Name": businessData.businessName,
        "State Registered": businessData.stateRegistered,
        Address: businessData.isSameAsPersonal
          ? "Same as Personal"
          : formatAddressLine(
              businessData.address,
              businessData.city,
              businessData.state,
              businessData.zipCode
            )
      });

      const isSame = debitCardData.isSameAsPersonal
        ? "Same as Personal"
        : debitCardData.isSameAsBusiness
        ? "Same as Business"
        : "";
      setDebitCard({
        "Name To Be Printed": debitCardData.nameToBePrinted,
        Address:
          isSame ||
          formatAddressLine(
            debitCardData.address,
            debitCardData.city,
            debitCardData.state,
            debitCardData.zipCode
          )
      });
    });
  }, []);

  const clearStorage = () => {
    resetFakeBackend();
    props.onNext();
  };
  return (
    <>
      <div className="max-w-xl rounded overflow-hidden shadow-lg p-8 border m-auto mt-12">
        <h1 className="my-4">Personal Details</h1>
        <hr></hr>
        {Object.entries(personal).map(([key, value]) => {
          return (
            <div
              key={`personal-${key}`}
              className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            >
              <dt className="text-sm font-medium leading-6 text-gray-900">
                {key}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {value}
              </dd>
            </div>
          );
        })}

        <h1 className="my-4">Business Details</h1>
        <hr></hr>
        {Object.entries(business).map(([key, value]) => {
          return (
            <div
              key={`business-${key}`}
              className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            >
              <dt className="text-sm font-medium leading-6 text-gray-900">
                {key}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {value}
              </dd>
            </div>
          );
        })}

        <h1 className="my-4">Debit Card Details</h1>
        <hr></hr>
        {Object.entries(debitCard).map(([key, value]) => {
          return (
            <div
              key={`debit-${key}`}
              className="px-4 py-1 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0"
            >
              <dt className="text-sm font-medium leading-6 text-gray-900">
                {key}
              </dt>
              <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
                {value}
              </dd>
            </div>
          );
        })}
        <div className="mt-2">
          <button
            onClick={() => props.onBack()}
            className="bg-blue-500 hover:bg-blue-700 text-white p-1 px-2 mr-5"
          >
            Back
          </button>

          <button
            onClick={() => clearStorage()}
            className="bg-blue-500 hover:bg-blue-700 text-white p-1 px-2"
          >
            Finish
          </button>
        </div>
      </div>
    </>
  );
}
