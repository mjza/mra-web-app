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
