const express = require('express');
const crypto = require('crypto');
const app = express();
const PORT = 3000;

// Middleware para procesar JSON en el cuerpo de la peticion
app.use(express.json());

const sendResponse = (res, data, error = null) => {
    if (error) {
        return res.status(400).json({ status: "error", message: error });
    }
    return res.json({ status: "success", result: data });
};

// Mas caracteres
app.post('/mascaracteres', (req, res) => {
    const { str1, str2 } = req.body;
    if (typeof str1 !== 'string' || typeof str2 !== 'string') 
        return sendResponse(res, null, "Se requieren dos cadenas: str1 y str2");
    
    const result = str2.length > str1.length ? str2 : str1;
    sendResponse(res, result);
});

// Menos caracteres
app.post('/menoscaracteres', (req, res) => {
    const { str1, str2 } = req.body;
    if (typeof str1 !== 'string' || typeof str2 !== 'string') 
        return sendResponse(res, null, "Se requieren dos cadenas: str1 y str2");

    const result = str2.length < str1.length ? str2 : str1;
    sendResponse(res, result);
});

// Numero de caracteres
app.post('/numcaracteres', (req, res) => {
    const { cadena } = req.body;
    if (typeof cadena !== 'string') 
        return sendResponse(res, null, "Se requiere una cadena en el campo 'cadena'");
    
    sendResponse(res, cadena.length);
});

// Palíndroma
app.post('/palindroma', (req, res) => {
    const { cadena } = req.body;
    if (typeof cadena !== 'string') 
        return sendResponse(res, null, "Parametro invlido");
    
    const limpia = cadena.toLowerCase().replace(/[\W_]/g, '');
    const esPalindroma = limpia === limpia.split('').reverse().join('');
    sendResponse(res, esPalindroma);
});

// Concat
app.post('/concat', (req, res) => {
    const { str1, str2 } = req.body;
    if (typeof str1 !== 'string' || typeof str2 !== 'string') 
        return sendResponse(res, null, "Faltan cadenas para concatenar");
    
    sendResponse(res, str1 + str2);
});

// Apply SHA256
app.post('/applysha256', (req, res) => {
    const { cadena } = req.body;
    if (!cadena) return sendResponse(res, null, "Cadena vacía");
    
    const hash = crypto.createHash('sha256').update(cadena).digest('hex');
    sendResponse(res, { original: cadena, encriptada: hash });
});

// Verify SHA256
app.post('/verifysha256', (req, res) => {
    const { cadena_normal, cadena_encriptada } = req.body;
    if (!cadena_normal || !cadena_encriptada) 
        return sendResponse(res, null, "Faltan parametros de comparacion");

    const hashGenerado = crypto.createHash('sha256').update(cadena_normal).digest('hex');
    sendResponse(res, hashGenerado === cadena_encriptada);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});