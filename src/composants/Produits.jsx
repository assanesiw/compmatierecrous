/* eslint-disable no-unused-vars */
import { ActionIcon, Autocomplete, Badge, Button, Divider, Drawer, Group, LoadingOverlay, Modal, NumberFormatter, NumberInput, Select, SimpleGrid, Text, TextInput, Textarea } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IoMdAdd } from "react-icons/io";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { AiFillEdit, AiOutlineEye } from "react-icons/ai";
import { FaSearch } from "react-icons/fa";
import classes from '../Navbarnested.module.css';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createProduits, deleteProduits, getProdits, updateProduits } from "../services/produitsservice";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { zodResolver } from "mantine-form-zod-resolver";
import '@mantine/notifications/styles.css';
import { notifications } from "@mantine/notifications";
import { TfiWrite } from "react-icons/tfi";
import { format } from "date-fns";
import { DateInput } from "@mantine/dates";
import 'dayjs/locale/fr'
import { getCatalogue } from "../services/catalogueservice";
import { FilterMatchMode } from "primereact/api";
import { useState } from "react";
import { useNavigate} from 'react-router-dom';
import { Avatar } from "antd";
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "../vfs_fonts";
pdfMake.vfs = font;




const schema = z.object({
  date: z
  .date(),
  catalogue: z
    .string()
    .min(3, { message: 'entrez minumum 3 lettres' }),
    cat: z
    .string()
    .min(3, { message: 'entrez minumum 3 lettres' }),
    quantite: z.number(),
  uniteConditionnement: z.string()
  .min({3: 'entrez minumum 3 lettres' }),
  emplacement: z.string(),
  prixUnitaire: z.number(),
  observation: z.string()
    .min({3: 'entrez minumum 3 lettres' }),
  });
 

