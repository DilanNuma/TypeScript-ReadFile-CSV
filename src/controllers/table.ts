import { DataTable} from "../models/models.js";

export async function renderTable(arrayTable: DataTable,currentPage:number,recordsPerPage:number):Promise<string>{
    const startIndex = (currentPage-1)*recordsPerPage;
    const endIndex = startIndex + recordsPerPage;
    const paginatedData = arrayTable.slice(startIndex,endIndex)//Cada vez que se pagina muestra desde un punto inicial hasta uno final

    /*Column names from the first row*/
    const columnNames = arrayTable.length > 0 ? Object.keys(arrayTable[0]) : []

    return `
    <table class="table table-striped">
        <thead>
            ${columnNames.map(value =>`
                <th scope="col">${value}</th>
            `).join('')}
        </thead>
        <tbody>
            ${paginatedData.map(row =>`
                <tr>
                    ${columnNames.map(columnName =>`
                        <td>${row[columnName] || ''}</td>
                    `).join('')}
                </tr>
            `).join('')}
        </tbody>
    </table>
`

    
}


