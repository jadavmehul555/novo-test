/**
 * Service responsible for data fetching and updation
 */

const METHOD = {
    GET: "get",
    POST: "post",
  };
  
  const RESOURCES = {
    PERSONAL: "personal",
    BUSINESS: "business",
    DEBIT_CARD: "debit_card",
  };
  
  function resetFakeBackend() {
    localStorage.removeItem(RESOURCES.PERSONAL);
    localStorage.removeItem(RESOURCES.BUSINESS);
    localStorage.removeItem(RESOURCES.DEBIT_CARD);
  }
  
  // Fake api client which returns a promise
  // Using fetch to make it more close to actual API Integration
  function fakeApiClient(resource, type, value = {}) {
    if (type === METHOD.POST) {
      localStorage.setItem(resource, JSON.stringify(value));
      return fetch('data:, {"status": "success"}').then((res) => res.json());
    } else if (type === METHOD.GET) {
      const data = localStorage.getItem(resource);
      if (data) {
        return fetch(`data:, ${data}`).then((res) => res.json());
      }
      return fetch(`data:, null`).then((res) => res.json());
    }
  }
  
  function updatePersonalDetails(data) {
    return fakeApiClient(RESOURCES.PERSONAL, METHOD.POST, data);
  }
  
  function getPersonalDetails() {
    return fakeApiClient(RESOURCES.PERSONAL, METHOD.GET);
  }
  
  function updateBusinessDetails(data) {
    return fakeApiClient(RESOURCES.BUSINESS, METHOD.POST, data);
  }
  function getBusinessDetails() {
    return fakeApiClient(RESOURCES.BUSINESS, METHOD.GET);
  }
  
  function updateDebitCardDetails(data) {
    return fakeApiClient(RESOURCES.DEBIT_CARD, METHOD.POST, data);
  }
  
  function getDebitCardDetails() {
    return fakeApiClient(RESOURCES.DEBIT_CARD, METHOD.GET);
  }
  
  export {
    getBusinessDetails,
    getDebitCardDetails,
    getPersonalDetails,
    updateBusinessDetails,
    updateDebitCardDetails,
    updatePersonalDetails,
    resetFakeBackend,
  };
  