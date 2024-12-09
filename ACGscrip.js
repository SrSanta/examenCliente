//cargar las cosas del formulario
window.onload =

    function cargarForm() {
        cargarPaises();
        cargarGeneros();
        cargarAnyos();

    }

function cargarPaises() {
    const paisesSelect = document.getElementById("paises");

    countries.forEach(pais => {
        let paisOption = document.createElement("option");
        paisOption.textContent = pais;
        paisesSelect.appendChild(paisOption);
    });
};

function cargarGeneros() {
    const generosDiv = document.getElementById("genders");

    genders.sort().forEach(genero => {
        let genderInput = document.createElement("input");
        let genderLabel = document.createElement("label");
        genderInput.type = "checkbox";
        genderInput.id = `${genero.toLowerCase()}`;
        genderInput.name = "genero";
        genderLabel.textContent = `${genero.toLowerCase()}`;
        generosDiv.appendChild(genderInput);
        generosDiv.appendChild(genderLabel);
    });
}

function cargarAnyos() {
    const anyoDiv = document.getElementById("years");

    const parrafoDesde = document.createElement("p");
    const selectDesde = document.createElement("select");
    parrafoDesde.textContent = "Year: from ";

    const parrafoHasta = document.createElement("p");
    const selectHasta = document.createElement("select");
    parrafoHasta.textContent = " to ";

    const yearActual = new Date().getFullYear();

    for (let index = 2000; index <= yearActual; index++) {
        const optionYear = document.createElement("option");
        optionYear.textContent = index;
        optionYear.value = index;
        selectDesde.appendChild(optionYear);

        const optionYearClone = optionYear.cloneNode(true);
        selectHasta.appendChild(optionYearClone);
    };

    parrafoDesde.appendChild(selectDesde);
    anyoDiv.appendChild(parrafoDesde);

    parrafoHasta.appendChild(selectHasta);
    anyoDiv.appendChild(parrafoHasta);
};

//empezamos a filtras cosas de el formulario
function filtrarPelis(event) {
    event.preventDefault();
    const text = document.getElementById("text").value.toLowerCase();
    const titleChecked = document.getElementById("title").checked;
    const directorChecked = document.getElementById("director").checked;
    const actorsChecked = document.getElementById("actors").checked;
    const selectedCountry = document.getElementById("paises").value;
    const allGenresChecked = document.getElementById("all").checked;
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = '';

    let pelisFiltradas = pelis;

    if (text) {
        if (titleChecked) {
            pelisFiltradas = pelisFiltradas.filter(peli => peli.Title.toLowerCase().includes(text));
        }
        if (directorChecked) {
            pelisFiltradas = pelisFiltradas.filter(peli => peli.Director.toLowerCase().includes(text));
        }
        if (actorsChecked) {
            pelisFiltradas = pelisFiltradas.filter(peli => peli.Actors.toLowerCase().includes(text));
        }
    }else{
        pelisFiltradas = pelisFiltradas.filter(peli => {
            return (titleChecked || peli.Title.toLowerCase().includes(text)) || 
                   (directorChecked || peli.Director.toLowerCase().includes(text)) || 
                   (actorsChecked || peli.Actors.toLowerCase().includes(text));
        });
    }

    if (selectedCountry !== "allCountries") {
        pelisFiltradas = pelisFiltradas.filter(peli => peli.Country.some(country => selectedCountry.includes(country)));
    }

    if (allGenresChecked) {
        pelisFiltradas = pelisFiltradas;
    }else{
        //me faltan los generos concretos
    }

    //falta lo de la fecha

    if (pelisFiltradas.length === 0) {
        resultadosDiv.innerHTML = "No se encontraron películas.";
    } else {
        cargarPelis(pelisFiltradas);
    }
}



//cosas de las peliculas
//resultado de la busqueda

function cargarPelis(pelisFiltradas) {
    const resultadosDiv = document.getElementById("resultados");

    pelisFiltradas.forEach(peli => {
        let divPeli = document.createElement("div");
        divPeli.id = `div${peli.Title}`;
        let titulo = document.createElement("p");
        let images = document.createElement("img");
        let boton = document.createElement("button");
        let generos = document.createElement("p");
        let divDetalles = document.createElement("div");

        titulo.textContent = peli.Title;
        images.src = peli.Images[0];
        images.width = 300;
        images.height = 200;
        boton.id = `details${peli.Title}`;
        boton.textContent = "Details";
        generos.textContent = peli.Genre;
        divDetalles.id = `detalles${peli.Title}`;

        boton.addEventListener("click", function () {
            divPeli.style.backgroundColor = "rgba(173, 255, 228, 0.753)";
            divDetalles.innerHTML = ``;
            cargarDetalles(peli);
            boton.disabled = true;
        });

        divPeli.appendChild(titulo);
        divPeli.appendChild(images);
        divPeli.appendChild(boton);
        divPeli.appendChild(generos);
        divPeli.appendChild(divDetalles);
        resultadosDiv.appendChild(divPeli);
    });
};

function cargarDetalles(peli) {
    const detallesDiv = document.getElementById(`detalles${peli.Title}`);

    detallesDiv.innerHTML = "";

    let botonCerrar = document.createElement("button");
    botonCerrar.textContent = "x";
    botonCerrar.id = `cerrar${peli.Title}`;
    botonCerrar.addEventListener("click", function () {
        document.getElementById(`div${peli.Title}`).style.backgroundColor = "";
        document.getElementById(`details${peli.Title}`).disabled = false;
        detallesDiv.innerHTML = "";
    });

    let parrafo = document.createElement("h6");
    parrafo.textContent = "IMDb Rating";

    let notaCambio = document.createElement("input");
    notaCambio.type = "number";
    notaCambio.min = 0;
    notaCambio.max = 10;
    notaCambio.value = peli.imdbRating || "";
    notaCambio.id = `imdbInput${peli.Title}`;

    let botonActualizar = document.createElement("button");
    botonActualizar.textContent = "Update";
    botonActualizar.id = `update${peli.Title}`;
    botonActualizar.addEventListener("click", () => {
        const nuevoRating = notaCambio.value;
        peli.imdbRating = nuevoRating;
        cargarDetalles(peli);
    });

    let fichaPeli = document.createElement("pre");
    fichaPeli.textContent = JSON.stringify(peli, null, 2);

    detallesDiv.appendChild(botonCerrar);
    detallesDiv.appendChild(parrafo);
    detallesDiv.appendChild(notaCambio);
    detallesDiv.appendChild(botonActualizar);
    detallesDiv.appendChild(fichaPeli);

    const botonDetalles = document.getElementById(`details${peli.Title}`);
    botonDetalles.disabled = true;
}
