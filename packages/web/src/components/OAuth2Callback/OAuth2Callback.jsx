import axios from "axios";
import React, { useEffect } from "react";
import Cookies from "universal-cookie";

const cookies = new Cookies();

export default function OAuth2Callback() {
  useEffect(() => {
    async function validateAuth() {
      const params = new URLSearchParams(window.location.search);
      const authorizationCode = params.get("code");
      const codeVerifier = cookies.get("codeVerifier");
      const authuser = params.get("authuser");

      if (!authorizationCode || !codeVerifier || !authuser) {
        console.error(
          "Missing authorization code or code verifier or authuser"
        );
        return;
      }

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_AWS_API_ENDPOINT}/googleOAuth/validate`,
          {
            params: {
              code: authorizationCode,
              codeVerifier: codeVerifier,
              authuser: authuser,
            },
          }
        );

        cookies.set(res.data.sessionCookie.name, res.data.sessionCookie.value);

        window.location.href = res.data.redirectUrl;
      } catch (error) {
        console.error("Error validating authorization code: ", error.message);
        if (error.response) {
          console.error("Server responded with:", error.response.data);
        }
      }
    }

    validateAuth();
  }, []);

  return <>OAuth2Callback</>;
}
