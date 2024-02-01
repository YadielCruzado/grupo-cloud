const fs = require("fs");

/**
 *
 * @param {string} file - Files path
 * @param {string} data - Information to be writen to file
 */
exports.writeTo = (file, data) => {
  if (typeof data != String) {
    data = JSON.stringify(data);
  }
  fs.writeFileSync(file, data, "utf-8");
};

/**
 * @param {string} file - Files path
 * @returns {json}
 */
exports.readFrom = (file) => {
  if (fs.existsSync(file)) {
    let data = fs.readFileSync(file, "utf8");
    data = JSON.parse(data);
    return data;
  }
};

/**
 *
 * @param {string} message - Message to be decoded to a json
 * @returns {json | string} - return a JSON if decoding succesfull else a error string
 */
exports.decodeMessage = (message) => {
  try {
    if (typeof message == String) {
      message == JSON.parse(message);

      if (typeof message != Object) {
        throw "Not a JSON";
      }
    } else {
      throw "Not a string";
    }
  } catch (err) {
    console.log(err);
    message = "error";
  }

  return message;
};
