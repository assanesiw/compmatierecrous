/* eslint-disable no-unused-vars */
import { ActionIcon, Button, Divider, Drawer, Group, LoadingOverlay, Modal, NumberInput, Select, SimpleGrid, Text, TextInput} from "@mantine/core"
import { randomId, useDisclosure } from "@mantine/hooks";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { AiFillEdit, AiOutlineArrowUp, AiOutlineEye } from "react-icons/ai";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod";
import { createAttribution, deleteAttribution, getAttribution, getAttributions, updateAttribution } from "./services/attributionservice";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import classes from './Navbarnested.module.css';
import { getProdits } from "./services/produitsservice";
import { format } from "date-fns";
import { DateInput } from "@mantine/dates";
import { useNavigate } from 'react-router-dom';
import { IconTrash } from "@tabler/icons-react";
import { FcPlus } from "react-icons/fc";
import { FilterMatchMode } from "primereact/api";
import { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useStore } from "./store";
import { Segmented } from "antd";






const schema = z.object ({
  date: z.date(),
  produits:z.array(z.object({produit:z.string(),qte:z.number(),key:z.string()}))
  .min({3: 'entrez minumum 3 lettres' }),
    remis: z.string()
    .min(3, { message: 'entrez minumum 3 lettres' }),
    section: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    sortis: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    bon: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    ordre: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    });

