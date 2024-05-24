/* eslint-disable no-unused-vars */
import { Modal, Button, LoadingOverlay, NumberInput, ActionIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { Text, SimpleGrid, TextInput, Group, Divider} from '@mantine/core';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { z } from 'zod';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { createMatiere, getMatieres } from './services/matiereservice';
import { useForm, zodResolver } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { DateInput } from '@mantine/dates';
import { AiFillEdit } from 'react-icons/ai';
import { HiArchiveBoxXMark } from 'react-icons/hi2';
import { format } from 'date-fns';
import { IoMdAdd } from 'react-icons/io';
import { TfiWrite } from 'react-icons/tfi';
import pdfMake from "pdfmake/build/pdfmake";
import { font } from "./vfs_fonts";
pdfMake.vfs = font
import {image} from "./composants/image";


const schema = z.object({
  quantite:z.number(),
  produit:z.string()
  .min({3: 'entrez minumum 3 lettres' }),
  categorie:z.string()
  .min({3: 'entrez minumum 3 lettres' }),
  observation:z.string()
  .min({3: 'entrez minumum 3 lettres' }),
  date:z.date(),
});

function Matiere(){
    const [noTransitionOpened, { open, close }] = useDisclosure(false);
    const key = 'get_Matiere';
    const qc = useQueryClient();
    const {data: Matiere,isLoading} = useQuery(key,() => getMatieres());
    const form = useForm({
      initialValues: {
        produit: '',
        categorie: '',
        quantite: 0,
        date: '',
        observation: '',
        termsOfService: false,
      },
      validate: zodResolver(schema),
    });
    const {mutate,isLoading:isLoadingM} = useMutation((val) => createMatiere(val),{
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
    const save = (valeurs) => {
      mutate(valeurs);
     }
     const datetemplate = (row) => row.date && format(row.date,'dd-MM-yyyy')
     const actionTemplate = (row) => {
      return (
          <div className="flex space-x-2">
              <ActionIcon aria-label="default action icon" size="lg" bg="lime">
              <AiFillEdit/>
            </ActionIcon>
            <ActionIcon aria-label="default action icon" size="lg" bg="red" >
              <HiArchiveBoxXMark/>
            </ActionIcon>
              {/* <Button icon="pi pi-pencil"  className='w-8 h-8 font-bold' bg='green' style={{ marginRight: '8px' }} leftSection={<AiFillEdit/>}></Button> */}
              {/* <Button icon="pi pi-pencil" className='w-8 h-8 font-bold' bg='red' leftSection={<HiArchiveBoxXMark/>}></Button> */}         
          </div>
      );
  };
  const generer = () =>{
    var dd = {
      content: [
        {
          image,
          width:100,
          height:90,
          alignment: 'center'
          
      },
      {text: 'CENTRE REGIONAL DES OEUVRES UNIVERSITAIRES SOCIALES DE ZIGUINCHOR (CROUS/Z)', fontSize: 14, bold: false, alignment:'center'},
      {text: '-----------------------------------------------\n\n', fontSize: 10, bold: false, alignment:'center'},
      {text: 'LISTE ACTUEL DES HORS D ETATS \n\n', fontSize: 17, bold: true,color:'blue', alignment:'center'},
      {
        style: 'tableExample',
        bold:true,
       fillColor:'',
        table: {
          widths: [200, 100, 80,120],
            body: [
                [{ text:'DESIGNATION',style: 'tableHeader'}, 'CATEGORIE', 'QUANTITE','OBSERVATION'],
                 // eslint-disable-next-line no-unsafe-optional-chaining
                 ...Matiere.map(m =>{ 
                    return  [m.produit, m.categorie, m.quantite,m.observation];
                })
            ]
        }
    },
    {text:  `\n\n${Matiere?.length} MATIERES SONT DISPONIBLE DANS NOTRE STOCK`,color:'red', fontSize: 12, bold: true, alignment:'justify'},
      ]
    }
    pdfMake.createPdf(dd).open();
  }
  
    return(
<>
<LoadingOverlay
          visible={isLoading || isLoadingM}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />

<div className="flex items-center justify-between px-20 mt-4 ">
        <Button className='w-45 h-12 font-bold ' bg='orange' leftSection ={<IoMdAdd/>} onClick={open}>AJOUTER UNE MATIERE</Button>
        <Button className='w-45 h-12 font-bold ' bg='green' leftSection ={<TfiWrite/>} onClick={() => generer()} >INVENTAIRE DES HORS D ETAT</Button>
 
 </div>
<div className='relative overflow-x-auto shadow-md sm:rounded-lg'>
<h1 className='font-bold text-3xl text-center mt-6'>LES RECEPTIONS</h1>
</div>
<div className="card">
<DataTable value={Matiere} tableStyle={{ minWidth: '50rem' }}>
<Column field="date" body={datetemplate} header="DATE"></Column>
 <Column field="produit" header="PRODUITS" ></Column> 
 <Column field="categorie" header="CATEGORIE"></Column>
 <Column field="quantite" header="QUANTITE"></Column>
 <Column field="observation" header="OBSERVATION"></Column>
 <Column  header="ACTION" body={actionTemplate}  style={{ minWidth: '4rem' }}></Column>
</DataTable>
</div>




<Modal opened={noTransitionOpened} onClose={close} title="">
      <form className="" onSubmit={form.onSubmit((values) => save(values))}>
        <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UN NOUVEAU RECEPTION
          </Text>
          <div className="">
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <DateInput label="DATE" placeholder="date" locale='fr' required {...form.getInputProps('date')}/>
          <TextInput label="PRODUIT" placeholder="produit" required {...form.getInputProps('produit')}/>
          <NumberInput  label="QUANTITE" placeholder="quantite" mt="md" required {...form.getInputProps('quantite')}/>
          <TextInput label="CATEGORIE" placeholder="categorie" mt="md" required {...form.getInputProps('categorie')}/>
          <TextInput label="OBSERVATION" placeholder="observation" mt="md" required {...form.getInputProps('observation')}/>
            </SimpleGrid>
          <Group justify="flex-end" mt="md" >
          <Button type="submit" bg='cyan' className="">
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
export default Matiere
