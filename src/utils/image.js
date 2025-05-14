/**
 * calculates the size of the image, how it would stretch to the borders of the container,
 * while maintaining its proportions (Image -> resizeMode="contain")
 */
export const resizeImage = (
  { width: imgWidth, height: imgHeight }, // original image size
  { width, height } // target image size
) => {
  const rw = imgWidth / width;
  const rh = imgHeight / height;
  if (rw > rh) {
    return {
      width: width,
      height: imgHeight / rw,
    };
  } else {
    return {
      width: imgWidth / rh,
      height: height,
    };
  }
};
