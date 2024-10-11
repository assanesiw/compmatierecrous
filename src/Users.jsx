import { ActionIcon, Button, Drawer, Group, LoadingOverlay, Modal, Select, SimpleGrid, Switch, Text, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { zodResolver } from "mantine-form-zod-resolver";
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createUser, deleteUser, getUsers, updateUser} from "./services/user";
import { notifications } from "@mantine/notifications";
import { AiFillEdit } from "react-icons/ai";
import { HiArchiveBoxXMark } from "react-icons/hi2";


const Schema = z.object({
  prenom:z.string(),
  nom:z.string()
  .min({3: 'entrez minumum 3 lettres' }),
  login:z.string(),
  password:z.string(),
  role:z.string(),
  });

function Users() {
  const [Opened, { open, close }] = useDisclosure(false);
  const [Yesopened, { open: opR, close:clR }] = useDisclosure(false);
  const key = 'get_User';
  const qc = useQueryClient();
  const {data: Users,isLoading} = useQuery(key,() => getUsers());

  const form = useForm({
    initialValues: {
      prenom:'',
      nom: '',
      login: '',
      password: '',
      role: '',
     },
    validate: zodResolver(Schema),
  });
  const formU = useForm({
    initialValues:{
      _id:'',
      prenom:'',
      nom:'',
      login:'',
      password:'',
      role:'',
    },
     validate: zodResolver(Schema),
  });

  const {mutate,isLoading:isLoadingR} = useMutation((val) => createUser(val),{
    onSuccess:() => {
      notifications.show({
        title: 'creation utilisateur',
        message: 'utilisateur a ete cree avec succee',
        color: 'green'
      })
      qc.invalidateQueries(key);
      close();
    }
  })
  
  const {mutate: delR,isLoading:loadR} = useMutation((id) => deleteUser(id),{
    onSuccess:() => {
      notifications.show({
        title: 'supprimer produits',
        message: 'le produits supprime avec succee',
        color: 'green'
      })
      qc.invalidateQueries(key);
    }
  });
  const {mutate: updR,isLoading:loaR} = useMutation((data) => updateUser(data._id,data.val),{
    onSuccess:() => {
      notifications.show({
        title: 'mise a jours matiere',
        message: 'matiere modifier avec succee',
        color: 'green'
      })
      qc.invalidateQueries(key);
      clR();
    }
  })
  const handleDelete  = (row) => {
    delR(row._id);
   };


  const save = (valeurs) => {
    mutate(valeurs);
};


const handleUpdate= (row) => {
 formU.setValues(row);
 opR();
 };

 const updateM = (val) => {
  const {_id,...rest} = val;
  updR({_id,val:rest});
 }

const switchTemplate = () => {
  return(
    <Switch
    defaultChecked 
  />
  );
}
const actionTemplate = (row) => {
  return (
      <div className="flex space-x-2">
          <ActionIcon aria-label="default action icon" size="lg" bg="lime" onClick={() => handleUpdate(row)}>
          <AiFillEdit/>
        </ActionIcon>
        <ActionIcon aria-label="default action icon" size="lg" bg="red" onClick={() => handleDelete(row)}>
          <HiArchiveBoxXMark/>
        </ActionIcon>
          {/* <Button icon="pi pi-pencil"  className='w-8 h-8 font-bold' bg='green' style={{ marginRight: '8px' }} leftSection={<AiFillEdit/>}></Button> */}
          {/* <Button icon="pi pi-pencil" className='w-8 h-8 font-bold' bg='red' leftSection={<HiArchiveBoxXMark/>}></Button> */}         
      </div>
  );
  
};
    
  return (
   <>
    <LoadingOverlay
          visible={isLoadingR || loadR || loaR}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
    <h1 className='font-bold text-3xl text-center mt-6'>GESTION DES UTILISATEURS</h1>
    </div>
    <div className="mx-10">
    <div className="text-center  mt-4">
    <Button className='w-45 h-12 font-bold' bg='green' onClick={open}>AJOUTER UN UTILISATEUR</Button>
    </div>
    </div>
    
    <div className="card mt-6">
    <div style={{ backgroundColor: 'var(--highlight-bg)', color: 'var(--highlight-text-color)', borderRadius: 'var(--border-radius)', padding: '1rem' }}>
  <DataTable value={Users}  tableStyle={{ minWidth: '30rem' }} loading={isLoading}  paginator rows={8} rowsPerPageOptions={[6, 16, 26, 51]} size="small" stripedRows>
               
               <Column field="prenom" header="PRENOM"></Column>
               <Column field="nom" header="NOM" ></Column>
               <Column field="login" header="LOGIN" ></Column>
               {/* <Column field="password" header="MOT DE PASSE"  ></Column> */}
               <Column field="role" header="ROLE" ></Column> 
               <Column header="ACTIVE" body={switchTemplate} style={{ minWidth: '4rem' }} ></Column>   
               <Column header="ACTION" body={actionTemplate} style={{ minWidth: '4rem' }} ></Column>
  </DataTable> 
  </div>
 </div>
 <Drawer opened={Opened} size='lg' onClose={close} title="">
 <form   onSubmit={form.onSubmit((values) => save(values))}>
        <Text fz="lg" fw={700} className="text-center text-green-800">
            AJOUTEZ UN NOUVEAU UTILISATEUR
          </Text>
          <div className=''>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="PRENOM" placeholder="prenom" required  {...form.getInputProps('prenom')}/>
          <TextInput label="NOM" placeholder="nom" required  {...form.getInputProps('nom')}/>
          <TextInput label="LOGIN" placeholder="login" required  {...form.getInputProps('login')}/>
          <TextInput label="MOT DE PASS" placeholder="password" required  {...form.getInputProps('password')}/>
          <Select  
          label="ROLE" 
          comboboxProps={{ withinPortal: true }}
          data={['CSA', 'CM', 'GES_STOCK', 'CSAP', 'CONTROLEUR', 'ADMIN']}
          required  {...form.getInputProps('role')}/>
            </SimpleGrid>   
          <Group justify="flex-end" mt="md" >
          <Button type="submit" bg='cyan' >
                ENREGISTRER
              </Button>
          </Group>

          </div>
        </form>
 </Drawer>
 <Modal opened={Yesopened} size='lg' onClose={clR} title="">
 <form   onSubmit={formU.onSubmit((values) => updateM(values))}>
        <Text fz="lg" fw={700} className="text-center text-green-800">
            MODIFIER UTILISATEUR
          </Text>
          <div className=''>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="PRENOM" placeholder="prenom" required  {...formU.getInputProps('prenom')}/>
          <TextInput label="NOM" placeholder="nom" required  {...formU.getInputProps('nom')}/>
          <TextInput label="LOGIN" placeholder="login" required  {...formU.getInputProps('login')}/>
          {/* <TextInput label="MOT DE PASS" placeholder="password" required  {...formU.getInputProps('password')}/> */}
          <Select  
          label="ROLE" 
          comboboxProps={{ withinPortal: true }}
          data={['CSA', 'CM', 'GES_STOCK', 'CSAP', 'CONTROLEUR', 'ADMIN']}
          required  {...formU.getInputProps('role')}/>
            </SimpleGrid>   
          <Group justify="flex-end" mt="md" >
          <Button type="submit" bg='cyan' >
                ENREGISTRER
              </Button>
          </Group>

          </div>
        </form>
 </Modal>
 </>
  )

}

export default Users