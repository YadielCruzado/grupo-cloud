const fs = require("fs");

/**
 *
 * @param {string} file - Files path
 * @param {string} data - Information to be writen to file
 */
exports.writeTo = (file, data) => {
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
  }else {
    // El archivo no existe, así que lo creamos con un objeto vacío.
    fs.writeFileSync(file, JSON.stringify({}), "utf8");
    return {};
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

/**
 *
 * @returns {json | string} - return a JSON if decoding succesfull else a error string
 */
//Funcion para decodificar un mensaje del cliente
exports.decode = (message) => {
  //Verifca que se haya enviado un string
  if (typeof message == "string") {
    //Convierte el string a un objeto JSON
    message = JSON.parse(message);
  }
  //Devuelve el objeto JSON
  return message;
}
