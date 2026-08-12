

export const handleUpload = async (file, metadata) => {
  try {
    const urlResponse = await fetch(
    `${import.meta.env.VITE_BACKEND_ENDPOINT}/api/r2/upload-url`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const {sucess,key, uploadUrl,r2Id } = await urlResponse.json();
    console.log("Upload URL:", uploadUrl);

    const uploadResponse = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: file,
    });



    if (!uploadResponse.ok) {
      throw new Error("R2 upload failed");
    }
    const r2ETag=uploadResponse.ETag;

    console.log("PDF uploaded to R2");

    const dbResponse = await fetch(
        `${import.meta.env.VITE_BACKEND_ENDPOINT}/upload`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...metadata,
          paper_id: r2Id,
          r2Key: key,
          r2ETag:r2ETag,
          fileId:r2Id
        }),
      }
    );

    const result = await dbResponse.json();

    return {
        status: dbResponse.status,
        ...result,
    };
  } catch (error) {
    console.error("Upload failed:", error);
  }
};

export const viewPaper=  (key)=>{
  return `https://pdf.nitkkrpyqs.in/${key}`;
}
