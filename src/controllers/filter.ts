import { DataTable } from "../models/models.js";

export function filterData(
  arrayTable: DataTable,
  searchTerm: string
): DataTable {
  if (!searchTerm) return arrayTable;
  const lowerCaseTerm = searchTerm.toLocaleLowerCase(); //convertit todo a minuscula
  return arrayTable.filter((row) =>
    Object.values(row).some((cell) => {
      //cada fila se convierte en un objeto
      if (cell == null) return false; //manejo de errores
      return cell.toString().toLocaleLowerCase().includes(lowerCaseTerm);
    })
  );
}
