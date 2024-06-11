import { Button, Table } from "@mantine/core"
import { useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { getAttribution } from "./services/attributionservice";
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "./vfs_fonts";
pdfMake.vfs = font
import {image} from "./composants/image";
import {photo} from "./composants/photo";
import { format } from 'date-fns';




function Attri() {
    const {id} = useParams();
    const key = ['get_attribution',id];
    const {data} = useQuery(key,() => getAttribution(id))

    const formatNumber = (n) => String(n).replace(/(.)(?=(\d{3})+$)/g,'$1 ')

    const generer = () => {
      var dd = {
        pageOrientation:'landscape',
        content: [
          {
            columns: [
            {
              stack: [
                {text: 'REPUBLIQUE DU SENEGAL ', fontSize: 11, bold: true, alignment:'center'},
                {text: 'Un Peuple - Un But - Une Foi', fontSize: 10, bold: false, alignment:'center'},
                {text: '------------', fontSize: 10, bold: false, alignment:'center'},
                {
                  image:photo,
                  width:70,
                  height:30,
                  alignment: 'center'
                 
                },
                {text: 'MINISTERE DE L ENSEIGNEMENT SUPERIEUR, DE LA RECHERCHE ET DE L INNOVATION', fontSize: 8, bold: false, alignment:'center'},
                {text: '--------------', fontSize: 10, bold: false, alignment:'center'},
                {text: 'CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR (CROUS/Z)', fontSize: 8, bold: false, alignment:'center'},
                {
                  image,
                  width:70,
                  height:50,
                  alignment: 'center'
                  },
              ]
            },
            {
              text: ''
            },
            {
              text: [
                {text: '\nMODEL N 2\n', fontSize: 12, bold: true, alignment:'center'},
                {text: '\nInstruction générale\n', fontSize: 12, bold: true, alignment:'center'},
                {text: 'Art. 12 a. 12 c. 19 a.\n', fontSize: 12, bold:true, alignment:'center'},
                {text: '\nAnnée budgétaire 2024\n', fontSize: 12, bold: true, alignment:'center'},  
              ]
            }
            
            ]
          },
          {
            style: 'tableExample',
            fillColor:'#22c55e',
            margin: [20, 10],
            table: {
              widths: ['*'],
              body: [
                [{text:  `BON DE SORTIE ${data?.sortis} DE L'EXISTANT N° ${data?.num_bon}`,color:'white', fontSize: 25, bold: true, alignment:'center'},],
              ]
            }
          },
          
           {/*  {
                    style: 'tableExample',
                    table: {
                        body: [
                            ['PRENOM', 'NOM', 'FONCTION','SIGNATURE'],
                             // eslint-disable-next-line no-unsafe-optional-chaining
                             ...data?.commission.membres.map(m =>{ 
                                return  [m.prenom, m.nom, m.fonction,''];
                            })
                        ]
                    }
                }, */},
          {
            style: 'tableExample',
            color: '#444',
            alignment:'center',
            bold:true,
            table: {
              widths: [100,150, 90, 120,130,100],
              
              // keepWithHeaderRows: 1,
              body: [
                [{text: 'N° Compte Nomenclature', style: 'tableHeader', alignment: 'center', bold:true},{text: 'DESIGNATION DES MATIERES', style: 'tableHeader', alignment: 'center', bold:true}, {text: 'QUANTITE', bold:true, style: 'tableHeader', alignment: 'center'},{text: 'PRIX UNITAIRE', style: 'tableHeader', alignment: 'center', bold:true},{text: 'MONTANT',rowSpan: 1, style: 'tableHeader', alignment: 'center', bold:true},{text: 'OBSERVATION', style: 'tableHeader', alignment: 'center', bold:true}],
                // eslint-disable-next-line no-unsafe-optional-chaining
                ...data?.produits.map(m=>{
                  return['',m.produit.catalogue,`${m.qte}`,formatNumber(m.produit.prixUnitaire),`${formatNumber(m.produit.prixUnitaire*m.qte)}`,m.produit.observation];
                }) ,
                [{text:'' ,color:'blue', bold:true,fontSize: 16},{text:'TOTAUX' ,color:'blue', bold:true,fontSize: 16},`${data?.produits?.reduce((acc,val) => acc + val.qte ,0)}`,'',`${formatNumber(data?.produits?.reduce((acc,val) => acc + ( parseInt(val.produit.prixUnitaire,10) * val.qte) ,0))}`,'']       
              ]              
            }
          },
         
          {
            style: 'tableExample',
            color: '#444',
            table: {
              widths: [190, 190, 150,180],
              
              // keepWithHeaderRows: 1,
              body: [
                [{text: `RECEPISSE\nJe soussigné (M ou Mme) ${data?.remis} de ${data?.section} reconnais avoir reçu les matières portées au présent bon.\n\n A Ziguinchor, le ${format(data?.date,'dd/MM/yyyy')} \n\n\n Le Réceptionnaire(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)}) `, style: 'tableHeader', alignment: 'center', bold:true},
                 {text: `DECLARATION D’ENGAGEMENT\nLa comptable des matières soussigné s’engage à faire diligence pour réintégrer les matières portées au présent bon dans l’enceinte du service.\n\nA Ziguinchor, le ${format(data?.date,'dd/MM/yyyy')}\n\nLe comptable des matières(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)})`, bold:true, style: 'tableHeader', alignment: 'center'},
                 {text: `CERTIFICATION\nArrêté le présent bon à.(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)})..Unités
                 Représentant une valeur de ${formatNumber(data?.produits?.reduce((acc,val) => acc + ( parseInt(val.produit.prixUnitaire,10) * val.qte) ,0))}  FCFA \n\nDont je certifie la sortie ${data?.sortis}.\n\nA Ziguinchor, le ${format(data?.date,'dd/MM/yyyy')}\n\nL’Administrateur des matières(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)})`,fontSize: 11, style: 'tableHeader', alignment: 'center', bold:true},
                 {text: `(1)Numérotation interrompu pour la gestion.\n(2) Dans l’ordre des articles décrits sur les pièces justificatives ou dans l’ordre des comptes de la nomenclature.\n(3) Litre, Kg, Mètre, Nbre, ect.\n(4) Nom et qualité.\n(5) Timbre et signature bon à établir en trois exemplaires.\n(6) A justifier éventuellement….`,rowSpan: 1,fontSize: 11, style: 'tableHeader', alignment: 'justify', bold:true}],
                // eslint-disable-next-line no-unsafe-optional-chaining
                       
              ]
              
            }
          },
        ]
      }
      pdfMake.createPdf(dd).open();
    }
    const generer1 = () => {
      var dd = {
        pageOrientation:'landscape',
        content: [
          {
            columns: [
            {
              stack: [
                {text: 'REPUBLIQUE DU SENEGAL ', fontSize: 11, bold: true, alignment:'center'},
                {text: 'Un Peuple - Un But - Une Foi', fontSize: 10, bold: false, alignment:'center'},
                {text: '------------', fontSize: 10, bold: false, alignment:'center'},
                {
                  image:photo,
                  width:70,
                  height:30,
                  alignment: 'center'
                 
                },
                {text: 'MINISTERE DE L ENSEIGNEMENT SUPERIEUR, DE LA RECHERCHE ET DE L INNOVATION', fontSize: 8, bold: false, alignment:'center'},
                {text: '--------------', fontSize: 10, bold: false, alignment:'center'},
                {text: 'CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR (CROUS/Z)', fontSize: 8, bold: false, alignment:'center'},
                {
                  image,
                  width:70,
                  height:50,
                  alignment: 'center'
                  },
              ]
            },
            {
              text: ''
            },
            {
              text: [
                {text: '\nMODEL N 2\n', fontSize: 12, bold: true, alignment:'center'},
                {text: '\nInstruction générale\n', fontSize: 12, bold: true, alignment:'center'},
                {text: 'Art. 12 a. 12 c. 19 a.\n', fontSize: 12, bold:true, alignment:'center'},
                {text: '\nAnnée budgétaire 2024\n', fontSize: 12, bold: true, alignment:'center'},  
              ]
            }
            
            ]
          },
          {
            style: 'tableExample',
            fillColor:'#22c55e',
            margin: [20, 10],
            table: {
              widths: ['*'],
              body: [
                [{text:  `BON DE SORTIE ${data?.sortis} DE L'EXISTANT N° ${data?.num_bon}`,color:'white', fontSize: 25, bold: true, alignment:'center'},],
              ]
            }
          },
          
           {/*  {
                    style: 'tableExample',
                    table: {
                        body: [
                            ['PRENOM', 'NOM', 'FONCTION','SIGNATURE'],
                             // eslint-disable-next-line no-unsafe-optional-chaining
                             ...data?.commission.membres.map(m =>{ 
                                return  [m.prenom, m.nom, m.fonction,''];
                            })
                        ]
                    }
                }, */},
          {
            style: 'tableExample',
            color: '#444',
            alignment:'center',
            bold:true,
            table: {
              widths: [100,150, 90, 120,130,100],
              
              // keepWithHeaderRows: 1,
              body: [
                [{text: 'N° Compte Nomenclature', style: 'tableHeader', alignment: 'center', bold:true},{text: 'DESIGNATION DES MATIERES', style: 'tableHeader', alignment: 'center', bold:true}, {text: 'QUANTITE', bold:true, style: 'tableHeader', alignment: 'center'},{text: 'PRIX UNITAIRE', style: 'tableHeader', alignment: 'center', bold:true},{text: 'MONTANT',rowSpan: 1, style: 'tableHeader', alignment: 'center', bold:true},{text: 'OBSERVATION', style: 'tableHeader', alignment: 'center', bold:true}],
                // eslint-disable-next-line no-unsafe-optional-chaining
                ...data?.produits.map(m=>{
                  return['',m.produit.catalogue,`${m.qte}`,formatNumber(m.produit.prixUnitaire),`${formatNumber(m.produit.prixUnitaire*m.qte)}`,m.produit.observation];
                }) ,
                [{text:'' ,color:'blue', bold:true,fontSize: 16},{text:'TOTAUX' ,color:'blue', bold:true,fontSize: 16},`${data?.produits?.reduce((acc,val) => acc + val.qte ,0)}`,'',`${formatNumber(data?.produits?.reduce((acc,val) => acc + ( parseInt(val.produit.prixUnitaire,10) * val.qte) ,0))}`,'']       
              ]              
            }
          },
         
          {
            style: 'tableExample',
            color: '#444',
            table: {
              widths: [190, 190, 150,180],
              
              // keepWithHeaderRows: 1,
              body: [
                [{text: `RECEPISSE\nJe soussigné (M ou Mme) ${data?.remis}, ${data?.section} reconnais avoir reçu les matières portées au présent bon.\n\n A Ziguinchor, le ${format(data?.date,'dd/MM/yyyy')} \n\n\n Le Réceptionnaire(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)}) `, style: 'tableHeader', alignment: 'center', bold:true},
                 {text: `DECLARATION D’ENGAGEMENT\nLe comptable des matières soussigné déclare ce jour, diminuer ses prises en charge de (${data?.produits?.reduce((acc,val) => acc + val.qte ,0)})..Unités Représentant une valeur de \n ${formatNumber(data?.produits?.reduce((acc,val) => acc + ( parseInt(val.produit.prixUnitaire,10) * val.qte) ,0))}  FCFA .\n\nA Ziguinchor, le ${format(data?.date,'dd/MM/yyyy')}\n\nLe comptable des matières(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)})`, bold:true, style: 'tableHeader', alignment: 'center'},
                 {text: `CERTIFICATION\nArrêté le présent bon à.(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)})..Unités
                 Représentant une valeur de ${formatNumber(data?.produits?.reduce((acc,val) => acc + ( parseInt(val.produit.prixUnitaire,10) * val.qte) ,0))}  FCFA \n\nDont je certifie la sortie ${data?.sortis}.\n\nA Ziguinchor, le ${format(data?.date,'dd/MM/yyyy')}\n\nL’Administrateur des matières(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)})`,fontSize: 11, style: 'tableHeader', alignment: 'center', bold:true},
                 {text: `(1)Numérotation interrompu pour la gestion.\n(2) Dans l’ordre des articles décrits sur les pièces justificatives ou dans l’ordre des comptes de la nomenclature.\n(3) Litre, Kg, Mètre, Nbre, ect.\n(4) Nom et qualité.\n(5) Timbre et signature bon à établir en trois exemplaires.\n(6) A justifier éventuellement….`,rowSpan: 1,fontSize: 11, style: 'tableHeader', alignment: 'justify', bold:true}],
                // eslint-disable-next-line no-unsafe-optional-chaining
                       
              ]
              
            }
          },
        ]
      }
      pdfMake.createPdf(dd).open();
    }
    

    const rows = data?.produits.map((element) => (
        <Table.Tr key={element.produit._id}>
          <Table.Td>{element.produit.catalogue}</Table.Td>
          <Table.Td>{element?.qte}</Table.Td>
          <Table.Td>{element.produit.prixUnitaire}</Table.Td>
          <Table.Td>{(element.produit.prixUnitaire)*(element?.qte)}</Table.Td>
          <Table.Td>{element.produit.observation}</Table.Td>
        </Table.Tr>
      ));

  return (
    <div className="mx-10">
    {data && data.est_valide && <div className="flex items-center justify-between px-20 mt-4 ">
    <Button className='w-45 h-12 font-bold' bg='green'  onClick={() => generer()}>BON DE SORTIE PROVISOIRE</Button>
    <Button className='w-45 h-12 font-bold' bg='blue'  onClick={() => generer1()}>BON DE SORTIE DEFINITIVE</Button>    
    </div>}
    <div className="my-5 text-2xl font-semibold text-center  mt-4  bg-red-300">
       ZIGUINCHOR : {data?.date}
    </div>
    <div className="my-5 text-2xl font-semibold   mt-4  bg-green-300">
       BENEFICIAIRE  : {data?.remis}
    </div>
    <div className="my-5 text-2xl font-semibold  mt-4  bg-blue-300">
       ATTRIBUTION  : {data?.sortis}
    </div>
    <div className="my-5 text-2xl font-semibold   mt-4  bg-yellow-300">
       NUMERO BON D APPROVISIONNEMENT : {data?.bon}
    </div>
   
    <div className="my-5 text-2xl font-semibold   mt-4  bg-red-300">
       SECTION  : {data?.section}
    </div>
   
    <Table className="text-2xl position:6">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>MATIERE</Table.Th>
          <Table.Th>QUANTITE</Table.Th>
          <Table.Th>PRIX UNITAIRE</Table.Th>
          <Table.Th>MONTANT</Table.Th>
          <Table.Th>OBSERVATION</Table.Th>
        
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
    </div>
    

  )
}

export default Attri