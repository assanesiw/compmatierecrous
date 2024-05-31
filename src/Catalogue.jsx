import { ActionIcon, Button, Divider, Group, LoadingOverlay, Modal, SimpleGrid, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { FcPlus } from "react-icons/fc"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createCatalogue, deleteCatalogue, getCatalogue } from "./services/catalogueservice";
import { notifications } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import classes from './Navbarnested.module.css';
import { AiFillEdit } from "react-icons/ai";
import { HiArchiveBoxXMark } from "react-icons/hi2";

const schema = z.object({
    categorie: z
      .string()
      .min(3, { message: 'entrez minumum 3 lettres' }),
    });


function Catalogue() {
    const [Openedc, { open:opc, close:cloc }] = useDisclosure(false);
    const key = 'get_Catalogue';
    const qc = useQueryClient();
    const {data: Catalogue,isLoading} = useQuery(key,() => getCatalogue());
    const form = useForm({
        initialValues: {
          categorie: '',
          termsOfService: false,
        },
        validate: zodResolver(schema),
      });
      const formU = useForm({
        initialValues: {
          categorie: '',
          termsOfService: false,
        },
        validate: zodResolver(schema),
      });


    const {mutate,isLoading:isLoadingc} = useMutation((val) => createCatalogue(val),{
        onSuccess:() => {
          notifications.show({
            title: 'insertion reussite',
            message: 'commision a ete cree avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
          cloc();
        }
      });
      const {mutate: del,isLoading:load} = useMutation((id) => deleteCatalogue(id),{
        onSuccess:() => {
          notifications.show({
            title: 'supprimer produits',
            message: 'le produits supprime avec succee',
            color: 'green'
          })
          qc.invalidateQueries(key);
        }
      });
      const save = (valeurs) => { 
        mutate(valeurs);
       }  
       const handleFormSubmit  = (row) => {
        del(row._id);
       };
     
       const actionTemplate = (row) => {
        return (
            <div className="flex space-x-2">
              
                <ActionIcon aria-label="default action icon" size="lg" bg="lime">
                <AiFillEdit/>
              </ActionIcon>
              <ActionIcon aria-label="default action icon" size="lg" bg="red" onClick={() => handleFormSubmit (row)}>
                <HiArchiveBoxXMark/>
              </ActionIcon>
             
                
                
            </div>
        );
        
    };
       
  return (
    <>
     <LoadingOverlay
          visible={isLoadingc || load}
          zIndex
          ={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
    <div className="text-center  mt-4">
    <Button className='w-45 h-12 font-bold' bg='yellow'  leftSection={<FcPlus/>}  onClick={opc}>MATIERE DANS LA BD </Button>  
    </div>
    <div className="card mt-6">
    <DataTable value={Catalogue} loading={isLoading} tableStyle={{ minWidth: '30rem' }} paginator rows={8} rowsPerPageOptions={[6, 16, 26, 51]} size="small" stripedRows>
        <Column field="categorie" header="CATEGORIE"></Column>
         <Column header="ACTION"  body={actionTemplate} style={{ minWidth: '4rem' }}></Column>
    </DataTable>
    </div>


    <Modal opened={Openedc} onClose={cloc} title="">
      <form className={classes.form} onSubmit={form.onSubmit((values) => save(values))}>
      <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UNE MATIERE DANS LE BD
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="CATEGORIE" placeholder="categorie" required {...formU.getInputProps('categorie')} />
         
          </SimpleGrid>
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
         
         
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
    <Modal opened={Openedc} onClose={cloc} title="">
      <form className={classes.form} onSubmit={form.onSubmit((values) => save(values))}>
      <Text fz="lg" fw={700} className="{classes.title} text-center text-green-800">
            AJOUTEZ UNE MATIERE DANS LE BD
          </Text>
          <div className={classes.control}>
          <SimpleGrid  mt="md" cols={{ base: 1, sm: 2 }}>
          <TextInput label="CATEGORIE" placeholder="categorie" required {...form.getInputProps('categorie')} />
         
          </SimpleGrid>
          <SimpleGrid mt="md" cols={{ base: 1, sm: 2 }}>
         
         
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
    </>
  )
}

export default Catalogue