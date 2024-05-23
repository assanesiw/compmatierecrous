import { ActionIcon, Button, Divider, Drawer, Group, LoadingOverlay, Modal, NumberInput, SimpleGrid, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import classes from './Navbarnested.module.css';
import { FcPlus } from "react-icons/fc";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createMembres, deleteMembres, getMembres, updateMembres } from "./services/membresservice";
import { notifications } from "@mantine/notifications";
import { AiFillEdit } from "react-icons/ai";
import { HiArchiveBoxXMark } from "react-icons/hi2";

const schema = z.object({
    prenom: z
      .string()
      .min(3, { message: 'entrez minumum 3 lettres' }),
    nom: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    fonction: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    telephone: z.number(),
    });


function Membres() {
    const [OpenedM, { open:opM, close:cloM }] = useDisclosure(false);
    const [opened, { open, close }] = useDisclosure(false);
    const key = 'get_Membres';
    const qc = useQueryClient();
    const {data: Membres,isLoading} = useQuery(key,() => getMembres());
    const form = useForm({
        initialValues: {
          prenom: '',
          nom: '',
          fonction: '',
          telephone: '',
          termsOfService: false,
        },
        validate: zodResolver(schema),
      });
      const formM = useForm({
        initialValues: {
          prenom: '',
          nom:'',
          fonction: '',
          telephone: '',
          termsOfService: false,
        },
        validate: zodResolver(schema),
      });
      const {mutate,isLoading:isLoadingM} = useMutation((val) => createMembres(val),{
        onSuccess:() => {
          notifications.show({
            title: 'insertion reussite',
            message: 'commision a ete cree avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
          cloM();
        }
      });
      const {mutate: delM, isLoading:loadM} = useMutation((id) => deleteMembres(id),{
        onSuccess:() => {
          notifications.show({
            title: 'supprimer commission',
            message: 'le commission supprime avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
        }
      });
      const {mutate:udpMe,isLoading:loaMe} = useMutation((data) => updateMembres(data._id,data.val),{
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
       const updateM = (val) => {
        const {_id,...rest} = val;
        udpMe({_id,val:rest});
       }
       const handleUpdate= (row) => {
        const {telephone} = row;
       formM.setValues({...row,telephone: +telephone});
       open();
       };
       const handleFormSubmit = (row) => {
        delM(row._id);
       };
       const actionTemplate =  (row) => {
        return (
            <div className="flex space-x-2">
                <ActionIcon aria-label="default action icon" size="lg" bg="lime" onClick={() => handleUpdate(row)}>
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
          visible={isLoadingM || loadM || loaMe}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
    <div className='text-center  mt-4'>
        <Button className='w-45 h-12 font-bold' bg='blue' leftSection={<FcPlus/>} onClick={opM}>MEMBRES</Button>
    </div>
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <h1 className='font-bold text-3xl text-center mt-6'>MEMBRES DE COMMISSION DE RECEPTION</h1>
    </div>
    <div className="card">
        <DataTable value={Membres} tableStyle={{ minWidth: '50rem' }} paginator rows={6} loading={isLoading} rowsPerPageOptions={[6, 16, 26, 51]} size="small" stripedRows>
         <Column field="prenom" header="PRENOM"></Column>
         <Column field="nom" header="NOM"></Column>
         <Column field="fonction" header="FONCTION"></Column>
         <Column field="telephone" header="TELEPHONE"></Column>
         <Column header="ACTION" body={actionTemplate}  style={{ minWidth: '4rem' }}></Column>
        </DataTable>
    </div>
    <Modal opened={OpenedM} onClose={cloM} title="">
      <form className={classes.form} onSubmit={form.onSubmit((values) => save(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ LES MEMBRES D UNE COMMISSION DE RECEPTION
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="PRENOM" placeholder="prenom" required {...form.getInputProps('prenom')} />
          <TextInput label="NOM" placeholder="nom" required {...form.getInputProps('nom')} />
          </SimpleGrid>
          
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="FONCTION" placeholder="fonction" required {...form.getInputProps('fonction')}/>
          <NumberInput label="TELEPHONE" placeholder="telephone" required {...form.getInputProps('telephone')}/>
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

      <Drawer offset={8} radius="md" opened={opened} position="right" onClose={close} title="">
      <form className={classes.form} onSubmit={formM.onSubmit((values) => updateM(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ LES MEMBRES D UNE COMMISSION DE RECEPTION
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="PRENOM" placeholder="prenom" required {...formM.getInputProps('prenom')} />
          <TextInput label="NOM" placeholder="nom" required {...formM.getInputProps('nom')} />
          </SimpleGrid>
          
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="FONCTION" placeholder="fonction" required {...formM.getInputProps('fonction')}/>
          <NumberInput label="TELEPHONE" placeholder="telephone" required {...formM.getInputProps('telephone')}/>
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

export default Membres