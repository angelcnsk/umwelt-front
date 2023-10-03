import { storeToRefs } from 'pinia'
import { useClientesStore } from '../stores/clientes'

export const useClientes = () => {
    const clientesStore = useClientesStore()
    const { 
        getClients, getActivity, fetchClient, getStates, getCities, createClient, updateClient, getMainClient,addFactory, newAddress,
        createContact
    } = clientesStore
    const { clients, cities, states, editClient, selectActivity, clienteSelected, clientesPrincipales } = storeToRefs(clientesStore)
    

    return {
        clients, cities, states, editClient, selectActivity, clienteSelected,
        clientesPrincipales,
        getClients, getActivity, fetchClient, getStates, getCities, createClient, updateClient, getMainClient,addFactory,newAddress,
        createContact
    }
}