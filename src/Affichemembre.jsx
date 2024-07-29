import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getCommission } from "./services/commissionservice";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
function Affichemembre() {
    const {id} = useParams();
    const key =  ['get_commission',id];
    const {data} = useQuery(key,() => getCommission(id))
  return (
    <DataTable value={data} tableStyle={{ minWidth: '50rem' }}  paginator rows={6} rowsPerPageOptions={[6, 16, 26, 51]} size="small" stripedRows>
                <Column field="prenom" header="PRENOM"></Column>
                <Column  field="nom" header="NOM"></Column>            
    </DataTable>
  )
}

export default Affichemembre