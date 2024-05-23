/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { ActionIcon, Button, Divider, Group, LoadingOverlay, Modal, NumberFormatter, Select, SimpleGrid, Text, TextInput } from "@mantine/core"
import { DateInput } from "@mantine/dates";
import { useForm, zodResolver } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { format } from "date-fns";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";
import { Toolbar } from "primereact/toolbar"
import { AiFillEdit, AiOutlineEye } from "react-icons/ai";
import { FcPlus } from "react-icons/fc"
import { HiArchiveBoxXMark } from "react-icons/hi2";
import classes from './Navbarnested.module.css';
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { notifications } from "@mantine/notifications";
import { createSuivi, deleteSuivi, getSuivis, updateSuivi } from "./services/suiviservice";
import { useNavigate } from "react-router-dom";
import { FilterMatchMode } from "primereact/api";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";

const schema = z.object({
    date:z.date(),
    type:z.string(),
    description:z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    service:z.string(),
    facture:z.string(),
    montant:z.string(),
    });

function suivi() {
    
    const [OpenedS, { open:opS, close:clS }] = useDisclosure(false);
    const [YesopeneS, { open:opRS, close:cloS }] = useDisclosure(false);
    const key = 'get_suivi'; 
        const qc = useQueryClient();
        const {data: Suivi,isLoading} = useQuery(key,() => getSuivis());
        const navigate = useNavigate();
    const form = useForm({
        initialValues: {
          date:'',
          type: '',
          description: '',
          service: '',
          facture: '',
          montant: '',
          termsOfService: false,
        },
        validate: zodResolver(schema),
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const formU = useForm({
        initialValues: {
          date:'',
          type: '',
          description: '',
          service: '',
          facture: '',
          montant: '',
          termsOfService: false,
        },
        validate: zodResolver(schema),
      });
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const {mutate,isLoading:isLoadingS} = useMutation((val) => createSuivi(val),{
        onSuccess:() => {
          notifications.show({
            title: 'creation reception ',
            message: 'LA RECEPTION A ETE CREER AVEC SUCCEE',
            color: 'green'
          })
          qc.invalidateQueries(key);
          clS();
        }
      })
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const {mutate: updS,isLoading:loaDSS} = useMutation((data) => updateSuivi(data._id,data.val),{
        onSuccess:() => {
          notifications.show({
            title: 'mise a jours reception',
            message: 'reception modifier avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
          clS();
        }
      })
      const updateM = (val) => {
        const {_id,...rest} = val;
        updS({_id,val:rest});
       }
       const handleUpdate= (row) => {
        const {type} = row;
       formU.setValues({...row,type: +type});
       opRS();

       };
      
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const {mutate: delS,isLoading:loadS} = useMutation((id) => deleteSuivi(id),{
        onSuccess:() => {
          notifications.show({
            title: 'supprimer reception',
            message: 'LA RECEPTION SUPPRIMER AVEC SUCCEE',
            color: 'green'
          })
          qc.invalidateQueries(key);
        }
      });
      const save = (valeurs) => {
        mutate(valeurs);
       }
       const handleDelete  = (row) => {
        delS(row._id);
       };
       const handleView = (row) => {
        navigate(row._id)
       }
       
       const Ntemplate = (row) => <NumberFormatter  thousandSeparator 
       value={row.montant}/>
    const datetemplate = (row) => row.date && format(row.date,'dd-MM-yyyy')
    const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      'facture': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      representative: { value: null, matchMode: FilterMatchMode.IN },
      status: { value: null, matchMode: FilterMatchMode.EQUALS },
      verified: { value: null, matchMode: FilterMatchMode.EQUALS }
  });
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
};
const renderHeader = () => {
  return (
      <div className="flex justify-center">
              <TextInput leftSection={<FaSearch/>} value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Rechercher ..." />
      </div>
  );
};
    const actionTemplate = (row) => {
        return (
            <div className="flex space-x-2">
                <ActionIcon aria-label="default action icon" size="lg" bg="lime"  onClick={() => handleUpdate(row)}>
                <AiFillEdit/>
              </ActionIcon>
              <ActionIcon aria-label="default action icon" size="lg" bg="red" onClick={() => handleDelete(row)} >
                <HiArchiveBoxXMark/>
              </ActionIcon>
              <ActionIcon aria-label="default action icon" size="lg" bg="blue" onClick={() => handleView(row)}>
              <AiOutlineEye/>
              </ActionIcon>
                {/* <Button icon="pi pi-pencil"  className='w-8 h-8 font-bold' bg='green' style={{ marginRight: '8px' }} leftSection={<AiFillEdit/>}></Button> */}
                {/* <Button icon="pi pi-pencil" className='w-8 h-8 font-bold' bg='red' leftSection={<HiArchiveBoxXMark/>}></Button> */}
             
            </div>
        );
    };
    const centerContent = (
        <span >
            <i />
            <InputText placeholder="Recherc..." className='w-30 h-10 font-bold'/>
        </span>

    );
    const header = renderHeader();
  return (
    <>
    <LoadingOverlay
          visible={isLoadingS || loadS || loaDSS}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
     <div className='text-center  mt-4'>
            <Button className='w-45 h-12 font-bold ' bg='blue' leftSection={<FcPlus/>} onClick={opS}>RECEPTION TECHNIQUE</Button>    
        </div>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <h1 className='font-bold text-3xl text-center mt-6'>LES RECEPTIONS TECHNIQUES</h1>
        <div className="card">
            <Toolbar  center={centerContent} />
        </div>
        <div className="card mt-4">
            <DataTable filters={filters} value={Suivi} tableStyle={{ minWidth: '50rem' }} loading={isLoading} paginator rows={5} 
             globalFilterFields={['date','type', 'facture', 'description']} header={header} rowsPerPageOptions={[5, 10, 25, 50]} size="small" stripedRows>
                <Column field="date" header="DATE"body={datetemplate}></Column>
                <Column field="type" header="TYPE" ></Column>
                <Column field="description" header="DESCRIPTION" ></Column>
                <Column field="service" header="PRESTATAIRE"></Column>
                <Column field="facture" header="FACTURE"></Column>
                <Column field="montant" header="MONTANT" body={Ntemplate}></Column>
                <Column header="ACTION" body={actionTemplate} style={{ minWidth: '4rem' }} ></Column>
            </DataTable>
        </div>
            </div> 
            <Modal opened={OpenedS} onClose={clS} title="">
                <form action="" onSubmit={form.onSubmit((values) => save(values))}>
                <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UN NOUVELLE RECEPTION TECHNIQUE
          </Text>
          <div>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <DateInput label="DATE" placeholder="date" locale='fr' required {...form.getInputProps('date')}/>
          <Select  
          label="TYPE" 
          comboboxProps={{ withinPortal: true }}
          data={['ENTRETIEN', 'REFECTION', 'CONSTRUCTION','SERVICE RESTAURATION','SERVICE HEBERGEMENT','SERVICE HEBERGEMENT ET RESTAURATION','VIDANCE']}
          required {...form.getInputProps('type')}/>
           <TextInput label="DESCRIPTION" placeholder="description" required {...form.getInputProps('description')}/>
           <TextInput label="PRESTATAIRE" placeholder="service" required {...form.getInputProps('service')}/>
           <TextInput label="FACTURE" placeholder="facture" required {...form.getInputProps('facture')}/>
           <TextInput label="MONTANT" placeholder="montant" required {...form.getInputProps('montant')}/>
          </SimpleGrid>
          <Group justify="flex-end" mt="md" >
          <Button type="submit" bg='cyan'className={classes.control} >
                ENREGISTRER
              </Button>
          </Group>
          <Divider label="@CROUS/Z" labelPosition="center" my="lg" />
          </div>
                </form>
            </Modal>

            <Modal opened={YesopeneS} onClose={cloS} title="">
                <form action="" onSubmit={formU.onSubmit((values) => updateM(values))}>
                <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UNE NOUVELLE RECEPTION TECHNIQUE
          </Text>
          <div>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <DateInput label="DATE" placeholder="date" locale='fr' required {...formU.getInputProps('date')}/>
          <Select  
          label="TYPE" 
          comboboxProps={{ withinPortal: true }}
          data={['ENTRETIEN', 'REFECTION', 'CONSTRUCTION', 'SERVICE RESTAURATION','SERVICE HEBERGEMENT','SERVICE HEBERGEMENT ET RESTAURATION','VIDANCE']}
          required {...formU.getInputProps('type')}/>
           <TextInput label="DESCRIPTION" placeholder="description" required {...formU.getInputProps('description')}/>
           <TextInput label="PRESTATAIRE" placeholder="service" required {...formU.getInputProps('service')}/>
           <TextInput label="FACTURE" placeholder="facture" required {...formU.getInputProps('facture')}/>
           <TextInput label="MONTANT" placeholder="montant" required {...formU.getInputProps('montant')}/>
          </SimpleGrid>
          <Group justify="flex-end" mt="md" >
          <Button type="submit" bg='cyan'className={classes.control} >
                ENREGISTRER
              </Button>
          </Group>
          <Divider label="@CROUS/Z" labelPosition="center" my="lg" />
          </div>
                </form>
            </Modal>

            
    </>
  )
}

export default suivi