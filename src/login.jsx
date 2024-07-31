import { useForm } from '@mantine/form';
import {
  TextInput,
  PasswordInput,
  Text,
  Paper,
  Group,
  Button,
  Divider,
  Stack,
  BackgroundImage,
  LoadingOverlay,
} from '@mantine/core';
import { useMutation } from 'react-query';
import { createlogin } from './services/user';
import { notifications } from '@mantine/notifications';
import useSignIn from 'react-auth-kit/hooks/useSignIn';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import useIsAuthenticated from 'react-auth-kit/hooks/useIsAuthenticated'
import { useStore } from './store';


function Login(props) {
  const signIn = useSignIn();
  const setRole = useStore((state) => state.setRole)
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated()

  useEffect(() => {
    if(isAuthenticated){
      navigate('/acceuil')
    }
  })

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },

    validate: {
      username: (val) => (/^\S+@\S+$/.test(val) ? null : 'Invalid email'),
      password: (val) => (val.length <= 6 ? 'Password should include at least 6 characters' : null),
    },
  });
  
  const {mutate,isLoading} = useMutation((val) => createlogin(val),{
    onSuccess:({data}) => {
      if(signIn({
        auth: {
            token: data.token,
            type: 'Bearer'
        },
        userState: {
            prenom: data.prenom,
            nom: data.nom,
            role: data.role,
            id: data.id
        }
    })){
      notifications.show({
        title: 'connexion',
        message: 'connexion reussite',
        color: 'green'
      })
      setRole(data.role);
      navigate('/acceuil');
    }else {
      notifications.show({
        title: 'connexion',
        message: 'impossible de se connecter',
        color: 'red'
      })
    }
     
    },
    onError:console.log
  })
  const Connect = (valeurs) => { 
    mutate(valeurs);
   }

  return (
    <>
     <LoadingOverlay
          visible={isLoading}
          zIndex={1000}
          overlayProps={{ radius: 'sm', blur: 2 }}
          loaderProps={{ color: 'blue', type: 'bars' }}
        />
    <BackgroundImage src="/comp.jpg" className='h-screen'>
    <div className=" flex h-screen items-center justify-center w-1/3 mx-auto py-0 text-cyan-500">
     <Paper radius="md" p="xl" withBorder {...props}>
      <Text size="lg" fw={500}>
         GESTION  DES  BIENS  MATERIELS CROUS/Z  
      </Text>
      <img className="mx-auto w-48 h-48" src="/crousz.jpg" alt="crousz" />

      <Divider label="@CROUS/ZIGUINCHOR" labelPosition="center" my="lg" />

      <form onSubmit={form.onSubmit(Connect)}>
        <Stack>
          <TextInput
            required
            label="EMAIL"
            placeholder="crousz@gmail.com"
           {...form.getInputProps('username')}
            radius="md"
          />
          <PasswordInput
            required
            label="MOT DE PASSE"
            placeholder="votre mot de pass"
            {...form.getInputProps('password')}
            radius="md"
          />
        </Stack>

        <Group justify="space-between" mt="xl">
          <Button type="submit" radius="xl" bg='cyan'>
            CONNECTER
          </Button>
        </Group>
      </form>
    </Paper>
    </div>
    
    </BackgroundImage>
    </>
  )
}

export default Login