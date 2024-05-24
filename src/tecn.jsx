/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */
import { useParams } from "react-router-dom";
import { getSuivi } from "./services/suiviservice";
import { useQuery } from "react-query";
import { Button } from "@mantine/core";
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "./vfs_fonts";
pdfMake.vfs = font
import {image} from "./composants/image";
import {photo} from "./composants/photo";
import { format } from "date-fns";


function Tecn() {
    
    const {id} = useParams();
    const key = ['get_suivi',id];
    const {data} = useQuery(key,() => getSuivi(id))

    const formatNumber = (n) => String(n).replace(/(.)(?=(\d{3})+$)/g,'$1 ') 

    const generer = () => {
        var dd = {
            content:[
                {
                    columns:[
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
                            text: [
                              {text: '\n\n', fontSize: 12, bold: true, alignment:'center'},
                              {text: `Date: ${format(data?.date,'dd/MM/yyyy')}\n\n`, fontSize: 12, bold: true, alignment:'center'},
                              {text: '\n', fontSize: 12, bold:true, alignment:'center'},
                              {text: 'Année budgétaire 2024\n', fontSize: 12, bold: true, alignment:'center'},  
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
                        [{text:  `PROCES VERBAL DE RECEPTION TECHNIQUE CROUS/Z`,color:'white', fontSize: 25, bold: true, alignment:'center'},],
                      ]
                    }
                  },
                  {
                    text: [
                        
                        {text: '----------------------------------------------\n\n', fontSize: 15, bold:false, alignment:'center'},
                        {text: `Nous soussignés, les membres de la Commission de réception du Centre Régional des Œuvres Universitaires Sociales de Ziguinchor, certifions que (l' ou le) ${data?.type} du ${data?.description} relatif à la facture définitive N° ${data?.facture} du ${format(data?.date,'dd/MM/yyyy')}.\n\n`, fontSize: 14, bold: false, alignment:'justify',italics: true},
                        {text: `   A cet effet, le montant de service qui s’élève à la somme de ${formatNumber(data?.montant)} Francs CFA peut être payé au service ${data?.service} .\n\n`, fontSize: 14, bold: false, alignment:'justify',italics: true},
                        {text: `  \n\n Le prestataire : ${data?.service}\n\n`, fontSize: 14, bold: true, alignment:'justify'},
                        {text: `  \n\n Les membres de la commission :\n\n`, fontSize: 14, bold: true, alignment:'justify'},
                      
                      ]
                      
                  },
                  {
                    columns: [
                      {
                        
                        text: [
                          
                          {text: 'M.Ibrahima DIAVE\n', fontSize: 12, bold:true, alignment:'center'},
                          {text: '................\n', fontSize: 12, bold: true, alignment:'center'},
                          {text: 'Membre', fontSize: 12, bold: true, alignment:'center'},
                          
                          
                        ]
                      },
                      {
                        text: [
                          
                          {text: 'M.Ansou DIEDHIOU\n', fontSize: 12, bold:true, alignment:'center'},
                          {text: '................\n', fontSize: 12, bold: true, alignment:'center'},
                          {text: 'President\n', fontSize: 12, bold: true, alignment:'center'},
                          
                          
                        ]
                      },
                      {
                        text: [
                          
                          {text: 'M.Assane SOW\n', fontSize: 12, bold:true, alignment:'center'},
                          {text: '................\n', fontSize: 12, bold: true, alignment:'center'},
                          {text: 'Membre\n', fontSize: 12, bold: true, alignment:'center'},
                          
                          
                        ]
                      }
                    ]
                  },
                  
            ]
            

        }
        pdfMake.createPdf(dd).download();
    }
  return (
    <div className="mx-10">
         <div className="text-center  mt-4">
         <Button className='w-45 h-12 font-bold bg-slate-600' bg='blue' onClick={() => generer()} >GENERER PV RECEPTION</Button>
         </div>
         <div className="my-5 text-2xl font-semibold text-center  mt-4">
       ZIGUINCHOR : {data?.date}
    </div>
    <div className="my-5 text-2xl font-semibold bg-slate-300  mt-4">
       TYPE DE RECEPTION  : {data?.type}
    </div>
    <div className="my-5 text-2xl font-semibold bg-yellow-200  mt-4">
       DESCRIPTION : {data?.description}
    </div>
    <div className="my-5 text-2xl font-semibold  bg-blue-300 mt-4">
       LE PRESTATAIRE   : {data?.service}
    </div>
    <div className="my-5 text-2xl font-semibold  bg-red-300 mt-4">
       NUMERO FACTURE : {data?.facture}
    </div>
    <div className="my-5 text-2xl font-semibold  bg-green-300 mt-4">
       MONTANT : {data?.montant}
    </div>
    </div>
  )
}

export default Tecn