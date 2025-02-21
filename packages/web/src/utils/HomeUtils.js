import axios from "axios";
import { getAuth } from "firebase/auth";

const getAuthToken = async () => {
  const auth = getAuth();
  const token = await auth.currentUser?.getIdToken(true);
  return token;
};

// retrieve a list of items ALL TIME
const retrieveItemsAllTime = async (
  setData,
  setDateRangeFilter,
  setLoading
) => {
  try {
    setLoading(false);
    const token = await getAuthToken();
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response.data.map((item) => ({ ...item, id: item.id })));
    setDateRangeFilter("All");
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(true);
  }
};

// retrieve a list of items from the last 7 days
const retrieveItemsWithinWeek = async (
  setData,
  setDateRangeFilter,
  setLoading
) => {
  try {
    setLoading(false);
    const token = await getAuthToken();
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/week`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response.data.map((item) => ({ ...item, id: item.id })));
    setDateRangeFilter("Last 7 Days");
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(true);
  }
};

// retrieve a list of items from the last 2 weeks
const retrieveItemsWithinTwoWeeks = async (
  setData,
  setDateRangeFilter,
  setLoading
) => {
  try {
    setLoading(false);
    const token = await getAuthToken();
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/two_weeks`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response.data.map((item) => ({ ...item, id: item.id })));
    setDateRangeFilter("Last 14 Days");
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(true);
  }
};

// retrieve a list of items from the last month
const retrieveItemsWithinMonth = async (
  setData,
  setDateRangeFilter,
  setLoading
) => {
  try {
    setLoading(false);
    const token = await getAuthToken();
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/month`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response.data.map((item) => ({ ...item, id: item.id })));
    setDateRangeFilter("Last 30 Days");
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(true);
  }
};

// retrieve a list of items from the last year
const retrieveItemsWithinYear = async (
  setData,
  setDateRangeFilter,
  setLoading
) => {
  try {
    setLoading(false);
    const token = await getAuthToken();
    const response = await axios.get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/year`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setData(response.data.map((item) => ({ ...item, id: item.id })));
    setDateRangeFilter("This Year");
  } catch (error) {
    console.log(error);
  } finally {
    setLoading(true);
  }
};

export {
  retrieveItemsAllTime,
  retrieveItemsWithinWeek,
  retrieveItemsWithinTwoWeeks,
  retrieveItemsWithinMonth,
  retrieveItemsWithinYear,
};