function Attribution() {
    const [noTransitionOpened, { open:op, close:cl }] = useDisclosure(false);
    const [openeA, { open, close:cloA }] = useDisclosure(false);
    const key = 'get_Attribution';
    const qc = useQueryClient();
    const {data: Attribution,isLoading} = useQuery(key,() => getAttributions());
    const keyA = 'get_Produits';
    const {data: Produits,isLoading:loadiA} = useQuery(keyA,() => getProdits());
    const navigate = useNavigate();
    const role = useStore((state) => state.role);
    
    const form = useForm({
      initialValues: {
        date: '',
        produits:[{ produit: '', qte: 0, key: randomId() }],
        remis: '',
        section: '',
        bon: '',
        sortis: '',
        ordre: '',
      },
      validate: zodResolver(schema),
    });
    const formA = useForm({
      initialValues: {
        date: '',
        produits:[{ produit: '', qte: 0, key: randomId() }],
        remis: '',
        section: '',
        bon: '',
        sortis: '',
        ordre: '',
      },
      validate: zodResolver(schema),
    });
    const {mutate,isLoading:isLoadingC} = useMutation((val) => createAttribution(val),{
        onSuccess:() => {
          notifications.show({
            title: 'creation attribution',
            message: 'attribution a ete cree avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
          cl();
        },
        onError:console.log

      });
      const {mutate: delA,isLoading:loadA} = useMutation((id) => deleteAttribution(id),{
        onSuccess:() => {
          notifications.show({
            title: 'supprimer attribution',
            message: 'attribution supprime avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
        }
      });
      const {mutate: updA,isLoading:loaA} = useMutation((data) => updateAttribution(data._id,data.val),{
        onSuccess:() => {
          notifications.show({
            title: 'mise a jours atttibution',
            message: 'attribution modifiee avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
          close();
        }
      })
      const save = (valeurs) => {
       
       valeurs.produits = valeurs.produits.map(p => ({produit:p.produit,qte:p.qte}))
        mutate(valeurs);
       }
    const updateA = (val) => {
      const {_id,...rest} = val;
      updA({_id,val:rest});
     }
     const handleUpdate= (row) => {
      const {date,quantite,sortis} = row;
     formA.setValues({...row,date: +date,quantite: +quantite,sortis: +sortis});
     open();
     };
    const handleFormSubmit  = (row) => {
      delA(row._id);
     };
     const handleView = (row) => {
      navigate(row._id)
     }
     const datetemplate = (row) => format(row.date,'dd/MM/yyyy')

     const [filters, setFilters] = useState({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
      'remis': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
        return  <>
         {role === 'csa'|| role === 'dg'  ? <div className="flex space-x-2"> 
          <ActionIcon aria-label="default action icon" size="lg" bg="blue" onClick={() => handleView(row)}>
                  <AiOutlineEye/>
                  </ActionIcon>
         <Segmented 
         value={row.est_valide}
    options={[{label:'Accepte', value: true,className:row.est_valide && 'bg-green-500'},{label:'Rejete',value: false}]}
    onChange={(value) => {
     updA({_id:row._id,val: {est_valide:value}});
    }}
  /></div> : <>
           <div className="flex space-x-2">
           <ActionIcon aria-label="default action icon" size="lg" bg="blue" onClick={() => handleView(row)}>
                  <AiOutlineEye/>
                  </ActionIcon>
                <ActionIcon aria-label="default action icon" size="lg" bg="lime" onClick={() => handleUpdate(row)}>
                <AiFillEdit/>
              </ActionIcon>
              <ActionIcon aria-label="default action icon" size="lg" bg="red" onClick={() => handleFormSubmit (row)}>
                <HiArchiveBoxXMark/>
              </ActionIcon>
             
            </div>
          </>}
        </>;
    };
    const produits = form.values.produits.map((item, index,arr) =>(
      <div key={item.key} className='flex space-x-1 my-1 items-center justify-center'>
         <Select searchable 
          label="MATIERE" placeholder="matiere" className='w-2/3'   withAsterisk
          data={Produits?.map(e => ({label:e.catalogue, value:e._id}))}
          required  {...form.getInputProps(`produits.${index}.produit`)}/>
          <NumberInput label="QUANTITE" className='w-1/3'  placeholder="quantite" required {...form.getInputProps(`produits.${index}.qte`)}/>
          {arr.length > 1 && <ActionIcon className='mt-5' bg='red' color="white" onClick={() => form.removeListItem('produits', index)}>
            <IconTrash size="1rem" />
          </ActionIcon>}
          <ActionIcon className='mt-5' aria-label="default action icon" size="lg" bg="cyan"  onClick={() =>
            form.insertListItem('produits', { produit: '', qte:0, key: randomId() })
          }>
                    <FcPlus/>
                  </ActionIcon>
      </div>
    ));
    const header = renderHeader();
  return (
    <>
    <LoadingOverlay
          visible={isLoadingC || loadA || loaA || loadiA}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
    <div className="text-center  mt-4">
    <Button className='w-45 h-12 font-bold' bg='yellow' leftSection={<AiOutlineArrowUp />} onClick={op} >GERER UNE ATTRIBUTION</Button>  
    </div>
    <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
        <h1 className='font-bold text-3xl text-center mt-6'>LES SORTIES</h1>
    </div>
    <div className="card">
        <DataTable filters={filters} value={Attribution} tableStyle={{ minWidth: '6rem' }} loading={isLoading} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} 
        globalFilterFields={['date','remis', 'bon', 'sortis']} header={header} size="small" stripedRows>
          <Column field="date" header="DATE" body={datetemplate}></Column> 
          <Column field="remis" header="BENEFICIAIRE"></Column>
          <Column field="section" header="DIVISION OU SERVICE"></Column>
          <Column field="bon" header="B_A"></Column>
          <Column field="sortis" header="TYPE"></Column>
          <Column header="ACTION"  body={actionTemplate} style={{ minWidth: '4rem' }}></Column>
        </DataTable>
    </div>
     
     <Modal title="" opened={noTransitionOpened} onClose={cl} >
        <form className={classes.form} onSubmit={form.onSubmit(save)}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            NOUVELLE ATTRIBUTION
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <DateInput label="DATE" placeholder="date" locale="fr" required {...form.getInputProps('date')} />
          <TextInput label="BENEFICAIRE" placeholder="remis" required {...form.getInputProps('remis')}/>
          <TextInput label="DIVISION OU SERVICE" placeholder="section" required {...form.getInputProps('section')}/>
          <Select  
          label="TYPE" 
          comboboxProps={{ withinPortal: true }}
          data={['PROVISOIRE', 'DEFINITIVE']}
          required {...form.getInputProps('sortis')}/>
          </SimpleGrid>
          {produits}
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}> 
          <TextInput label="BA ou BL" placeholder="BA OU BL" required {...form.getInputProps('bon')}/>
          <TextInput label="ORDRE" placeholder="ordre"  required {...form.getInputProps('ordre')}/>
          </SimpleGrid>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
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


     <Drawer title="" opened={openeA} onClose={cloA} position="right">
        <form className={classes.form} action="" onSubmit={formA.onSubmit((values) => updateA(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            MISE A JOURS
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <DateInput label="DATE" placeholder="date" locale="fr" required {...formA.getInputProps('date')} />
          <Select
          label="MATIERE" 
          comboboxProps={{ withinPortal: true }}
          data={Produits?.map(e => ({label:e.catalogue, value:e._id}))}
          required {...form.getInputProps('produits')}/>
          <NumberInput label="QUANTITE" placeholder="quantite" required {...formA.getInputProps('quantite')}/>
          <TextInput label="REMIS" placeholder="remis" required {...formA.getInputProps('remis')}  />
          <TextInput label="SECTION" placeholder="section" required {...formA.getInputProps('section')}/>
          <Select  
          label="TYPE" 
          comboboxProps={{ withinPortal: true }}
          data={['PROVISOIRE', 'DEFINITIVE']}
          required {...formA.getInputProps('sortis')}/>
          </SimpleGrid>
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}> 
          <TextInput label="BA ou BL" placeholder="BA OU BL" required {...formA.getInputProps('bon')}/>
          <TextInput label="ORDRE" placeholder="ordre"  required {...formA.getInputProps('ordre')}/>
          </SimpleGrid>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>  
          </SimpleGrid>

          <Group justify="flex-end" mt="md">
          <Button type="submit" bg='cyan' className={classes.control}>
                MODIFIER
              </Button>
          </Group>
          <Divider label="@CROUS/Z" labelPosition="center" my="lg" />
          </div>
        </form>
     </Drawer>

     
    </>
  )
}

export default Attribution