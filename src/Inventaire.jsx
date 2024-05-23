/* eslint-disable react-hooks/rules-of-hooks */

import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { useQuery } from "react-query";
import { getProdits } from "./services/produitsservice";
import { Badge, Button, NumberFormatter } from "@mantine/core";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {image} from "./composants/image";


function inventaire() {
  const key = 'get_Produits';
  const {data: Produits,isLoading} = useQuery(key,() => getProdits());
  const footer = `NOUS AVONS REPERTORIE ${Produits ? Produits.length : 0} TYPES DE MATIERES.`;
  const renderHeader = () => {
   
};
const ITemplate = (row) =>  <Badge
size="xl"
variant="gradient"
gradient={{ from: 'red', to: 'red', deg: 50 }}
>
{row.quantite}
</Badge>
  const Ntemplate = (row) => <NumberFormatter  thousandSeparator 
  value={row.prixUnitaire}/>
const header = renderHeader();


const generer = () =>{
  var dd = {
    content: [
      {
        image,
        width:100,
        height:90,
        alignment: 'center'
        
    },
    {text: 'CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR (CROUS/Z)', fontSize: 14, bold: false, alignment:'center'},
    {text: '-----------------------------------------------\n\n', fontSize: 10, bold: false, alignment:'center'},
    {text: 'ETAT DE DISPONIBLITE DES MATIERES DANS LE STOCK\n\n', fontSize: 17, bold: true,color:'blue', alignment:'center'},
    {
      style: 'tableExample',
      bold:true,
     fillColor:'#d4d4d8',
      table: {
        widths: [200, 100, 100,100],
          body: [
              [{ text:'MATIERES',style: 'tableHeader'}, 'QUANTITE', 'PRIX UNITAIRE','MONTANT'],
               // eslint-disable-next-line no-unsafe-optional-chaining
               ...Produits.map(m =>{ 
                  return  [m.catalogue, m.quantite, m.prixUnitaire,m.quantite*m.prixUnitaire];
              })
          ]
      }
  },
  {
    style: 'tableExample',
    bold:true,
   fillColor:'#d4d4d8',
    table: {
      widths: [200, 100, 100,100],
        body: [
            [{ text:'TOTAL',style: 'tableHeader'}, '', '','MONTANT'],
             // eslint-disable-next-line no-unsafe-optional-chaining
             
        ]
    }
},
  {text:  `\n\n${Produits?.length} MATIERES SONT DISPONIBLE DANS NOTRE STOCK`,color:'red', fontSize: 12, bold: true, alignment:'justify'},
    ]
  }
  pdfMake.createPdf(dd).download();
}
  return (
    <>
    
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
    <h1 className='font-bold text-3xl text-center mt-6'>ETATS DE DISPONIBLITES DES MATIERES DANS LE STOCK</h1>
    </div>
    <div className="mx-10">
    <div className="text-center  mt-4">
    <Button className='w-45 h-12 font-bold' bg='green' onClick={() => generer()} >GENERER  L ETAT</Button>
    </div>
    </div>
   
    <div className="card mt-6">
    <div style={{ backgroundColor: 'var(--highlight-bg)', color: 'var(--highlight-text-color)', borderRadius: 'var(--border-radius)', padding: '1rem' }}>
  <DataTable  header={header}  footer={footer} value={Produits} tableStyle={{ minWidth: '30rem' }} loading={isLoading}  paginator rows={8} rowsPerPageOptions={[6, 16, 26, 51]} size="small" stripedRows>
               
               <Column field="catalogue" header="MATIERE"></Column>
               <Column field="quantite" header="QUANTITE"body={ITemplate} ></Column>
               <Column field="prixUnitaire" header="PRIX UNITAIRE" body={Ntemplate}></Column>
               <Column field="emplacement" header="EMPLACEMENT"  ></Column>    
  </DataTable> 
  </div>
 </div>
    </>
  )
}

export default inventaire