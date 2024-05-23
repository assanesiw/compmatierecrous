import { Button, Divider, Group, LoadingOverlay, Modal, SimpleGrid, Text, TextInput } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks";
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { FcPlus } from "react-icons/fc"
import { useMutation, useQuery, useQueryClient } from "react-query";
import { createCatalogue, getCatalogue } from "./services/catalogueservice";
import { notifications } from "@mantine/notifications";
import { useForm, zodResolver } from "@mantine/form";
import { z } from "zod";
import classes from './Navbarnested.module.css';

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
      const save = (valeurs) => { 
        mutate(valeurs);
       }      
  return (
    <>
     <LoadingOverlay
          visible={isLoadingc}
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
    </DataTable>
    </div>


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