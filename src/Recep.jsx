import { useQuery } from "react-query";
import { useParams } from "react-router-dom"
import { getReception } from "./services/receptionservice";
import { Button, Table } from "@mantine/core";
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "./vfs_fonts";
pdfMake.vfs = font
import {image} from "./composants/image";
import {photo} from "./composants/photo";
import { format } from 'date-fns';



function Recep() {
    const {id} = useParams();
    const key = ['get_reception',id];
    const {data} = useQuery(key,() => getReception(id));
  


    const getTTC = (data) => {
      return data?.produits?.reduce((acc,val) => acc + (val.produit.prixUnitaire * val.qte) ,0)
    }

    const getTVA = (data) => {
      return getTTC(data) * 0.18;
    }

    const getHT = (data) => {
      return getTTC(data) + getTVA(data);
    }

const formatNumber = (n) => String(n).replace(/(.)(?=(\d{3})+$)/g,'$1 ')
    
    const generer = () => {
      
        var dd = {
          pageOrientation:'landscape',
            content: [
              {
                columns: [
                  {   
                    
                    stack: [                        
                        {text: 'REPUBLIQUE DU SENEGAL ', fontSize: 13, bold: true, alignment:'center'},
                        {text: 'Un Peuple - Un But - Une Foi', fontSize: 12, bold: false, alignment:'center'},
                        {text: '------------', fontSize: 12, bold: false, alignment:'center'},   
              {
                image:photo,
                width:60,
                height:30,
                alignment: 'center',
                
               
              },
              {text: '\nMINISTERE DE L ENSEIGNEMENT SUPERIEUR, DE LA RECHERCHE ET DE L INNOVATION', fontSize: 10, bold: false, alignment:'center'},
              {text: '--------------', fontSize: 12, bold: false, alignment:'center'},
              {text: 'CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR (CROUS/Z)', fontSize: 10, bold: false, alignment:'center'},
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
                        
                      {text: 'Art, 2b, 7b, 7c, 19b\n', fontSize: 12, bold:true, alignment:'center'},
                      {text: '\nModèle 3\n', fontSize: 12, bold: true, alignment:'center'},
                      {text: `\n\n\nDate: ${format(data?.date,'dd/MM/yyyy')}`, fontSize: 12, bold: true, alignment:'center'},
                      
                      
                    ]
                  }
                ]
              },
                {
                  style: 'tableExample',
                  fillColor:'#c026d3',
                  margin: [20, 10],
                  table: {
                    widths: ['*'],
                    body: [
                      [{text: `PROCES-VERBAL DE RECEPTION N°: ${data?.n_bon}`,color:'white', fontSize: 20, bold: true, alignment:'center'}],
                    ]
                  }
                },
                
                {
                
              },
                
                {
                    text: `TYPE: ${data?.type}`,
                    style: 'subheader'
                },

                {
            
                  columns: [
                    {
                     
                      text: [
                        
                        {text: `\nArrêté le présent PV a .(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)})..unité que avons réceptionnées\n\n`, fontSize: 12, bold: false, alignment:'justify'},
                        {text: `Ziguinchor, ${format(data?.date,'dd/MM/yyyy')}`, fontSize: 12, bold: true, alignment:'center'},
                        {text: '\n\nNoms et qualites du fournisseur:', fontSize: 12, bold: false, alignment:'justify'},
                        {text: `\n\n${data?.fournisseur}\n`, fontSize: 14, bold: true, alignment:'justify'},
                        {text: '\n\nNoms, qualites et signatures des membres de la commission:', fontSize: 12, bold: false, alignment:'justify'},
                       
                      ]

                    },

                    {
                     
                      text: [
                        
                        {text: `\nACHAT DE ${data?.produits[0]?.produit.cat.categorie}`,color:'blue', fontSize: 13, bold: true, alignment:'center'},
                        {text: '\nEnumération des pièces justificatives jointes\n', fontSize: 12, bold: false, alignment:'justify'},
                        {text: '\n	Facture définitive', fontSize: 13, bold: true, alignment:'justify'},
                        {text: '\n	Bordereau de livraison', fontSize: 13, bold: true, alignment:'justify'},
                        {text: '\n	Facture Pro forma\n', fontSize: 13, bold: true, alignment:'justify'},
                        {text: `\nFacture N°: ${data?.numero_bon} du ${format(data?.date,'dd/MM/yyyy')}`,color:'red', fontSize: 12, bold: true, alignment:'justify'},
                        {text: `\n\nMONTANT: ${formatNumber(getHT(data))} FCFA\n\n`, fontSize: 16, bold: true, alignment:'center'} 
                        
                      ]
                    }
                  ]
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
                  columns: [
                    {
                      
                      text: [
                        
                        {text: 'M.Ansoumana DIEDHIOU\n', fontSize: 12, bold:true, alignment:'center'},
                        {text: '................\n', fontSize: 12, bold: true, alignment:'center'},
                        {text: 'Membre', fontSize: 12, bold: true, alignment:'center'},
                        
                        
                      ]
                    },
                    {
                      text: [
                        
                        {text: 'M.Mamadou KONTE\n', fontSize: 12, bold:true, alignment:'center'},
                        {text: '................\n', fontSize: 12, bold: true, alignment:'center'},
                        {text: 'President\n', fontSize: 12, bold: true, alignment:'center'},
                        
                        
                      ]
                    },
                    {
                      text: [
                        
                        {text: 'M.Ibrahima DIAVE\n', fontSize: 12, bold:true, alignment:'center'},
                        {text: '................\n', fontSize: 12, bold: true, alignment:'center'},
                        {text: 'Membre\n', fontSize: 12, bold: true, alignment:'center'},   
                      ]
                    }
                  ]
                },
                {
                  style: 'tableExample',
                  margin: [15, 10],
                  fillColor:'#c026d3',
                  table: {
                    widths: ['*'],
                    body: [
                      [{text: 'PROCES-VERBAL DE RECEPTION', fontSize: 20, bold: true, alignment:'center',color:'white'}],
                    ]
                  }
                },
               {
                style: 'tableExample',
                  bold:true,
                
                  table: {
                    widths: [220, 110, 110, 130,140],
                    body: [
                      [{text: 'DESIGNATION',fontSize: 14, style: 'tableHeader', color: 'black', alignment: 'center', bold:true},{text: 'NATURE-UNITE',fontSize: 14, style: 'tableHeader', color: 'black',alignment: 'center', bold:true}, {text: 'QUANTITE',fontSize: 14, bold:true,color: 'black', style: 'tableHeader', alignment: 'center'},{text: 'PRIX UNITAIRE',fontSize: 14, style: 'tableHeader', alignment: 'center',color: 'black', bold:true},{text: 'MONTANT',fontSize: 14,rowSpan: 1, style: 'tableHeader',color: 'black', alignment: 'center', bold:true}],
                       // eslint-disable-next-line no-unsafe-optional-chaining
                       ...data?.produits.map(m=>{
                        return [{ text: m.produit.catalogue} ,{text: m.produit.uniteConditionnement, alignment:'center'},{text: `${m.qte}`, alignment:'right'},{text: formatNumber(m.produit.prixUnitaire), alignment:'right'},{ text: `${formatNumber(m.produit.prixUnitaire * m.qte)}`, alignment:'right'}]
                     }),
                       [{text:'TOTAL',fontSize: 16},'',{text:`${data?.produits?.reduce((acc,val) => acc + val.qte ,0)}`, alignment:'right'},'',{text:`${formatNumber(data?.produits?.reduce((acc,val) => acc + ( parseInt(val.produit.prixUnitaire,10) * val.qte) ,0))}`, alignment:'right'}],
                      
                    ]
                  }
               },
              
               {
                columns: [
                  {   
                    
                    stack: [                        
                        {text: '\nTOTAL HTVA ', fontSize: 13, bold: true, alignment:'justify'},
                        {text: 'TVA 18% ', fontSize: 13, bold: true, alignment:'justify'},
                        {text: 'TOTAL TTC ', fontSize: 13, bold: true, alignment:'justify'},
                      ]
                      
                    
                  },
                
                  {
                    text: ''
                  },
                  {
                   
                    text: [
                        
                      {text: `\n${formatNumber(getTTC(data))} FCFA\n`, fontSize: 13, bold: true, alignment:'justify'},
                        {text: `${formatNumber(getTVA(data))} FCFA\n`, fontSize: 13, bold: true, alignment:'justify'},
                        {text: `${formatNumber(getHT(data))} FCFA`, fontSize: 13, bold: true, alignment:'justify'},
                      
                      
                    ]
                  }
                ]
              },
                             
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                subheader: {
                    fontSize: 12,
                    bold: false,
                    
                   
                },
                
                quote: {
                    italics: true
                },
                img: {
                    fontSize: 8
                },
                defaultStyle: {
                  columnGap: 20
                }
               
            }  
            
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
                      {text: 'REPUBLIQUE DU SENEGAL ', fontSize: 13, bold: true, alignment:'center'},
                      {text: 'Un Peuple - Un But - Une Foi', fontSize: 12, bold: false, alignment:'center'},
                      {text: '------------', fontSize: 12, bold: false, alignment:'center'},   
            {
              image:photo,
              width:70,
              height:30,
              alignment: 'center',
              
             
            },
            {text: 'MINISTERE DE L ENSEIGNEMENT SUPERIEUR, DE LA RECHERCHE ET DE L INNOVATION', fontSize: 10, bold: false, alignment:'center'},
            {text: '--------------', fontSize: 12, bold: false, alignment:'center'},
            {text: 'CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR (CROUS/Z)', fontSize: 10, bold: false, alignment:'center'},
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
                      
                    {text: 'Art, 2b, 7b, 7c, 19b\n', fontSize: 12, bold:true, alignment:'center'},
                    {text: '\nModèle 3\n', fontSize: 12, bold: true, alignment:'center'},
                    {text: `\n\n\nDate: ${format(data?.date,'dd/MM/yyyy')}`, fontSize: 12, bold: true, alignment:'center'},
                    
                    
                  ]
                }
              ]
            },
              {
                style: 'tableExample',
                fillColor:'#c026d3',
                margin: [20, 10],
                table: {
                  widths: ['*'],
                  body: [
                    [{text: `PROCES-VERBAL DE RECEPTION N°: ${data?.n_bon}`,color:'white', fontSize: 20, bold: true, alignment:'center'}],
                  ]
                }
              },
              
              {
              
            },
              
              {
                  text: `TYPE: ${data?.type}`,
                  style: 'subheader'
              },

              {
          
                columns: [
                  {
                   
                    text: [
                      
                      {text: `\nArrêté le présent PV a .(${data?.produits?.reduce((acc,val) => acc + val.qte ,0)})..unité que avons réceptionnées\n\n`, fontSize: 12, bold: false, alignment:'justify'},
                      {text: `Ziguinchor, ${format(data?.date,'dd/MM/yyyy')}`, fontSize: 12, bold: true, alignment:'center'},
                      {text: '\n\nNoms et qualites du fournisseur:', fontSize: 12, bold: false, alignment:'justify'},
                      {text: `\n\n${data?.fournisseur}\n`, fontSize: 14, bold: true, alignment:'justify'},
                      {text: '\n\nNoms, qualites et signatures des membres de la commission:', fontSize: 12, bold: false, alignment:'justify'},
                     
                    ]

                  },

                  {
                   
                    text: [
                      
                      {text: `\nACHAT DE ${data?.produits[0]?.produit.cat.categorie}`,color:'blue', fontSize: 13, bold: true, alignment:'center'},
                      {text: '\nEnumération des pièces justificatives jointes\n', fontSize: 12, bold: false, alignment:'justify'},
                      {text: '\n	Facture définitive', fontSize: 13, bold: true, alignment:'justify'},
                      {text: '\n	Bordereau de livraison', fontSize: 13, bold: true, alignment:'justify'},
                      {text: '\n	Facture Pro forma\n', fontSize: 13, bold: true, alignment:'justify'},
                      {text: `\nFacture N°: ${data?.numero_bon} du ${format(data?.date,'dd/MM/yyyy')}`,color:'red', fontSize: 12, bold: true, alignment:'justify'},
                      {text: `\n\nMONTANT: ${formatNumber(getTTC(data))} FCFA\n\n`, fontSize: 16, bold: true, alignment:'center'} 
                      
                    ]
                  }
                ]
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
                columns: [
                  {
                    
                    text: [
                      
                      {text: 'M.Ansoumana DIEDHIOU\n', fontSize: 12, bold:true, alignment:'center'},
                      {text: '................\n', fontSize: 12, bold: true, alignment:'center'},
                      {text: 'Membre', fontSize: 12, bold: true, alignment:'center'},
                      
                      
                    ]
                  },
                  {
                    text: [
                      
                      {text: 'M.Mamadou KONTE\n', fontSize: 12, bold:true, alignment:'center'},
                      {text: '................\n', fontSize: 12, bold: true, alignment:'center'},
                      {text: 'President\n', fontSize: 12, bold: true, alignment:'center'},
                      
                      
                    ]
                  },
                  {
                    text: [
                      
                      {text: 'M.Ibrahima DIAVE\n', fontSize: 12, bold:true, alignment:'center'},
                      {text: '................\n', fontSize: 12, bold: true, alignment:'center'},
                      {text: 'Membre\n', fontSize: 12, bold: true, alignment:'center'},   
                    ]
                  }
                ]
              },
              {
                style: 'tableExample',
                fillColor:'#c026d3',
                margin: [15, 10],
                table: {
                  widths: ['*'],
                  body: [
                    [{text: 'PROCES-VERBAL DE RECEPTION', fontSize: 20, bold: true, alignment:'center',color:'white'}],
                  ]
                }
              },
             {
              style: 'tableExample',
                bold:true,
                table: {
                  widths: [220, 110, 110, 130,140],
                  body: [
                    [{text: 'DESIGNATION',fontSize: 14, style: 'tableHeader', color: 'black', alignment: 'center', bold:true},{text: 'NATURE-UNITE',fontSize: 14, style: 'tableHeader', color: 'black',alignment: 'center', bold:true}, {text: 'QUANTITE',fontSize: 14, bold:true,color: 'black', style: 'tableHeader', alignment: 'center'},{text: 'PRIX UNITAIRE',fontSize: 14, style: 'tableHeader', alignment: 'center',color: 'black', bold:true},{text: 'MONTANT',fontSize: 14,rowSpan: 1, style: 'tableHeader',color: 'black', alignment: 'center', bold:true}],
                     // eslint-disable-next-line no-unsafe-optional-chaining
                     ...data?.produits.map(m=>{
                      return [{ text: m.produit.catalogue} ,{text: m.produit.uniteConditionnement, alignment:'center'},{text: `${m.qte}`, alignment:'right'},{text: formatNumber(m.produit.prixUnitaire), alignment:'right'},{ text: `${formatNumber(m.produit.prixUnitaire * m.qte)}`, alignment:'right'}]
                   }),
                     [{text:'TOTAL',fontSize: 16},'',{text:`${data?.produits?.reduce((acc,val) => acc + val.qte ,0)}`, alignment:'right'},'',{text:`${formatNumber(data?.produits?.reduce((acc,val) => acc + ( parseInt(val.produit.prixUnitaire,10) * val.qte) ,0))}`, alignment:'right'}],
                    
                  ]
                }
             },
          
            
             {
              columns: [
                {   
                  
                  stack: [                        
                      {text: '\nTOTAL  ', fontSize: 13, bold: true, alignment:'justify'},
                     
                    ]
                    
                  
                },
              
                {
                  text: ''
                },
                {
                 
                  text: [
                      
                    {text: `\n${formatNumber(getTTC(data))} FCFA\n`, fontSize: 13, bold: true, alignment:'justify'},
                     
                    
                    
                  ]
                }
              ]
            },
                           
          ],
          styles: {
              header: {
                  fontSize: 18,
                  bold: true
              },
              subheader: {
                  fontSize: 12,
                  bold: false,
                  
                 
              },
              
              quote: {
                  italics: true
              },
              img: {
                  fontSize: 8
              },
              defaultStyle: {
                columnGap: 20
              }
             
          }  
          
      }
      pdfMake.createPdf(dd).open();
  }

    const rows = data?.produits.map((element) => (
        <Table.Tr key={element.produit._id}>
          <Table.Td>{element.produit.catalogue}</Table.Td>
          <Table.Td>{element?.qte}</Table.Td>
          <Table.Td>{element.produit.prixUnitaire} </Table.Td>
          <Table.Td>{(element.produit.prixUnitaire)*(element?.qte)}</Table.Td>
          <Table.Td>{element.produit.observation}</Table.Td>
        </Table.Tr>
      ));
     

      const membres = data?.commission?.membres.map((element) => (
        <Table.Tr key={element._id}>
          <Table.Td>{element.prenom}</Table.Td>
          <Table.Td>{element.nom}</Table.Td>
          <Table.Td>{element.fonction}</Table.Td>
        </Table.Tr>
      ));

  return (
    <div className="mx-10">
    <div className="flex items-center justify-between px-20 mt-4 ">
    <Button className='w-45 h-12 font-bold' bg='blue' onClick={() => generer()} >PV RECEPTION AVEC TTC</Button>
     <Button className='w-45 h-12 font-bold' bg='yellow' onClick={() => generer1()} >PV RECEPTION SANS TTC</Button>    
    </div>
    <div className="my-5 text-3xl font-semibold text-center  mt-4 ">
       DATE : {data?.date}
    </div>
     <div className="my-5 text-3xl font-semibold bg-red-300">
       NUMERO DE BON : {data?.numero_bon}
    </div>
    <div className="my-5 text-3xl font-semibold bg-green-300">
       TYPE : {data?.type}
    </div>
    <div className="my-5 text-3xl font-semibold bg-blue-300">
       FOURNISSEUR : {data?.fournisseur}
    </div>
   
    <div className="my-5 text-3xl font-semibold">
       MATIERES
    </div>
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Catalogue</Table.Th>
          <Table.Th>Quantite</Table.Th>
          <Table.Th >PU </Table.Th>
          <Table.Th>MONTANT</Table.Th>
          <Table.Th>Observation</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </Table>
    <div className="my-5 text-3xl font-semibold">
       COMMISSION : {data?.commission?.nom_commission}
    </div>
    <div className="my-2 text-xl font-semibold">
      Membre de la commission
    </div>
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Prenom</Table.Th>
          <Table.Th>Nom</Table.Th>
          <Table.Th>Fonction</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{membres}</Table.Tbody>
    </Table>
    </div>
  )
}

export default Recep