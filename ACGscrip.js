window.onload =

    function cargarForm() {
        cargarPaises();
        cargarGeneros();
        cargarAnyos();

    }

    function cargarPaises() {
        const paisesSelect = document.getElementById("paises");
    
        paisesSelect.innerHTML = "<option value='allCountries'>Todos los países</option>";
    
        countries.sort().forEach(pais => {
            let paisOption = document.createElement("option");
            paisOption.textContent = pais;
            paisOption.value = pais;
            paisesSelect.appendChild(paisOption);
        });
    }
    
    function cargarGeneros() {
        const generosDiv = document.getElementById("genders");
    
        generosDiv.innerHTML = "";
    
        let allCheckbox = document.createElement("input");
        let allLabel = document.createElement("label");
        allCheckbox.type = "checkbox";
        allCheckbox.id = "all";
        allCheckbox.name = "genres";
        allCheckbox.checked = true;
        allCheckbox.addEventListener("change", () => {
            const checkboxes = document.querySelectorAll("input[name='genres']:not(#all)");
            checkboxes.forEach(checkbox => checkbox.checked = allCheckbox.checked);
        });
        allLabel.textContent = "Todos los géneros";
    
        generosDiv.appendChild(allCheckbox);
        generosDiv.appendChild(allLabel);
    
        genders.sort().forEach(genero => {
            let genderInput = document.createElement("input");
            let genderLabel = document.createElement("label");
            genderInput.type = "checkbox";
            genderInput.id = genero.toLowerCase();
            genderInput.name = "genres";
            genderInput.value = genero;
            genderInput.addEventListener("change", () => {
                if (genderInput.checked) {
                    document.getElementById("all").checked = false;
                } else {
                    const checkboxes = document.querySelectorAll("input[name='genres']:not(#all)");
                    const allUnchecked = Array.from(checkboxes).every(checkbox => !checkbox.checked);
                    if (allUnchecked) {
                        document.getElementById("all").checked = true;
                    }
                }
            });
            genderLabel.textContent = genero;
    
            generosDiv.appendChild(genderInput);
            generosDiv.appendChild(genderLabel);
        });
    }

    function cargarAnyos() {
        const anyoDiv = document.getElementById("years");
    
        const parrafoDesde = document.createElement("p");
        const selectDesde = document.createElement("select");
        selectDesde.id = "dateFrom";
        parrafoDesde.textContent = "Year: from ";
    
        const parrafoHasta = document.createElement("p");
        const selectHasta = document.createElement("select");
        selectHasta.id = "dateTo";
        parrafoHasta.textContent = " to ";
    
        const yearActual = new Date().getFullYear();
    
        for (let index = 2000; index <= yearActual; index++) {
            const optionYear = document.createElement("option");
            optionYear.textContent = index;
            optionYear.value = index;
            selectDesde.appendChild(optionYear);
    
            const optionYearClone = optionYear.cloneNode(true);
            selectHasta.appendChild(optionYearClone);
        }
    
        parrafoDesde.appendChild(selectDesde);
        anyoDiv.appendChild(parrafoDesde);
    
        parrafoHasta.appendChild(selectHasta);
        anyoDiv.appendChild(parrafoHasta);
    }

function filtrarPelis(event) {
    event.preventDefault();
    const text = document.getElementById("text").value.toLowerCase();
    const titleChecked = document.getElementById("title").checked;
    const directorChecked = document.getElementById("director").checked;
    const actorsChecked = document.getElementById("actors").checked;
    const selectedCountry = document.getElementById("paises").value;
    const allGenresChecked = document.getElementById("all").checked;
    const genreCheckboxes = Array.from(document.querySelectorAll("input[name='genres']:checked"));
    const selectedGenres = genreCheckboxes.map(checkbox => checkbox.value);
    const dateFrom = document.getElementById("dateFrom").value;
    const dateTo = document.getElementById("dateTo").value;
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = '';

    let pelisFiltradas = pelis;

    if (text) {
        pelisFiltradas = pelisFiltradas.filter(peli => {
            return (
                (titleChecked && peli.Title.toLowerCase().includes(text)) ||
                (directorChecked && peli.Director.toLowerCase().includes(text)) ||
                (actorsChecked && peli.Actors.toLowerCase().includes(text))
            );
        });
    }

    if (selectedCountry !== "allCountries") {
        pelisFiltradas = pelisFiltradas.filter(peli => peli.Country.includes(selectedCountry));
    }

    if (!allGenresChecked && selectedGenres.length > 0) {
        pelisFiltradas = pelisFiltradas.filter(peli => 
            selectedGenres.every(genre => peli.Genre.includes(genre))
        );
    }

    if (dateFrom) {
        const fromDate = new Date(dateFrom);
        pelisFiltradas = pelisFiltradas.filter(peli => new Date(peli.Released) >= fromDate);
    }
    if (dateTo) {
        const toDate = new Date(dateTo);
        pelisFiltradas = pelisFiltradas.filter(peli => new Date(peli.Released) <= toDate);
    }

    if (pelisFiltradas.length === 0) {
        resultadosDiv.innerHTML = "<p>No se encontraron películas.</p>";
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
