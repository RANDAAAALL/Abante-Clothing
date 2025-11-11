export const validateFilenamePattern = (
    filename: string,
    productName: string,
    productColor: string,
    isBackImage: boolean = false
  ) => {
    const formattedProductName = productName.toLowerCase().replace(/\s+/g, "-");
    const formattedProductColor = productColor.toLowerCase().replace(/\s+/g, "-");
  
    const expectedBase = `abante-t-shirt-${formattedProductName}-${formattedProductColor}`;
    const expectedPattern = isBackImage ? `${expectedBase}-back-image` : expectedBase;
  
    const uploadedFilename = filename.replace(/\.[^/.]+$/, "").toLowerCase();
    return uploadedFilename === expectedPattern;
  };