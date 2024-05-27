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

export {handlingErrors};