
import { ActionIcon, Button, Divider, Drawer, Group, LoadingOverlay, Modal, NumberInput, SimpleGrid, Text, TextInput } from "@mantine/core"
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FcPlus } from "react-icons/fc";
import classes from './Navbarnested.module.css';
import { useDisclosure } from "@mantine/hooks";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { notifications } from "@mantine/notifications";
import { createFournisseur, deleteFournisseur, getFournisseur, updateFournisseur } from "./services/fournisseurservice";
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import { useForm } from "@mantine/form";
import { AiFillEdit } from "react-icons/ai";
import { HiArchiveBoxXMark } from "react-icons/hi2";

const schema = z.object ({
    nom_entreprise: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    ninea: z
    .string()
    .min(3, { message: 'entrez minumum 3 lettres' }),
    rc: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    service: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    adresse: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    telephone: z.number()
    });

function Fournisseur() {
    const [noTransitionOpened, { open:ope, close:cli }] = useDisclosure(false);
    const [opened, { open:opF, close:clF }] = useDisclosure(false);
    const key = 'get_Fournisseur';
    const qc = useQueryClient();
    const {data: Fournisseur,isLoading} = useQuery(key,() => getFournisseur());
    const form = useForm({
      initialValues: {
        nom_entreprise: '',
        ninea: '',
        rc: '',
        service: '',
        adresse: '',
        telephone: 0,
        termsOfService: false,
      },
      validate: zodResolver(schema),
    });
    const formF = useForm({
      initialValues: {
        nom_entreprise: '',
        ninea: '',
        rc: '',
        service: '',
        adresse: '',
        telephone: 0,
        termsOfService: false,
      },
      validate: zodResolver(schema),
    });
    const {mutate,isLoading:isLoadingF} = useMutation((val) => createFournisseur(val),{
      onSuccess:() => {
        notifications.show({
          title: 'creation attribution',
          message: 'attribution a ete cree avec succee',
          color: 'green'
        })
       
        qc.invalidateQueries(key);
        cli();
      }
    })
    const {mutate: delF, isLoading:loadF} = useMutation((id) => deleteFournisseur(id),{
      onSuccess:() => {
        notifications.show({
          title: 'supprimer commission',
          message: 'le commission supprime avec succee',
          color: 'green'
        })
        qc.invalidateQueries(key);
      }
    });
    const {mutate:udpF,isLoading:loaF} = useMutation((data) => updateFournisseur(data._id,data.val),{
      onSuccess:() => {
        notifications.show({
          title: 'mise a jours commission',
          message: 'commission modifier avec succee',
          color: 'green'
        })
        qc.invalidateQueries(key);
        close();
      }
    })
    const save = (valeurs) => {
      mutate(valeurs);
  }
  const handleFormSubmit = (row) => {
    delF(row._id);
   };
   const updateF = (val) => {
    const {_id,...rest} = val;
    udpF({_id,val:rest});
   }
   const handleUpdate= (row) => {
    const {telephone} = row;
   formF.setValues({...row,telephone: +telephone});
   opF();
   };
  const actionTemplate = (row) => {
    return (
        <div className="flex space-x-2">
            <ActionIcon aria-label="default action icon" size="lg" bg="lime"onClick={() => handleUpdate(row)}>
            <AiFillEdit/>
          </ActionIcon>
          <ActionIcon aria-label="default action icon" size="lg" bg="red" onClick={() => handleFormSubmit(row)}>
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
          visible={isLoadingF || loadF || loaF}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
    <div className='text-center  mt-4'>
        <Button  className='w-45 h-12 font-bold' bg='pink' leftSection={<FcPlus/>} onClick={ope}> UN FOURNISSEUR </Button>
    </div>
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
    <h1 className='font-bold text-3xl text-center mt-6'>LISTE FOURNISSEUR</h1>
    <div className="card mt-6">
    <DataTable value={Fournisseur} tableStyle={{ minWidth: '50rem' }} loading={isLoading} paginator rows={15} rowsPerPageOptions={[15, 20, 26, 51]} size="small" stripedRows>
                <Column field="nom_entreprise" header="NOM ENTREPRISE"></Column>
                <Column field="ninea" header="NINEA"></Column>
                <Column field="rc" header="REGIE DE COMMERCE"></Column>
                <Column field="service" header="SERVICE"></Column>
                <Column field="adresse" header="ADRESSE"></Column>
                <Column field="telephone" header="TELEPHONE"></Column>
                <Column header="ACTION" body={actionTemplate}   style={{ minWidth: '4rem' }}></Column>
  </DataTable> 
    </div>
    </div>
    <Modal opened={noTransitionOpened} onClose={cli} title="">
      <form className={classes.form}  onSubmit={form.onSubmit((values) => save(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UN NOUVEAU PRODUIT
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="NOM ENTREPRISE" placeholder="nom entreprise" required  {...form.getInputProps('nom_entreprise')} />
          <TextInput label="NINEA" placeholder="ninea" required  {...form.getInputProps('ninea')}/>
          </SimpleGrid>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="REGIE DECOMMERCE" placeholder="regie de comm" required   {...form.getInputProps('rc')}/>
          <TextInput label="PRODUIT ou SERVICE" placeholder="produit livree" required  {...form.getInputProps('service')}/>
          </SimpleGrid>
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="ADRESSE" placeholder="adresse" required  {...form.getInputProps('adresse')}/>
          <NumberInput label="TELEPHONE" placeholder="telephonet" required  {...form.getInputProps('telephone')}/>
          </SimpleGrid>
         
          <Group justify="flex-end" mt="md">
          <Button type="submit" bg='cyan' className={classes.control}>
                ENREGISTRER
              </Button>
          </Group>
          <Divider label="@CROUS/Z" labelPosition="center" my="lg" />
          </div>
        </form>
      </Modal>

      <Drawer offset={8} radius="md" opened={opened} position="right" onClose={clF} title="">
      <form className={classes.form}  onSubmit={formF.onSubmit((values) => updateF(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UN NOUVEAU PRODUIT
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="NOM ENTREPRISE" placeholder="nom entre" required  {...formF.getInputProps('nom_entreprise')} />
          <TextInput label="NINEA" placeholder="ninea" required  {...formF.getInputProps('ninea')}/>
          </SimpleGrid>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="REGIE DE COMMERCE" placeholder="regi de comm" required   {...formF.getInputProps('rc')}/>
          <TextInput label="PRODUIT ou SERVICE" placeholder="produit livree" required  {...formF.getInputProps('service')}/>
          </SimpleGrid>
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="ADRESSE" placeholder="adresse" required  {...formF.getInputProps('adresse')}/>
          <NumberInput label="TELEPHONE" placeholder="telephone" required  {...formF.getInputProps('telephone')}/>
          </SimpleGrid>
         
          <Group justify="flex-end" mt="md">
          <Button type="submit" bg='cyan' className={classes.control}>
                ENREGISTRER
              </Button>
          </Group>
          <Divider label="@CROUS/Z" labelPosition="center" my="lg" />
          </div>
          </form>
      </Drawer>
    </>
  )
}

export default Fournisseur