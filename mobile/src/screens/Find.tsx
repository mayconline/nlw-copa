import { Heading, useToast, VStack } from 'native-base';

import { Header } from '../components/Header';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { useState } from 'react';
import { api } from '../services/api';
import { useNavigation } from '@react-navigation/native';

export function Find() {
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');

  const toast = useToast();
  const { navigate } = useNavigation();

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim) {
        return toast.show({
          title: 'Por favor, informe o codigo',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      await api.post('/pools/join', { code });

      toast.show({
        title: 'Voce entrou no bolao com sucesso',
        placement: 'top',
        bgColor: 'green.500',
      });

      navigate('pools');
    } catch (err) {
      console.log(err);
      setIsLoading(false);

      if (err.response?.data?.message === 'Pool not found') {
        return toast.show({
          title: 'Bolao nao encontrado',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      if (err.response?.data?.message === 'You already joined this pool') {
        return toast.show({
          title: 'Voce ja esta nesse bolao',
          placement: 'top',
          bgColor: 'red.500',
        });
      }

      toast.show({
        title: 'Nao foi possivel encontrar o bolao',
        placement: 'top',
        bgColor: 'red.500',
      });
    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por codigo" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading
          fontFamily="heading"
          color="white"
          fontSize="xl"
          mb={8}
          textAlign="center"
        >
          Encontre seu bolao atraves de seu codigo unico
        </Heading>

        <Input
          mb={2}
          placeholder="qual codigo do bolao?"
          onChangeText={setCode}
          autoCapitalize="characters"
        />

        <Button
          title="BUSCAR BOLAO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />
      </VStack>
    </VStack>
  );
}
