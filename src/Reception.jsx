

import { ActionIcon, Autocomplete, Badge, Button, Divider, Drawer, Group, LoadingOverlay, Modal, MultiSelect, NumberInput, Select, SimpleGrid, Text, TextInput } from '@mantine/core'
import { DataTable } from 'primereact/datatable';
import { FcPlus} from "react-icons/fc";
import { Column } from 'primereact/column';
import { randomId, useDisclosure } from '@mantine/hooks';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createReception, deleteReception, getReceptions, updateReception } from './services/receptionservice';
import { zodResolver } from 'mantine-form-zod-resolver';
import { useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import classes from './Navbarnested.module.css';
import { AiFillEdit, AiOutlineEye } from 'react-icons/ai';
import { HiArchiveBoxXMark } from 'react-icons/hi2';
import { getProdits } from './services/produitsservice';
import { getCommissions } from './services/commissionservice';
import { useNavigate } from 'react-router-dom';
import { DateInput } from '@mantine/dates';
import { format } from 'date-fns';
import { getFournisseur } from './services/fournisseurservice';
import { IconTrash } from '@tabler/icons-react';
import { FilterMatchMode } from 'primereact/api';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';
import { TfiWrite } from 'react-icons/tfi';
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "./vfs_fonts";
pdfMake.vfs = font




const schema = z.object({
    date:z.date(),
    numero_bon:z.string(),
    type:z.string()
    .min({3: 'entrez minumum 3 lettres' }),
    produits:z.array(z.object({produit:z.string(),qte:z.number()}))
    .min({3: 'entrez minumum 3 lettres' }),
    commission:z.string(),
    fournisseur:z.string(),
    });

    function Reception(){
        const [Opened, { open, close }] = useDisclosure(false);
        const [Yesopened, { open: opR, close:clR }] = useDisclosure(false);
        const key = 'get_Reception';
        const qc = useQueryClient();
        const {data: Reception,isLoading} = useQuery(key,() => getReceptions());
        const keyP = 'get_Produits';
        const {data: Produits} = useQuery(keyP,() => getProdits());
        const keyCo = 'get_Commissions';
        const {data: Commissions,isLoading: Mload} = useQuery(keyCo,() => getCommissions());
        const navigate = useNavigate();
        const keyA = 'get_Fournisseur';
    const {data: Fournisseur,isLoading:loadiAC} = useQuery(keyA,() => getFournisseur());
        
        const form = useForm({
            initialValues: {
              date:'',
              numero_bon: '',
              type: '',
              produits: [{ produit: '', qte: 0, key: randomId() }],
              commission: '',
              fournisseur: '',
             },
            validate: zodResolver(schema),
          });
          const formU = useForm({
            initialValues: {
              date:'',
              numero_bon:'',
              type: '',
              produits:[{ produit: '', qte: 0, key: randomId() }],
              commission: '',
              fournisseur: '',
            },
            validate: zodResolver(schema),
          });
          const {mutate,isLoading:isLoadingR} = useMutation((val) => createReception(val),{
            onSuccess:() => {
              notifications.show({
                title: 'creation produits',
                message: 'le produits a ete cree avec succee',
                color: 'green'
              })
              qc.invalidateQueries(key);
              close();
            }
          })
          const {mutate: delR,isLoading:loadR} = useMutation((id) => deleteReception(id),{
            onSuccess:() => {
              notifications.show({
                title: 'supprimer produits',
                message: 'le produits supprime avec succee',
                color: 'green'
              })
              qc.invalidateQueries(key);
            }
          });
          const {mutate: updR,isLoading:loaR} = useMutation((data) => updateReception(data._id,data.val),{
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
          const save = (valeurs) => {
            valeurs.produits = valeurs.produits.map(p => ({produit:p.produit,qte:p.qte}))
            mutate(valeurs);
           }
           const handleUpdate= (row) => {
            const {numero_bon,date,commission} = row;
           formU.setValues({...row,numero_bon: +numero_bon, date: +date, commission:+commission});
           opR();

           };
           const updateM = (val) => {
            const {_id,...rest} = val;
            updR({_id,val:rest});
           }

           const handleDelete  = (row) => {
            delR(row._id);
           };
           const handleView = (row) => {
            navigate(row._id)
           }
           const datetemplate = (row) => row.date && format(row.date,'dd-MM-yyyy')
           const [filters, setFilters] = useState({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
            'catalogue': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
        
            
           const aTemplate = (row) =>  <Badge
size="xl"
variant="gradient"
gradient={{ from: 'blue', to: 'green', deg: 50 }}
>
{row.numero_bon}
</Badge>
           const actionTemplate = (row) => {
            return (
                <div className="flex space-x-2">
                    <ActionIcon aria-label="default action icon" size="lg" bg="lime" onClick={() => handleUpdate(row)}>
                    <AiFillEdit/>
                  </ActionIcon>
                  <ActionIcon aria-label="default action icon" size="lg" bg="red" onClick={() => handleDelete(row)}>
                    <HiArchiveBoxXMark/>
                  </ActionIcon>
                  <ActionIcon aria-label="default action icon" size="lg" bg="blue" onClick={() => handleView(row)}>
                  <AiOutlineEye/>
                  </ActionIcon>              
                </div>
            );          
        };
      const produits = form.values.produits.map((item, index,arr) => (
        <div key={item.key} className='flex space-x-1 my-1 items-center justify-center'>
           <Select 
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
      const generer = () => {
        var dd = {      
            content: [
              {
                columns: [
                  {   
                    
                    stack: [                        
                        {text: 'REPUBLIQUE DU SENEGAL ', fontSize: 13, bold: true, alignment:'center'},
                        {text: 'Un Peuple - Un But - Une Foi', fontSize: 12, bold: false, alignment:'center'},
         
              {text: 'MINISTERE DE L ENSEIGNEMENT SUPERIEUR, DE LA RECHERCHE ET DE L INNOVATION', fontSize: 10, bold: false, alignment:'center'},
              {text: '--------------', fontSize: 12, bold: false, alignment:'center'},
              {text: 'CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR (CROUS/Z)', fontSize: 10, bold: false, alignment:'center'},
      
                      ]
                      
                    
                  },
                
               
                ]
              },
            
                {
                  style: 'tableExample',
                  fillColor:'#c026d3',
                  margin: [20, 10],
                  table: {
                    widths: ['*'],
                    body: [
                      [{text: 'INVENTAIRE DES RECEPTIONS',color:'white', fontSize: 18, bold: true, alignment:'center'}],
                    ]
                  }
                },

                Reception.map(c => ({
                  stack:[
                    {text: `\n\n\nLa rececption du ${format(c.date,'dd/MM/yyyy')}\n\n`, fontSize: 12, bold: true, alignment:'center'},
                    {
                      style: 'tableExample',
                      color: '#444',
                      alignment:'center',
                      bold:true,
                      table: {
                        widths: ['40%', '15%', '15%','30%'],                    
                        body: [
                          [{ text:'MATIERES',style: 'tablevbHeader'}, 'QUANTITE', 'PRIX UNITAIRE','FOURNISSEUR'],
                           // eslint-disable-next-line no-unsafe-optional-chaining
                           ...Reception.map(m =>{ 
                              return  [`${m.qte}`, `${m.catalogue}`, m.type,m.fournisseur];
                          })
                      ]              
                      }
                    },
                    {text:  `\n\n${Produits?.length} MATIERES SONT DISPONIBLE DANS NOTRE STOCK`,color:'red', fontSize: 12, bold: true, alignment:'justify'},
                  ]
                 }))
                
               
            
               
            ],
            styles: {
                header: {
                    fontSize: 18,
                    bold: true
                },
                subheader: {
                    fontSize: 15,
                    bold: true,
                    
                   
                },
                
                quote: {
                    italics: true
                },
                img: {
                    fontSize: 8
                },
                defaultStyle: {
                  columnGap: 20
                }
               
            }  
            
        }
        pdfMake.createPdf(dd).open();
    }

      const header = renderHeader();
      return (
        <>
        <LoadingOverlay
          visible={isLoadingR || loadR|| loaR || Mload || loadiAC}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
         <div className="flex items-center justify-between px-20 mt-4 ">
            <Button className='w-45 h-12 font-bold ' bg='orange' leftSection={<FcPlus/>} onClick={open}>NOUVELLE RECEPTION</Button>
            <Button className='w-45 h-12 font-bold ' bg='green' leftSection={<TfiWrite/>} onClick={() => generer()}>INVENTAIRE DES RECEPTION</Button> 
        </div> 
        
        <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
            <h1 className='font-bold text-3xl text-center mt-6'>LES RECEPTIONS</h1>
       <div className="card">

        </div>
        <div className="card mt-4">
        <div style={{ backgroundColor: 'var(--highlight-bg)', color: 'var(--highlight-text-color)', borderRadius: 'var(--border-radius)', padding: '0.5rem' }}>
            <DataTable  filters={filters} value={Reception} tableStyle={{ minWidth: '50rem' }} loading={isLoading} paginator rows={5} rowsPerPageOptions={[5, 10, 25, 50]} size="small" 
            globalFilterFields={['type','numero_bon', 'type', 'fournisseur']} header={header} stripedRows>
                <Column field="date" header="DATE" body={datetemplate} ></Column>
                <Column field="numero_bon" header="NUMERO DE BON" body={aTemplate}></Column>
                <Column field="type" header="TYPE" ></Column>
                {/* <Column field="produits" header="PRODUIT" ></Column> */}
                <Column field="commission.nom_commission" header="COMMISSION"></Column>
                <Column field="fournisseur" header="FOURNISSEUR"></Column>
                <Column header="ACTION" body={actionTemplate} style={{ minWidth: '4rem' }} ></Column>
            </DataTable>
        </div>
        </div>
        </div>
        <Modal opened={Opened} size='lg' onClose={close} title="">
        <form  className={classes.form} onSubmit={form.onSubmit((values) => save(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UNE NOUVELLE RECEPTION
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <DateInput label="DATE" placeholder="date" locale='fr' required {...form.getInputProps('date')}/>
          <TextInput label="NUMERO BON" placeholder="numero bon" required {...form.getInputProps('numero_bon')}/>
          <Select  
          label="TYPE" 
          comboboxProps={{ withinPortal: true }}
          data={['PRET', 'COMMANDE', 'DON']}
          required {...form.getInputProps('type')}/>
           <Select 
          label="COMMISSION" placeholder="commission"  
          data={Commissions?.map(e => ({label:e.nom_commission, value:e._id}))}
          required {...form.getInputProps('commission')}/>
           <Autocomplete 
          placeholder="fournisseur" 
          label="FOURNISSEUR" 
          comboboxProps={{ withinPortal: true }}
          data={Fournisseur?.map(e => ({label:e.nom_entreprise, value:e._id}))} 
          required {...form.getInputProps('fournisseur')} /> 
            </SimpleGrid>   
            {produits}
          <Group justify="flex-end" mt="md" >
          <Button type="submit" bg='cyan'className={classes.control} >
                ENREGISTRER
              </Button>
          </Group>
          <Divider label="@CROUS/Z" labelPosition="center" my="lg" />
          </div>
        </form>
        </Modal>

        <Drawer offset={8} radius="md" opened={Yesopened} position="right" onClose={clR} title="Mise a jour reception">
      <form className={classes.form}  onSubmit={formU.onSubmit((values) => updateM(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            MODIFIER RECEPTION
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <DateInput label="DATE" placeholder="date" locale='fr' required {...formU.getInputProps('date')}/>
          <NumberInput label="NUMERO BON" placeholder="numero bon" required {...formU.getInputProps('numero_bon')}/>
          <Select  
          label="TYPE" 
          comboboxProps={{ withinPortal: true }}
          data={['PRET', 'COMMANDE', 'DON']}
          required {...formU.getInputProps('type')}/>
           <MultiSelect
          label="MATIERE"  mt="md"
          comboboxProps={{ withinPortal: true }}
          data={Produits?.map(e => ({label:e.catalogue, value:e._id}))}
          required {...formU.getInputProps('produits')}/>
          <NumberInput label="QUANTITE" placeholder="quantite" required {...formU.getInputProps('qte')}/>
          <Select 
          label="COMMISSION" placeholder="commission" mt="md" 
          data={Commissions?.map(e => ({label:e.nom_commission, value:e._id}))}
          required {...form.getInputProps('commission')}/>
            </SimpleGrid>
            <TextInput label="FOURNISSEUR" placeholder="fourniiseur" required {...formU.getInputProps('fournisseur')}/>
          <Group justify="flex-end" mt="md" >
          <Button type="submit" bg='cyan'className={classes.control}>
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
    
    export default Reception