function Produits() {
    const [noTransitionOpened, { open:op, close:cl }] = useDisclosure(false);
    const [opened, { open, close }] = useDisclosure(false);
    const key = 'get_Produits';
    const qc = useQueryClient();
    const {data: Produits,isLoading} = useQuery(key,() => getProdits(),{
      onError:console.log,
      onSuccess:console.log
    });
    const keyA = 'get_Catalogue';
    const navigate = useNavigate();
    const {data: Catalogue,isLoading:loadiAC} = useQuery(keyA,() => getCatalogue());
    const footer = `NOUS AVONS REPERTORIE ${Produits ? Produits.length : 0} TYPES DE MATIERES.`;
    const form = useForm({
      initialValues: {
        date: '',
        catalogue: '',
        cat: '',
        quantite: 0,
        uniteConditionnement: '',
        emplacement: '',
        prixUnitaire: 0,
        observation: '',
        termsOfService: false,
      },
      validate: zodResolver(schema),
    });
   
    
    const formatNumber = (n) => String(n).replace(/(.)(?=(\d{3})+$)/g,'$1 ')

    const formU = useForm({
      initialValues: {
        date:'',
        catalogue: '',
        cat: '',
        quantite: 0,
        _id:'',
        uniteConditionnement: '',
        emplacement: '',
        prixUnitaire: 0,
        observation: '',
        termsOfService: false,
      },
      validate: zodResolver(schema),
    });
    const {mutate,isLoading:isLoadingC} = useMutation((val) => createProduits(val),{
      onSuccess:() => {
        notifications.show({
          title: 'creation produits',
          message: 'le produits a ete cree avec succee',
          color: 'green'
        })
        qc.invalidateQueries(key);
        cl();
      }
    });

    const {mutate: del,isLoading:load} = useMutation((id) => deleteProduits(id),{
      onSuccess:() => {
        notifications.show({
          title: 'supprimer produits',
          message: 'le produits supprime avec succee',
          color: 'green'
        })
        qc.invalidateQueries(key);
      }
    });
    const {mutate: upd,isLoading:loa} = useMutation((data) => updateProduits(data._id,data.val),{
      onSuccess:() => {
        notifications.show({
          title: 'mise a jours matiere',
          message: 'matiere modifier avec succee',
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
    upd({_id,val:rest});
   }
      const handleFormSubmit  = (row) => {
       del(row._id);
      };

      const handleUpdate= (row) => {
        const {quantite,prixUnitaire,date} = row;
       formU.setValues({...row,quantite: +quantite,prixUnitaire: +prixUnitaire, date: +date});
       open();
       };

       const handleView = (row) => {
        navigate('produits/' + row._id);
       }
    
       const datetemplate = (row) => format(row.date,'dd-MM-yyyy')

       const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
        'numero_bon': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
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
              <ActionIcon aria-label="default action icon" size="lg" bg="lime" onClick={() => handleUpdate(row)}>
              <AiFillEdit/>
            </ActionIcon>
            <ActionIcon aria-label="default action icon" size="lg" bg="red" onClick={() => handleFormSubmit (row)}>
              <HiArchiveBoxXMark/>
            </ActionIcon>
            <ActionIcon aria-label="default action icon" size="lg" bg="blue" onClick={() => handleView(row)}>
                  <AiOutlineEye/>
                  </ActionIcon>
              
              
          </div>
      );
      
  };
 

const qttTemplte = ({quantite}) => {
  let color = 'red';
 if(quantite > 10){
  color = 'green';
 }
 else if(quantite >= 5 && quantite <= 10) {
  color = 'orange';
 }
return <Badge size="xxl" color={color} circle>{quantite}</Badge>
}
  
const aTemplate = (row) =>  <Badge
size="xl"
variant="gradient"
gradient={{ from: 'blue', to: 'green', deg: 50 }}
>
{row.catalogue}
</Badge>
const proTemplate = (row) =>   <Avatar src={`${import.meta.env.VITE_COMP}/uploads/produits/${row?.photo}`} 
 size={55} radius='xs'/>
const Ntemplate = (row) => <NumberFormatter  thousandSeparator=' ' 
      value={row.prixUnitaire}/>
      const header = renderHeader();

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
                      [{text: 'INVENTAIRE DES MATIERES DANS LE STOCK',color:'white', fontSize: 18, bold: true, alignment:'center'}],
                    ]
                  }
                },
                
               Catalogue.map(c => {
                const P = Produits.filter(p => p.cat._id === c._id);
                return {stack:[
                  {text: `\n\n\n${c.categorie}\n\n`, fontSize: 12, bold: true, alignment:'center'},
                  {
                    style: 'tableExample',
                    color: '#444',
                    alignment:'center',
                    bold:true,
                    table: {
                      widths: ['25%', '10%', '15%','20%','15%','15%'],
                      
                      // keepWithHeaderRows: 1,
                      body: [
                        [{text: 'MATIERE', style: 'tableHeader', alignment: 'center', bold:true}, {text: 'QUANTITE', bold:true, style: 'tableHeader', alignment: 'center'},{text: 'PRIX UNITAIRE', style: 'tableHeader', alignment: 'center', bold:true},{text: 'MONTANT', style: 'tableHeader', alignment: 'center', bold:true},{text: 'EMPLACEMENT', style: 'tableHeader', alignment: 'center', bold:true},{text: 'OBSERVATION', style: 'tableHeader', alignment: 'center', bold:true}],
                       ...P.map(p =>  [{text: p.catalogue, style: 'tableHeader', alignment: 'center', bold:true}, {text: `${p.quantite}`, bold:true, style: 'tableHeader', alignment: 'center'},{text: formatNumber(p.prixUnitaire), style: 'tableHeader', alignment: 'center', bold:true},{text: formatNumber(`${(p.quantite)*(p.prixUnitaire)}`), bold:true, style: 'tableHeader', alignment: 'center'},{text: p.emplacement, style: 'tableHeader', alignment: 'center', bold:true},{text: p.observation, style: 'tableHeader', alignment: 'center', bold:true}])
                  ]                               
                    }                    
                  },
                  {
                    columns: [
                      {   
                        
                        stack: [                        
                            {text: '\nTOTAL ', fontSize: 13, bold: true, alignment:'justify'},
                          
                          ]
                          
                        
                      },
                    
                      {
                        text: ''
                      },
                      {
                       
                        text: [
                            
                        
                          
                          
                        ]
                      }
                    ]
                  },

                  
                  {text:  `\n\n${P?.length} ${c.categorie}(S) SONT DISPONIBLES DANS NOTRE STOCK`,color:'blue', fontSize: 12, bold: true, alignment:'justify'},
                
                  {svg: '<svg width="400" height="50"><line x1="100" y1="50" x2="500" y2="50" style="stroke:#c026d3; stroke-width:3;" /></svg>'}
                ]
                
         } })          
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

  return (
    <>
    <LoadingOverlay
          visible={isLoadingC || load || loa || loadiAC}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
        <div className="flex items-center justify-between px-20 mt-4 ">
        <Button className='w-45 h-12 font-bold ' bg='cyan' leftSection ={<IoMdAdd/>} onClick={op}>UNE NOUVELLE MATIERE</Button>
        <Button className='w-45 h-12 font-bold ' bg='green' leftSection ={<TfiWrite/>} onClick={() => generer()}>INVENTAIRE DU STOCK</Button>
 
 </div>
    
 <div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
  <h1 className='font-bold text-3xl text-center mt-6'>LES MATIERES DISPONIBLES DANS LE STOCK</h1>
  <div className="card">
            
        </div>
 <div className="card mt-6" >
  <DataTable  filters={filters} footer={footer} value={Produits} tableStyle={{ minWidth: '30rem' }} loading={isLoading} paginator rows={8} rowsPerPageOptions={[6, 16, 26, 51]} size="small" 
   globalFilterFields={['date','catalogue', 'emplacement', 'prixUnitaire']} header={header} stripedRows>
                {/*  <Column field="date" header="DATE" body={datetemplate}></Column>  */}
                {/*  <Column field="cat" header="CATEGORIE" body={datetemplate}></Column>  */}
                <Column field="photo" header="PRODUIT" body={proTemplate}></Column>
                <Column field="catalogue" header="LIBELLE" body={aTemplate}></Column>
                <Column field="quantite" header="STOCK" body={qttTemplte}  ></Column>
                <Column field="uniteConditionnement" header="UNITE"></Column>
                <Column field="emplacement" header="EMPLACEMENT"  ></Column>
                <Column field="prixUnitaire" header="PRIX UNITAIRE" body={Ntemplate}></Column>
               {/*  <Column field="observation" header="OBSERVATION"></Column>  */}
                <Column header="ACTION"  body={actionTemplate} style={{ minWidth: '4rem' }}></Column>
  </DataTable> 
 </div>
 </div>
 
 <Modal opened={noTransitionOpened} size='lg' onClose={cl} title="">
      <form className={classes.form}  onSubmit={form.onSubmit((values) => save(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UN NOUVEAU PRODUIT
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <DateInput label="DATE" placeholder="date"  locale="fr" required {...form.getInputProps('date')} />
        
          <Autocomplete 
          placeholder="libelle"
          label="LIBELLE" 
          comboboxProps={{ withinPortal: true }}
          data={Produits?.map(e => ({label:e.catalogue, value:e._id}))} 
          required {...form.getInputProps('catalogue')} />
        <Select 
          placeholder="categorie"
          label="CATEGORIE" 
          searchable
          data={Catalogue?.map(e => ({label:e.categorie, value:e._id}))} 
          required {...form.getInputProps('cat')} />
          
          <TextInput label="UNITE CONDITIONNEMENT" placeholder="unite de conditionnement" required {...form.getInputProps('uniteConditionnement')}/>
          </SimpleGrid>
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
          <Select  
          label="EMPLACEMENT" 
          comboboxProps={{ withinPortal: true }}
          data={['magasin 1', 'magasin 2', 'magasin 3', 'magasin 4', 'magasin 5', 'magasin 6','magasin 7']}
          required {...form.getInputProps('emplacement')}/>
          <NumberInput label="PRIX UNITAIRE" placeholder="prix unitaire" required {...form.getInputProps('prixUnitaire')}/>
         
          </SimpleGrid>
          <Textarea
              mt="md"
              label="OBSERVATION"
              placeholder="enter les information du produit"
              minRows={3}
              {...form.getInputProps('observation')}
            />
          <Group justify="flex-end" mt="md">
          <Button type="submit" bg='cyan' className={classes.control}>
                ENREGISTRER
              </Button>
          </Group>
          <Divider label="@CROUS/Z" labelPosition="center" my="lg" />
          </div>
        </form>
      </Modal>

      <Drawer offset={8} radius="md" opened={opened} position="right" onClose={close} title="Mise a jour matieres">
      <form className={classes.form}  onSubmit={formU.onSubmit((values) => updateM(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            MODIFIER LA MATIERE
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <DateInput label="DATE" placeholder="date" required locale="fr" {...formU.getInputProps('date')} />
          <Autocomplete 
          placeholder="matiere"
          label="LIBELLE" 
          comboboxProps={{ withinPortal: true }}
          data={Catalogue?.map(e => ({label:e.matiere, value:e._id}))} 
          required {...formU.getInputProps('catalogue')} />
          
          <TextInput mt="md" label="UNITE CONDITIONNEMENT" placeholder="unite de conditionnement" required {...formU.getInputProps('uniteConditionnement')}/>
          </SimpleGrid>
         
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
          <NumberInput label="PRIX UNITAIRE" placeholder="prix unitaire" required {...formU.getInputProps('prixUnitaire')}/>
          <Select  
          label="EMPLACEMENT" 
          comboboxProps={{ withinPortal: true }}
          data={['magasin 1', 'magasin 2', 'magasin 3', 'magasin 4', 'magasin 5', 'magasin 6','magasin 7']}
          required {...formU.getInputProps('emplacement')}/>
          </SimpleGrid>
          <Textarea
              mt="md"
              label="OBSERVATION"
              placeholder="enter les information du produit"
              minRows={3}
              {...formU.getInputProps('observation')}
            />
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

export default Produits