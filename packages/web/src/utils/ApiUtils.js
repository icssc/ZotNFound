import axios from "axios";

export const getItems = async () => {
  return axios
    .get(`${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/`)
    .catch((err) => console.log(err));
};

// Get email associated with item id
export const getItemEmail = (props, token) => {
  return axios
    .get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/${
        props.id
      }/email`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // verify auth
        },
      }
    )
    .catch((err) => console.log(err));
};

// Get the preferred conrtact method associated with an item id
export const getItemContactMethod = (props, token) => {
  return axios
    .get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/${
        props.id
      }/contactMethod`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // verify auth
        },
      }
    )
    .catch((err) => console.log(err));
};

// Get the phone number associated with an item id
export const getItemPhoneNumber = (props, token) => {
  return axios
    .get(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/${
        props.id
      }/phoneNumber`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // verify auth
        },
      }
    )
    .catch((err) => console.log(err));
};

export const getLeaderboardCount = async () => {
  return axios
    .get(`${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/leaderboard/count`)
    .catch((err) => console.log(err));
};

export const deleteItem = (props, token) => {
  axios
    .delete(
      `${import.meta.env.VITE_REACT_APP_AWS_BACKEND_URL}/items/${props.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // verify auth
        },
      }
    )
    .then(() => console.log("Success"))
    .catch((err) => console.log(err));
};
