export const createFileFromBlobURL = async (blobUrl: string, filename: string = "blog_article"): Promise<File> => {
    // Fetch the blob from the blob URL
    const response = await fetch(blobUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch blob from ${blobUrl}`);
    }
  
    // Read the content as a blob
    const blob = await response.blob();
  
    // Create a File object from the blob with an empty string as the filename
    const file = new File([blob], filename + ".png", { type: blob.type });
  
    return file;
};