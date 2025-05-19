const { chromium } = require('playwright');
const path = require('path');

(async () => {
    const navegador = await chromium.launch({ headless: true});
    const pagina = await navegador.newPage();

    // definición de consola
    pagina.on('console', msg => {
        console.log(`Tipo de mensaje: ${msg.type()}:
            ${msg.text()}`);
    });
    // Ruta local al archivo HTML
    await pagina.goto('http://localhost:5500/formulario.html');

    // Llenar campos del formulario
    await pagina.fill('#nombre', 'Williams Cuevas');
    await pagina.fill('#rut', '162383558');
    await pagina.fill('#fechaNacimiento', '1985-07-19');
    await pagina.fill('#telefono', '968402013');
    await pagina.fill('#correo', 'wcuevash@outlook.com');
    await pagina.fill('#repiteCorreo', 'wcuevash@outlook.com');
    await pagina.fill('#direccion', 'avenida Brasil 875');
    await pagina.selectOption('#region', { label: 'Región Metropolitana de Santiago' }, { timeout: 100000 });
    await pagina.selectOption('#comuna', { label: 'Santiago' });
    await pagina.fill('#experiencia', '5 años en atención al cliente');
    await pagina.selectOption('#escolaridad', { value: 'universitaria' });
    await pagina.fill('#profesion', 'Informático');

    // Radios
    await pagina.check('#ceguera');
    await pagina.check('#credencialSi');
    await pagina.check('#pensionSi');
    await pagina.check('#tifloAvanzado');

    // Subir archivo CV
    const cvPath = path.resolve(__dirname, 'cv.pdf');
    await pagina.setInputFiles('#curriculum', cvPath);

    // Ajustes entrevista
    await pagina.fill('#ajustesEntrevista', 'Ninguno por ahora');

    // Enviar el formulario
    await pagina.click('button[type="submit"]');

    // Esperar unos segundos para ver resultado
    await pagina.waitForTimeout(3000);

    await navegador.close();
})();
