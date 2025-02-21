import axios from "axios";
import { getAuthToken } from "./Utils";

export const getItems = async () => {
  try {
    const token = await getAuthToken();
    return axios.get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error("Error fetching items:", err);
    throw err;
  }
};

// Get email associated with item id
export const getItemEmail = async (props) => {
  const token = await getAuthToken();
  return axios
    .get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/${
        props.id
      }/email`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .catch((err) => console.error(err));
};

export const getLeaderboardCount = async () => {
  const token = await getAuthToken();

  return axios
    .get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/leaderboard/count`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .catch((err) => console.log(err));
};

export const deleteItem = async (props) => {
  const token = await getAuthToken();
  return axios
    .delete(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/${props.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
    .catch((err) => console.error(err));
};
