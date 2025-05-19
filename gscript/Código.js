const idHojaPostulaciones = '1WM1EkWKDzKvuAfjENg6uMzSemUx1hm9z-wU_XParyBo';
const idCarpetaCv = '1DOWuTTCudRirkQIt3r94hVkcV9A8XsU2';

function listarOfertas() {
  var sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();
  var content = [];

  // Filtramos las columnas de interés (0 y 2)
  for (let row of data) {
    content.push(row.filter((val, i) => i == 0 || i == 2));
  }

  // Usamos el primer valor de cada fila como encabezado
  var header = content.shift();

  // Mapeamos el contenido a un formato de objeto usando el encabezado
  var json = content.map(fila => {
    return header.reduce((ac, val, i) => {
      ac[val] = fila[i];
      return ac;
    }, {});
  });

  // Devolvemos el JSON
  return ContentService.createTextOutput(JSON.stringify(json))
    .setMimeType(ContentService.MimeType.JSON);
}

function doGet(e) {
  var action = e.parameter.action;

  // Comprobamos si la acción es "listarOfertas"
  if (action === "listarOfertas") {
    return listarOfertas();
  } else {
    return HtmlService.createHtmlOutput("No existe.");
  }
}

function doPost(e) {
  loggear("doPost ejecutado");
  const datos = JSON.parse(e.postData.contents);
  loggear(JSON.stringify(datos, null, '\t'));
  const base64 = datos.base64;
  const mType = datos.mimeType ||"text/plain";
  loggear(`Mimetype: ${mType}`);
  const fileEXtension = mType.includes("pdf") ? "pdf" : mType.includes("docx") ? "docx" : mType.includes("doc") ? "doc" : "bin";
  loggear(`Extensión del archivo: *.${fileEXtension}`);
  const nombreArchivo = `cv_${datos.rut}.${fileEXtension}`;
  loggear(`Nombre de archivo obtenido: ${nombreArchivo}`);
  // const contenido = Utilities.base64Decode(base64);
  // const blob = Utilities.newBlob(contenido, mType, nombreArchivo);
  // //creamos  el archivo
  // const archivo = Drive.Files.create({
  //   title: nombreArchivo,
  //   parents: [
  //     { id: idCarpetaCv }
  //   ]
  // }, blob);
  // //limpieza de encabezados
  // const clavesUtiles = Object.keys(datos).filter(k => !["base64", "mimeType", "nombreArchivo"]);
  // //abrimos hoja de postulaciones
  // const hojaPostulaciones = SpreadsheetApp.openById(idHojaPostulaciones);
  // // agregamos a las claves el link a cv
  // clavesUtiles.push("Link CV");
  // if (hojaPostulaciones.getLastRow() == 0) {
  //   hojaPostulaciones.appendRow(clavesUtiles);
  // }
  // const fila = clavesUtiles.map(k => datos[k]);
  // fila.push(archivo.webViewLink);
  // hojaPostulaciones.appendRow(fila);
  return ContentService.createTextOutput("Postulación agregada").setMimeType(ContentService.MimeType.TEXT);
}
/**
 * Vuelca el mensaje pasado a un documento de google para un loggin accesible de appscript.
 * @param {string} mensaje - el texto que se desea pasar al log
 */
function loggear(mensaje){
  const ahora= new Date().toLocaleString();
  const idLog='1jBRS6IXBIv_vPSjRdEpozmk-csrH3BppDJtRMEokxOU';
  const doclog = DocumentApp.openById(idLog);
  const body=doclog.getBody();
  body.appendParagraph(`[${ahora}]:
    ${mensaje}`);
    doclog.saveAndClose();
}
