// scrips para los eventos jquery

/* variables compartidas */
const macrourl = "https://script.google.com/macros/s/AKfycbzgoXw5kjMJyjTadF6-sRlx3MnLW_XuS768mEzaqGSVHlVWlCqNVUou8XQJYVsby46Y/exec"
$(document).ready(function () {
    //tareas de carga
    poblarRegiones(); //cargamos las regiones en su select.
    cargarOfertas();   //cargamos las ofertas en su select.
    /* tareas de eventos */
    //eventos de rut
    $("#rut").on("input", function (e) {
        this.value = limpiarRut(e.target.value);
    });
    $("#rut").on("blur", function (e) {
        if (!validarRut(e.target.value)) {
            e.target.setCustomValidity("rut inválido");
            e.target.reportValidity();
        }
        else {
            e.target.setCustomValidity("");
        }
    });
    //eventos de formulario
    $("#formulario").on("submit", function (e) {
        e.preventDefault(); //evitamos el submit por defecto
        console.log("Procediendo a actuar");
        var cvFile = $("#curriculum")[0].files[0]; //obtenemos el archivo del input
        console.log(`tipo de archivo:
            *.${cvFile.type}`);
        const reader = new FileReader();
        reader.onload = async function (event) {
            const base64 = event.target.result.split(",")[1]; //obtenemos el base64 del archivo
            //obtenemos los datos del formulario
            var datos = {};
            $("#formulario").serializeArray().forEach(campo => {
                datos[campo.name] = campo.value;
            });
            datos.nombreArchivo = cvFile.name;
            datos.mimeType = cvFile.type;
            datos = JSON.stringify(datos);
            datos = datos.slice(0, -1) + `"base64": "${base64}"}`;
            try {
                const respuesta = await fetch('http://localhost:3001/', {
                    method: 'POST',
                    headers: {
                        'content-type': 'text/plain;charset=utf-8'
                    },
                    body: JSON.stringify(datos),
                });
                const texto = await respuesta.text();
                // alert(texto);
                console.log(texto);
            } catch (error) {
                console.error("Error al enviar los datos", error);
            }
        }
        reader.readAsDataURL(cvFile);
    });
});
//funcionesh

function poblarRegiones() {
    //poblamos regiones
    var selectRegiones = $("#region");
    for (region of regiones) {
        selectRegiones.append(`<option value="${region.region}"> ${region.region} </option>`);
    }

    //añadimos eventos para manejar las comunas
    var selectComunas = $("#comuna");
    selectRegiones.on("change", function (e) {
        let value = e.target.value;
        if (value == "") {
            selectComunas.attr("disabled", true);
            selectComunas.empty();
        }
        else {
            let regionSeleccionada = regiones.find(item => item.region === value);
            selectComunas.attr("disabled", false);
            selectComunas.empty();
            regionSeleccionada.comunas.forEach(comuna => {
                selectComunas.append(`<option value="${comuna}"> ${comuna} </option>`);
            });
        }
    });
}

function cargarOfertas() {
    //poblamos las ofertas
    var select = $("#oferta");
    $.ajax({
        url: `${macrourl}?action=listarOfertas`,
        method: "GET",
        type: JSON,
        success: /** @param {Array}<object> data*/
            function (data) {
                select.empty();
                data.forEach((val) => {
                    select.append(`<option value="${val['Código oferta']}"> ${val['Nombre del cargo']} </option>`);
                });
            },
        error: function (error) {
            console.error("Error al cargar ofertas.");
        }
    });
}
//funciones para validar rut
function limpiarRut(rut) {
    rut = rut.replace(/[^0-9Kk]/g, "").toUpperCase();
    let cuerpo = rut.slice(0, -1);
    let dv = rut.slice(-1);
    cuerpo = cuerpo.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${cuerpo}-${dv}`;
}

function validarRut(rutCompleto) {
    var [rut, dv] = rutCompleto.split("-");
    rut = rut.replace(/[.]+/g, "");
    rut = [...rut].reverse();
    var dvEsperado = 11 - rut.reduce((sum, val, i) => sum + val * (i % 6 + 2), 0) % 11;
    if (dvEsperado == 10)
        dv = "K";
    return dvEsperado == dv;
}

//envever datos json para regiones
var regiones = [
    {
        "region": "Arica y Parinacota",
        "comunas": ["Arica", "Camarones", "Putre", "General Lagos"]
    },
    {
        "region": "Tarapacá",
        "comunas": ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"]
    },
    {
        "region": "Antofagasta",
        "comunas": ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"]
    },
    {
        "region": "Atacama",
        "comunas": ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"]
    },
    {
        "region": "Coquimbo",
        "comunas": ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"]
    },
    {
        "region": "Valparaíso",
        "comunas": ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"]
    },
    {
        "region": "Región del Libertador Gral. Bernardo O’Higgins",
        "comunas": ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"]
    },
    {
        "region": "Región del Maule",
        "comunas": ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"]
    },
    {
        "region": "Región de Ñuble",
        "comunas": ["Cobquecura", "Coelemu", "Ninhue", "Portezuelo", "Quirihue", "Ránquil", "Treguaco", "Bulnes", "Chillán Viejo", "Chillán", "El Carmen", "Pemuco", "Pinto", "Quillón", "San Ignacio", "Yungay", "Coihueco", "Ñiquén", "San Carlos", "San Fabián", "San Nicolás"]
    },
    {
        "region": "Región del Biobío",
        "comunas": ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"]
    },
    {
        "region": "Región de la Araucanía",
        "comunas": ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"]
    },
    {
        "region": "Región de Los Ríos",
        "comunas": ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"]
    },
    {
        "region": "Región de Los Lagos",
        "comunas": ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"]
    },
    {
        "region": "Región Aisén del Gral. Carlos Ibáñez del Campo",
        "comunas": ["Coihaique", "Lago Verde", "Aisén", "Cisnes", "Guaitecas", "Cochrane", "O’Higgins", "Tortel", "Chile Chico", "Río Ibáñez"]
    },
    {
        "region": "Región de Magallanes y de la Antártica Chilena",
        "comunas": ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos (Ex Navarino)", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"]
    },
    {
        "region": "Región Metropolitana de Santiago",
        "comunas": ["Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "Santiago", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Tiltil", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"]
    }
]
. \ s c r i p p t s . j s  
 