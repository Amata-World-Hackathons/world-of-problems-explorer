import { useMemo } from "react";

const IMGUR_CLIENT_ID = "62136372e23f4e7";
const AUTHORIZATION = `Client-ID ${IMGUR_CLIENT_ID}`;

async function uploadFile(file: File) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch("https://api.imgur.com/3/upload", {
    method: "POST",
    headers: {
      Authorization: AUTHORIZATION,
      Accept: "application/json",
    },
    body: formData,
  });

  const json = await response.json();

  if (!json.data.error) {
    console.error("response dump: ", json.data.error);
    throw new Error("Failed to upload image");
  }

  return json.data.link;
}

export function useFileUploadService() {
  return useMemo(() => ({ uploadFile }), []);
}
