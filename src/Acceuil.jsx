import { Button,Badge, ScrollArea, Modal, Stack, PasswordInput, Group, Popover, LoadingOverlay } from '@mantine/core';
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
import { FaRegUserCircle } from 'react-icons/fa';
import useAuthUser from 'react-auth-kit/hooks/useAuthUser'
import { useDisclosure } from '@mantine/hooks';
import { useMutation, useQueryClient } from 'react-query';
import { Updatepassword } from './services/user';
import { notifications } from '@mantine/notifications';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { z } from 'zod';

const schema = z.object({
  password:z.string()
  .min({6: 'entrez minumum 6 lettres' }),
  });

function Acceuil() {
  const navigate = useNavigate();
  const signOut = useSignOut();
  const [opened, { close, open }] = useDisclosure(false);
  const {prenom,nom, role,id} = useAuthUser()
  const [Opened, { open: op1, close: close1 }] = useDisclosure(false);
  const [visible, { toggle }] = useDisclosure(false);
  const key = 'get_User';
  const qc = useQueryClient();
  const confirm = () => {
    signOut();
    navigate('/login');
  };
  const formU = useForm({
    initialValues: {
      password:'',
    },
    validate: zodResolver(schema),
  });
  const {mutate ,isLoading} = useMutation((data) => Updatepassword(data._id,data.val),{
    onSuccess:() => {
      notifications.show({
        title: 'mise a jours mot de pass',
        message: 'mot de pass modifier avec succee',
        color: 'green'
      })
      qc.invalidateQueries(key);
      close1();
      signOut();
      navigate('/login');
    }
  })
 
  const updateMp = (val) => {
   mutate({_id:id,val});
   close();
  }


 
  return (
    <>
    
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
  <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />

  {/* <div className='text-center'>
  <Popconfirm
    title="DECONNECTER"
    description="Etes vous sure?"
    onCancel={null}
    okText="OUI"
    okButtonProps={{className:'bg-green-500'}}
    cancelText="NON"
    onConfirm={confirm}
   
    
  >
    <Button className='mt-6 w-45 h-12 font-bold text-center' bg='green'>DECONNECTER</Button>
  </Popconfirm>
        </div> */}
        </div>
         </ScrollArea>
      <div className={classes.footer}>
      </div>
     <div>     
</div>
    </nav>
    <div className="min-h-full">
    <nav className="flex items-center justify-between bg-gradient-to-tr from-white to-white">
    <div className="flex space-x-10 h-14 w-2/3 mx-auto px-20 mt-4">
    <marquee className="text-green-500 font-bold text-center text-2xl">BIENVENUE DANS LA PAGE D ACCEUIL DE LA GESTION DES BIENS MATERIELES DU CENTRE REGIONALE DES OEUVRES  SOCIALES  DE ZIGUINCHOR</marquee>
    </div>
    <Badge
size="xl"
color='gray'
>
    <div className='flex items-center text-white font-bold text-center text-1xl space-x-2'>
    <Popover width={250} position="bottom" withArrow shadow="md" opened={opened} onClose={close}>
      <Popover.Target>
        <Button onClick={open}>
        <FaRegUserCircle  className='w-6 h-6 group-hover:text-white mr-10 cursor-pointer' />
        </Button>
      </Popover.Target>
      <Popover.Dropdown bg="var(--mantine-color-body)">
      
      {prenom} {nom}
      <div className=" items-center justify-between py-3 mt-4 ">
        <Popconfirm
        title="DECONNECTER"
        description="Etes vous sure?"
        onCancel={null}
        okText="OUI"
        okButtonProps={{className:'bg-green-500'}}
        cancelText="NON"
        onConfirm={confirm}>
      <Button bg='red'>
               DECONNECTER  
              </Button>
              </Popconfirm>
              </div>

              <div className="items-center justify-between py-3 mt-4 ">
              <Button  bg='green' onClick={op1}>
               CHANGER MOT DE PASS
              </Button>
              </div>
      </Popover.Dropdown>
    </Popover>
       <div >{prenom} {nom} {role}</div>
       {/* <Popover
       title="CHANGEMENT MOT DE PASS"
       description="etes vous sure"
       okButtonProps={{className:'bg-green-500'}}
       okText="OUI"
       cancelText="NON"
       onConfirm={op1}
       >
       
    <FaRegUserCircle  className='w-6 h-6 group-hover:text-white mr-10 cursor-pointer' /></Popover> */}
    </div>
</Badge>
  
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
     <Modal  opened={Opened} size='xs' onClose={close1} title="" >
     <form  onSubmit={formU.onSubmit(updateMp)}>
    
     <Stack>
      <PasswordInput
        label="LE NOUVEAU MOT DE PASS"
        visible={visible}
        onVisibilityChange={toggle}
        {...formU.getInputProps('password')}
      />
    </Stack>
    <Group justify="flex-end" mt="md" >
          <Button type="submit" bg='green'className={classes.control} >
                CONFIRMER
              </Button>  
              </Group>
                
                 </form>
                 </Modal>
</>
  )
}
export default Acceuil