
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import { getProduit, updatePhotoProduit } from "./services/produitsservice";
import { QRCode } from "antd";
import { FcPrint } from "react-icons/fc";
import { useRef, useState } from "react";
import { notifications } from "@mantine/notifications";
import { FileInput, Avatar, Button as Buttonm, LoadingOverlay} from "@mantine/core";
import { FaImage } from "react-icons/fa";
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "./vfs_fonts";
pdfMake.vfs = font

function Produit() {
    const {id} = useParams();
    const key = ['get_Produit',id];
    const [file,setFile] = useState(null);
    const qc = useQueryClient();
    const inputRef = useRef();
    const {data} = useQuery(key,() => getProduit(id));
    const {mutate,isLoading} = useMutation((data) => updatePhotoProduit(id,data),{
        onSuccess:() => {
          notifications.show({
            title: 'modification photo produits',
            message: 'le produits a ete modifie',
            color: 'green'
          })
          qc.invalidateQueries(key);
        },
        onError:() => {
            notifications.show({
                title: 'modification photo produits',
                message: 'le produits a ete echoue',
                color: 'red'
              })
        }
      });

     

      const addFile = (file) => {
        setFile(file);
        const fd = new FormData();
        fd.append('photo',file);
        mutate(fd);
      }
      
      const generer = () => {
      
        var dd = {
          
            content: [
                { qr: `${data?.code},fit: '200'` },            
            ],       
        }
        pdfMake.createPdf(dd).open();
    }
  return (
    <>
     <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
    {data && <div className="w-1/2 mx-auto flex flex-col items-center my-10 space-y-2">
        <Avatar src={`http://localhost:3000/uploads/produits/${data?.photo}`} size={94} radius='xs'/>
         <FileInput accept="image/png,image/jpeg" ref={inputRef} className="hidden" value={file} onChange={(file) => addFile(file)} />
         <Buttonm className="bg-green-500" leftSection={<FaImage/>} onClick={() => inputRef.current.click()}>CHOISIR UNE PHOTO</Buttonm>
         <div className="text-2xl font-semibold text-center">
        CATEGORIE: {data?.cat.categorie}
    </div>
    <div className="text-2xl font-semibold text-center">
       MATIERE: {data?.catalogue}
    </div>
    
    <div className="text-2xl font-semibold text-center">
        UNITE: {data?.uniteConditionnement}
    </div>
    <div className="text-2xl font-semibold text-center">
        PRIX UNITAIRE: {data?.prixUnitaire} FCFA
    </div>
    <div className="text-2xl font-semibold text-center">
        EMPLACEMENT: {data?.emplacement}
    </div>
    <div className="text-2xl font-semibold text-center">
        OBSERVATION: {data?.observation}
    </div>
    <div className="text-2xl font-semibold text-center">
       <QRCode value={data?.code}/>
    </div>
    <Buttonm leftSection ={<FcPrint/>} className='w-45 h-12 font-bold bg-blue-500'  onClick={() => generer()}>IMPRIMER</Buttonm>
   
    </div>}
    
    </>
  )
}

export default Produit