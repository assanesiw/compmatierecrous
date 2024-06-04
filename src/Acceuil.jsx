import { Button, ScrollArea } from '@mantine/core';
import classes from './Navbarnested.module.css';
import { FcPackage, FcPortraitMode, FcStatistics, FcImport, FcShop,  FcRefresh, FcNeutralTrading, FcInspection,} from "react-icons/fc";
import {  Route, Routes, useNavigate, } from 'react-router-dom';
import { RiMenu3Fill } from "react-icons/ri";
import Produits from './composants/Produits';
import Produit from './Produit';
import Matiere from './Matiere'
import Attribution from './Attribution';
import Commission from './Commission';
import Fournisseur from './Fournisseur';
import Suivi from './Suivi';
import { PrimeReactProvider } from 'primereact/api';
import Affichemembre from './Affichemembre';
import Catalogue from './Catalogue';
import Recep from './Recep';
import Attri from './Attri';
import Inventaire from './Inventaire';
import Tecn from './tecn';
import Reception from './Reception';
import AuthOutlet from '@auth-kit/react-router/AuthOutlet';
import useSignOut from 'react-auth-kit/hooks/useSignOut';
import { Popconfirm } from 'antd';











function Acceuil() {
  const navigate = useNavigate();
  const signOut = useSignOut()


  const confirm = () => {
    signOut();
    navigate('/login');
  };
 
  return (
    <PrimeReactProvider>
     <div className="flex">
     <nav className={classes.navbar}>
      <div className="_header_rxo8w_10 {classes.header}">
      <img className="mx-auto w-28 h-25" src="/crousz.jpg" alt="CROUS ZIGUINCHOR" />
      </div>

      <ScrollArea className={classes.links}>
        <div className="_linksInner_rxo8w_23{classes.linksInner}">
          

<div className="mt-6 text-5xl text-green-900 dark:bg-green-700 dark:border-green-600 dark:text-white font-bold">
 <div className="flex items-center justify-center hover:bg-blue-500 px-2 group py-1">
 <RiMenu3Fill className='w-6 h-6 group-hover:text-white'/>
 <Button  className='text-black font-bold hover:bg-transparent'  fullWidth onClick={() => navigate('/acceuil')}>MATIERES(STOCK)</Button>
 </div>
 <div className="flex items-center justify-center hover:bg-blue-500 px-2 group py-1">
 <FcStatistics className='w-6 h-6 group-hover:text-white'/>
 <Button  className='text-black font-bold hover:bg-transparent'  fullWidth onClick={() => navigate('Catalogue')}>CATEGORIE</Button>
 </div>
 <div className="flex items-center justify-center hover:bg-blue-500 px-2 group py-1">
 <FcImport className='w-6 h-6 group-hover:text-white'/>
 <Button  className='text-black font-bold hover:bg-transparent'  fullWidth onClick={() => navigate('reception')}>RECEPTION</Button>
 </div>
 <div className="flex items-center justify-center hover:bg-blue-500 px-2 group py-1">
 <FcRefresh className='w-6 h-6 group-hover:text-white'/>
 <Button  className='text-black font-bold hover:bg-transparent'  fullWidth onClick={() => navigate('Attribution')}>ATTRIBUTION</Button>
 </div>
 <div className="flex items-center justify-center hover:bg-blue-500 px-2 group py-1">
 <FcShop className='w-6 h-6 group-hover:text-white'/>
 <Button  className='text-black font-bold hover:bg-transparent'  fullWidth onClick={() => navigate('Fournisseur')}>FOURNISSEUR</Button>
 </div>
 <div className="flex items-center justify-center hover:bg-blue-500 px-2 group py-1">
 <FcPortraitMode className='w-6 h-6 group-hover:text-white'/>
 <Button  className='text-black font-bold hover:bg-transparent'  fullWidth onClick={() => navigate('Commission')}>COMMISSION</Button>
 </div>
 <div className="flex items-center justify-center hover:bg-blue-500 px-2 group py-1">
 <FcPackage className='w-6 h-6 group-hover:text-white'/>
 <Button  className='text-black font-bold hover:bg-transparent'  fullWidth onClick={() => navigate('suivi')}>RECEPTION TECHNIQUE</Button>
 </div>
 <div className="flex items-center justify-center hover:bg-blue-500 px-2 group py-1">
 <FcNeutralTrading className='w-6 h-6 group-hover:text-white'/>
 <Button className='text-black font-bold hover:bg-transparent'  fullWidth onClick={() => navigate('matieres')}>HORS SERVICE</Button>
 </div>

 <div className="flex items-center justify-center hover:bg-blue-500 px-2 group py-1">
 <FcInspection className='w-6 h-6 group-hover:text-white'/>
 <Button className='text-black font-bold hover:bg-transparent'  fullWidth onClick={() => navigate('Inventaire')}>INVENTAIRE</Button>
 </div>
  </div>

  <div className='text-center'>
  <Popconfirm
    title="Deconnexion"
    description="Etes vous sure?"
    onConfirm={confirm}
    onCancel={null}
    okText="OUI"
    okButtonProps={{className:'bg-green-500'}}
    cancelText="NON"
  >
    <Button className='mt-6 w-45 h-12 font-bold text-center' bg='green'>DECONNECTER</Button>
  </Popconfirm>
        </div>
        </div>
         </ScrollArea>
      <div className={classes.footer}>
      </div>
     <div>
      
</div>
    </nav>
    <div className="min-h-full">
    <nav className="bg-gradient-to-tr from-white to-white">
    <div className="h-14 w-2/3 mx-auto">
    <marquee className="text-green-500 font-bold text-center text-2xl">BIENVENUE DANS LA PAGE D ACCEUIL DE LA GESTION DES BIENS MATERIELES DU CENTRE REGIONALE DES OEUVRES  SOCIALES  DE ZIGUINCHOR</marquee>
    </div>
    </nav>    
    <Routes>
    <Route element={<AuthOutlet fallbackPath='/login' />}>
      <Route path="" element={<Produits/>} />
       <Route path="produits" element={<Produits/>}/>
       <Route path="produits/:id" element={<Produit/>}/>
       <Route path="matieres" element={<Matiere/>}/>
       <Route path="reception" element={<Reception/>} />
       <Route path="reception/:id" element={<Recep/>} />
       <Route path="attribution" element={<Attribution/>} />
       <Route path="attribution/:id" element={<Attri/>} />
       <Route path="commission" element={<Commission/>} />
       <Route path="commission/:id" element={<Affichemembre/>}/>
       <Route path="fournisseur" element={<Fournisseur/>} />
       <Route path="suivi" element={<Suivi/>}/>
       <Route path="suivi/:id" element={<Tecn/>}/>
       <Route path="catalogue" element={<Catalogue/>}/>
       <Route path="inventaire" element={<Inventaire/>} />
    </Route>
       
      </Routes>
    </div>



    

    

     </div>  
     </PrimeReactProvider>
  )
}
export default Acceuil