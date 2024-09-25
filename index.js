const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function obtenerListaDeURLs() {
    try {
        const respuesta = await axios.get('https://storage.googleapis.com/panels-api/data/20240916/media-1a-i-p~s');
        const datos = respuesta.data.data;
        const listaDeURLs = [];
        // Dentro del objeto datos pueden haber otros objetos, por lo que se debe recorrer cada uno de ellos y ver si son objetos o contienen una url

        for (const key in datos) {
            if (datos.hasOwnProperty(key)) {
                const elemento = datos[key];
                if (typeof elemento === 'string') {
                    listaDeURLs.push(elemento);
                } else {
                    for (const key in elemento) {
                        if (elemento.hasOwnProperty(key)) {
                            const subElemento = elemento[key];
                            if (typeof subElemento === 'string') {
                                listaDeURLs.push(subElemento);
                            }
                        }
                    }
                }
            }
        }
        return listaDeURLs;
    } catch (error) {
        console.error('Error al obtener la lista de URLs:', error);
        throw error;
    }
}

async function descargarImagenes() {
    try {
        const urls = await obtenerListaDeURLs();
        for (const [index, url] of urls.entries()) {
            const respuesta = await axios.get(url, { responseType: 'arraybuffer' });
            const extension = path.extname(url).split('?')[0]; // Obtener la extensión del archivo
            const nombreArchivo = path.join(__dirname, `images/imagen_${index}${extension}`);
            fs.writeFileSync(nombreArchivo, respuesta.data);
            console.log(`Imagen guardada como ${nombreArchivo}`);
        }
    } catch (error) {
        console.error('Error al descargar las imágenes:', error);
    }
}

// Llamar a la función para probarla
descargarImagenes();