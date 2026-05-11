const express = require('express');
const app = express();
app.use(express.json());

// EJERCICIO 1: Saludo
app.post('/saludo', (req, res) => {
    const { nombre } = req.body;
    if (!nombre || typeof nombre !== 'string') {
        return res.status(400).json({ estado: "error", mensaje: "Nombre no válido" });
    }
    res.json({ estado: "success", mensaje: `Hola, ${nombre}` });
});

// EJERCICIO 2: Calculadora
app.post('/calcular', (req, res) => {
    try {
        const { a, b, operacion } = req.body;
        if (typeof a !== 'number' || typeof b !== 'number') throw new Error("Parámetros deben ser números");

        let resultado;
        switch (operacion) {
            case 'suma': resultado = a + b; break;
            case 'resta': resultado = a - b; break;
            case 'multiplicacion': resultado = a * b; break;
            case 'division': 
                if (b === 0) return res.status(400).json({ estado: "error", error: "División por cero" });
                resultado = a / b;
                break;
            default: throw new Error("Operación no válida");
        }
        res.json({ estado: "success", resultado });
    } catch (err) {
        res.status(400).json({ estado: "error", mensaje: err.message });
    }
});

// EJERCICIO 3: Gestor de Tareas (CRUD Básico)
let tareas = [];
app.post('/tareas', (req, res) => {
    const { id, titulo, completada } = req.body;
    tareas.push({ id, titulo, completada });
    res.json({ estado: "success", mensaje: "Tarea creada" });
});

app.get('/tareas', (req, res) => {
    res.json({ estado: "success", tareas });
});

app.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const { titulo, completada } = req.body;
    const index = tareas.findIndex(t => t.id == id);
    if (index !== -1) {
        tareas[index] = { ...tareas[index], titulo, completada };
        return res.json({ estado: "success", mensaje: "Tarea actualizada" });
    }
    res.status(404).json({ estado: "error", mensaje: "No encontrado" });
});

app.delete('/tareas/:id', (req, res) => {
    tareas = tareas.filter(t => t.id != req.params.id);
    res.json({ estado: "success", mensaje: "Tarea eliminada" });
});

// EJERCICIO 4: Validador de contraseñas
app.post('/validar-password', (req, res) => {
    const { password } = req.body;
    let errores = [];
    if (password.length < 8) errores.push("Mínimo 8 caracteres");
    if (!/[A-Z]/.test(password)) errores.push("Falta una mayúscula");
    if (!/[a-z]/.test(password)) errores.push("Falta una minúscula");
    if (!/[0-9]/.test(password)) errores.push("Falta un número");

    res.json({
        estado: errores.length === 0 ? "success" : "error",
        esValida: errores.length === 0,
        errores
    });
});

// --- EJERCICIO 5: Conversor de Temperatura
app.post('/convertir-temperatura', (req, res) => {
    const { valor, desde, hacia } = req.body;
    let celsius;
    // Conversión a Celsius
    if (desde === 'C') celsius = valor;
    else if (desde === 'F') celsius = (valor - 32) * 5/9;
    else if (desde === 'K') celsius = valor - 273.15;

    let resultado;
    // Conversión de Celsius al destino
    if (hacia === 'C') resultado = celsius;
    else if (hacia === 'F') resultado = (celsius * 9/5) + 32;
    else if (hacia === 'K') resultado = celsius + 273.15;

    res.json({ estado: "success", valorOriginal: valor, valorConvertido: resultado, escalaOriginal: desde, escalaConvertida: hacia });
});

// EJERCICIO 6: Buscador en array
app.post('/buscar', (req, res) => {
    const { array, elemento } = req.body;
    if (!Array.isArray(array)) return res.json({ estado: "error", mensaje: "No es un array" });
    
    const indice = array.indexOf(elemento);
    res.json({
        estado: "success",
        encontrado: indice !== -1,
        indice,
        tipoElemento: typeof elemento
    });
});

// EJERCICIO 7: Contador de Palabras
app.post('/contar-palabras', (req, res) => {
    const { texto } = req.body;
    if (typeof texto !== 'string') return res.json({ estado: "error", mensaje: "Debe ser texto" });
    
    const palabras = texto.trim().split(/\s+/).filter(p => p.length > 0);
    const unicas = new Set(palabras.map(p => p.toLowerCase()));

    res.json({
        estado: "success",
        totalPalabras: palabras.length,
        totalCaracteres: texto.length,
        palabrasUnicas: unicas.size
    });
});

app.listen(3000, () => console.log('Servidor corriendo en puerto 3000'));