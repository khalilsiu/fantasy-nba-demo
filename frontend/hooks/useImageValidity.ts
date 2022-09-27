import { useState, useEffect } from "react";

function checkImage(url: string): Promise<boolean> {
  var image = new Image();
  return new Promise((resolve, reject) => {
    image.onload = function () {
      if (image.width > 0) {
        resolve(true)
      }
    }
    image.onerror = function () {
      resolve(false)
    }
    image.src = url;
  })
}

export function useImageValidity(uri: string) {
  const [isValid, setIsValid] = useState(false);
  useEffect(() => {
    (async () => {
      if (uri) {
        const isValid = await checkImage(uri)
        setIsValid(isValid)
      }
    })()
  }, [uri]);
  return isValid;
}
