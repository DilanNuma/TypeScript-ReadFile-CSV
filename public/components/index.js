import { FileController } from "./models/fileController.js";
import { renderTable } from "./controllers/table.js";
import { filterData } from "./controllers/filter.js";
const csvForm = document.getElementById("csvForm");
const csvFile = document.getElementById("csvFile");
const displayArea = document.getElementById("displayArea");
const searchInput = document.getElementById("searchInput");
const recordsPerPage = 15;
let currentPage = 1;
let final_values = [];
let columnNames = [];
document.addEventListener("DOMContentLoaded", () => {
    csvForm.addEventListener('submit', (e) => {
        var _a;
        e.preventDefault(); // Esto previene el comportamiento por defecto del formulario
        console.log('click');
        let csvReader = new FileReader();
        const input = csvFile.files[0]; // ! asegura que no sea nulo
        if (input) {
            const fileName = input.name;
            const fileExtension = (_a = fileName.split(".").pop()) === null || _a === void 0 ? void 0 : _a.toLowerCase();
            if (fileExtension !== "csv") {
                alert("Solo se aceptan archivos .csv");
                return;
            }
            csvReader.onload = async function (evt) {
                var _a;
                const text = (_a = evt.target) === null || _a === void 0 ? void 0 : _a.result; // Asegúrate de que el resultado sea una cadena de texto
                if (!text) {
                    console.error("No se pudo leer el contenido del archivo.");
                    return;
                }
                const fileHandler = new FileController(text);
                final_values = fileHandler.getData();
                columnNames = fileHandler.getColumNames();
                // Agrega los logs aquí para depuración
                console.log("Datos procesados:", final_values);
                console.log("Nombres de columnas:", columnNames);
                await renderTableControls();
            };
            csvReader.readAsText(input);
        }
        else {
            alert("Por favor, seleccione un archivo .csv");
        }
    });
});
/* Búsqueda */
searchInput.addEventListener("input", async () => {
    await renderTableControls();
});
async function renderTableControls() {
    const searchTerm = searchInput.value;
    const filteredValues = filterData(final_values, searchTerm);
    console.log("Valores filtrados:", filteredValues);
    const tableHTML = await renderTable(filteredValues, currentPage, recordsPerPage);
    displayArea.innerHTML = tableHTML;
    const paginationControls = pagination(filteredValues.length, currentPage, recordsPerPage);
    document.getElementById("paginationControls").innerHTML = paginationControls;
    document.querySelectorAll(".page-link").forEach((button) => {
        button.addEventListener("click", async (e) => {
            const targetPage = Number(e.target.dataset.page);
            if (targetPage) {
                currentPage = targetPage;
                await renderTableControls();
            }
        });
    });
}
/*Pagination*/
function pagination(totalRecords, currentPage, recordsPerPage) {
    const totalPages = Math.ceil(totalRecords / recordsPerPage);
    const maxButtons = 10;
    let paginationHTML = '<ul class="pagination">';
    let startPage = Math.max(1, currentPage - Math.floor(maxButtons / 2));
    let finalPage = Math.min(totalPages, currentPage + Math.floor(maxButtons / 2));
    if (finalPage - startPage < maxButtons - 1) {
        if (startPage === 1) {
            finalPage = Math.min(totalPages, startPage + maxButtons - 1);
        }
        else if (finalPage === totalPages) {
            startPage = Math.max(1, finalPage - maxButtons + 1);
        }
    }
    if (currentPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="1" href="#">Start</a></li>`;
    }
    if (currentPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${currentPage - 1}" href="#">Previous</a></li>`;
    }
    for (let page = startPage; page <= finalPage; page++) {
        paginationHTML += `<li class="page-item ${page === currentPage ? "active" : ""}"><a class="page-link" data-page="${page}" href="#">${page}</a></li>`;
    }
    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${currentPage + 1}" href="#">Next</a></li>`;
    }
    if (currentPage < totalPages) {
        paginationHTML += `<li class="page-item"><a class="page-link" data-page="${totalPages}" href="#">End</a></li>`;
    }
    paginationHTML += "</ul>";
    return paginationHTML;
}
