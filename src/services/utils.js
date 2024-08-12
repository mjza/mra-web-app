/**
 * Handles and combines error messages from a given data object.
 *
 * This function checks if the provided `data` object contains an `errors` property
 * with an array of errors. If so, it combines all error messages into a single
 * string, with each error message prefixed by its index in the array. If the `data`
 * object has a `message` property, it returns that message. Otherwise, it returns
 * the combined error message string.
 *
 * @param {Object} data - The data object containing error information.
 * @param {Object[]} [data.errors] - An array of error objects.
 * @param {string} [data.errors[].msg] - The error message string in each error object.
 * @param {string} [data.message] - A message string provided in the data object.
 * @param {string} message - A default message to return if no errors or message are found in the data object.
 * @returns {string} - The combined error message string or the data.message string.
 */
const handlingErrors = (data, message) => {
    if (data.errors && data.errors.length) {
        // Combine all error messages into one string
        message = data.errors.map((err, index) => `${index + 1}. ${err.msg}`).join('\n');
    }
    if (data.message)
        return data.message;
    return message;
}

export { handlingErrors };

/**
 * Retrieves the current geolocation coordinates (latitude and longitude) of the user.
 * Utilizes the browser's Geolocation API to access the user's location.
 *
 * @returns {Promise<{latitude: number, longitude: number}>} A promise that resolves to an object containing latitude and longitude.
 * If geolocation is not supported or if there is an error obtaining the location, an error message is logged.
 *
 * @example
 * getGeolocation().then(coords => {
 *   console.log(coords.latitude, coords.longitude);
 * }).catch(error => {
 *   console.error('Error:', error);
 * });
 */
const getGeolocation = () => {
    return new Promise((resolve, reject) => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                /**
                 * Success callback executed when the geolocation is successfully obtained.
                 *
                 * @param {GeolocationPosition} position - The position object containing the coordinates.
                 * @param {GeolocationCoordinates} position.coords - The coordinates of the current position.
                 * @param {number} position.coords.latitude - The latitude of the current position.
                 * @param {number} position.coords.longitude - The longitude of the current position.
                 */
                (position) => {
                    const { latitude, longitude } = position.coords;
                    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
                    resolve({ latitude, longitude });
                },
                /**
                 * Error callback executed when there is an error obtaining the geolocation.
                 *
                 * @param {GeolocationPositionError} error - The error object containing error details.
                 * @param {number} error.code - The error code.
                 * @param {string} error.message - A human-readable message explaining the error.
                 */
                (error) => {
                    console.error("Error obtaining geolocation: ", error.message);
                    reject(error.message);
                }
            );
        } else {
            const errorMessage = "Geolocation is not supported by this browser.";
            console.error(errorMessage);
            reject(errorMessage);
        }
    });
};

export { getGeolocation };

/**
 * Accesses the back camera of the device and captures a picture.
 * Falls back to the front camera if the back camera is not available.
 *
 * @param {string} [outputFormat='blob'] - The desired output format: 'blob' for a File object or 'base64' for a Base64 string.
 * @returns {Promise<File|string>} A promise that resolves to a File object or Base64 string containing the captured image data.
 *
 * @example
 * capturePicture('blob').then(file => {
 *   console.log(file);
 * }).catch(error => {
 *   console.error('Error capturing image:', error);
 * });
 * 
 * @example
 * capturePicture('base64').then(base64String => {
 *  console.log('Base64 String:', base64String);
 * }).catch(error => {
 *  console.error('Error capturing image:', error);
 * });
 */
const capturePicture = (outputFormat = 'blob') => {
    return new Promise((resolve, reject) => {
        const constraints = {
            video: {
                facingMode: { exact: 'environment' }, // Attempt to access the back camera
                width: { ideal: 1920 },  // Ideal width in pixels
                height: { ideal: 1080 }, // Ideal height in pixels
                aspectRatio: { ideal: 16 / 9 }, // Ideal aspect ratio
                frameRate: { ideal: 15, max: 30 } // Attempt to limit frame rate for stability
            }
        };

        const captureFromStream = (stream) => {
            const video = document.createElement('video');
            video.autoplay = true;
            video.srcObject = stream;

            // Access the video track to log its settings
            const videoTrack = stream.getVideoTracks()[0];
            const settings = videoTrack.getSettings();
            console.log('Camera Settings:', settings);

            video.onloadedmetadata = () => {
                video.play();

                video.onplay = () => {
                    setTimeout(() => {
                        const canvas = document.createElement('canvas');
                        const context = canvas.getContext('2d');

                        // Calculate aspect ratio
                        const targetWidth = video.videoWidth;
                        const targetHeight = video.videoHeight;

                        // Set canvas dimensions based on the video aspect ratio
                        canvas.width = targetWidth;
                        canvas.height = targetHeight;

                        // Draw video frame onto canvas, preserving aspect ratio
                        context.drawImage(video, 0, 0, targetWidth, targetHeight);

                        // Stop the video stream to release the camera
                        stream.getTracks().forEach(track => track.stop());

                        // Convert the canvas to the desired format
                        if (outputFormat === 'blob') {
                            canvas.toBlob(blob => {
                                const file = new File([blob], 'captured_image.png', { type: 'image/png' });
                                resolve(file);
                            }, 'image/png');
                        } else if (outputFormat === 'base64') {
                            const base64Data = canvas.toDataURL('image/png');
                            resolve(base64Data);
                        } else {
                            reject('Invalid output format specified.');
                        }
                    }, 500); // Shorter delay after play starts
                };
            };
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(captureFromStream)
            .catch(() => {
                const fallbackConstraints = {
                    video: { facingMode: 'user' }, // Attempt to access the front camera
                    //width: { ideal: 1024 },  // Ideal width in pixels
                    height: { ideal: 768 }, // Ideal height in pixels
                    aspectRatio: { ideal: 4 / 3 }, // Ideal aspect ratio
                    frameRate: { ideal: 15, max: 30 } // Attempt to limit frame rate for stability
                };

                navigator.mediaDevices.getUserMedia(fallbackConstraints)
                    .then(captureFromStream)
                    .catch(error => {
                        reject(`Failed to access any camera: ${error.message}`);
                    });
            });
    });
};

export { capturePicture };