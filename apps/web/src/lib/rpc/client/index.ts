import rpc from "@nextplate/rpc";
import { getCookies } from "cookies-next/client";

export const getClient = async () => {
  const cookieStore = getCookies();

  let cookiesList;

  if (cookieStore) {
    cookiesList = Object.entries(cookieStore)
      .map(([name, value]) => `${name}=${value}`)
      .join("; ");
  } else {
    cookiesList = "";
  }

  // Use relative URLs in production, absolute in development
  const baseUrl =
    process.env.NODE_ENV === "development" ? "http://localhost:8000" : "";

  return rpc(baseUrl, {
    headers: {
      cookie: cookiesList
    }
  });
};
