import { ActionIcon, Button, Divider, Drawer, Group, List, LoadingOverlay, Modal, MultiSelect,  SimpleGrid, Text, TextInput} from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { FcPlus } from "react-icons/fc";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { createCommission, deleteCommission, getCommissions, updateCommission } from "./services/commissionservice";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { AiFillEdit } from "react-icons/ai";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import classes from './Navbarnested.module.css';
import { getMembres } from "./services/membresservice";
import { useState } from "react";



const schema = z.object({
    nom_commission: z
      .string()
      .min(3, { message: 'entrez minumum 3 lettres' }),
    membres: z.array(z.string()
    .min({ message: 'entrez minumum 12 lettres'})),
    });



function Commission() {
    const [expandedRows, setExpandedRows] = useState([]);
    const [noOpened, { open:opo, close:clo }] = useDisclosure(false);
    const [opened, { open, close }] = useDisclosure(false);
    const key = 'get_Commissions';
    const qc = useQueryClient();
    const {data: Commission,isLoading} = useQuery(key,() => getCommissions());
    const keyM = 'get_Membres';
    const {data: Membres,isLoading: Mload} = useQuery(keyM,() => getMembres());
    

    const form = useForm({
      initialValues: {
        nom_commission: '',
        membres: [],
        termsOfService: false,
      },
      validate: zodResolver(schema),
    });
    const formC = useForm({
      initialValues: {
        nom_commission: '',
        membres:[],
        termsOfService: false,
      },
      validate: zodResolver(schema),
    });
    const {mutate,isLoading:isLoadingC} = useMutation((val) => createCommission(val),{
        onSuccess:() => {
          notifications.show({
            title: 'insertion reussite',
            message: 'commision a ete cree avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
          clo();
        }
      });
      
      const {mutate: delC, isLoading:loadC} = useMutation((id) => deleteCommission(id),{
        onSuccess:() => {
          notifications.show({
            title: 'supprimer commission',
            message: 'le commission supprime avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
        }
      });
      const {mutate:udpC,isLoading:loaC} = useMutation((data) => updateCommission(data._id,data.val),{
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

       const updateC = (val) => {
        const {_id,...rest} = val;
        udpC({_id,val:rest});
       }
       const handleUpdate= (row) => {
        const {membres} = row;
       formC.setValues({...row,membres: membres});
       open();
       };

       const handleFormSubmit = (row) => {
        delC(row._id);
       };
       const actionTemplate =  (row) => {
        return (
            <div className="flex space-x-2">
              {/* <ActionIcon aria-label="default action icon" size="lg" bg="blue" onClick={() => handleView(row)}>
                <HiEye/>
              </ActionIcon> */}
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
    const headerTemplate = (data) => {
      return (
          <>
              <span className="">{`${data.nom_commission} / ${data.membres.length} membres`}</span>
          </>
      );
  };

    const membreTemplate = (row) => {
      return <List type="ordered">
      {row.membres.map((m,i) => (
        <List.Item key={i}>{`${i+1}) ${m.prenom}  ${m.nom}  ${m.fonction}`}</List.Item>
      ))}
    </List>
    }; 

  return (
    <>
    <LoadingOverlay
          visible={isLoadingC || loadC || loaC || Mload}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
        
    <div className='text-center  mt-4'>
        <Button className='w-45 h-12 font-bold' bg='purple' leftSection={<FcPlus/>} onClick={opo}>COMMISSION</Button>
    </div>
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <h1 className='font-bold text-3xl text-center mt-6'>COMMISSION DE RECEPTION</h1>
    </div>
    <div className="card">
    <div style={{ backgroundColor: 'var(--highlight-bg)', color: 'var(--highlight-text-color)', borderRadius: 'var(--border-radius)', padding: '3rem' }}>
  <DataTable value={Commission} rowGroupMode="subheader" groupRowsBy="nom_commission"
                    sortMode="single" sortField="nom_commission" sortOrder={1}
                    expandableRowGroups expandedRows={expandedRows} onRowToggle={(e) => setExpandedRows(e.data)}
                    rowGroupHeaderTemplate={headerTemplate}  tableStyle={{ minWidth: '50rem' }}loading={isLoading} paginator rows={6} rowsPerPageOptions={[6, 16, 26, 51]} size="small" stripedRows>
                <Column header="ANNEE COMMISSION / NOMBRE DE MEMBRE" body={membreTemplate}></Column>
                <Column header="ACTION" body={actionTemplate}  style={{ minWidth: '4rem' }}></Column>
  </DataTable> 
  </div> 
 </div>
 <Modal opened={noOpened} onClose={clo} title="">
      <form className={classes.form} onSubmit={form.onSubmit((values) => save(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UN NOUVEAU COMMISSION DE RECEPTION
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="ANNEE" placeholder="2024" required {...form.getInputProps('nom_commission')} />
          </SimpleGrid>
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
          <MultiSelect
          label="MEMBRES" 
          data={Membres?.map(e => ({label:`${e.prenom} ${e.nom}`, value:e._id}))}
          required {...form.getInputProps('membres')}/>
          
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
      <form className={classes.form}  onSubmit={formC.onSubmit((values) => updateC(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
           MISE A JOURS COMMISSION
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="NPM COMMISSION" placeholder="nom commission" required {...formC.getInputProps('nom_commission')} />
          
          </SimpleGrid>
          <TextInput mt="md" label="MEMBRES" placeholder="membres" required {...formC.getInputProps('membres')}/>
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
         
          </SimpleGrid>
         
          <Group justify="flex-end" mt="md">
          <Button type="submit" bg='cyan' className={classes.control}>
                SAUVEGARDER
              </Button>
          </Group>
          <Divider label="@CROUS/Z" labelPosition="center" my="lg" />
          </div>
        </form>
      </Drawer>
    </>
  )
}

export default Commission