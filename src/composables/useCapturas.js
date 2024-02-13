import { storeToRefs } from 'pinia'
import { useCapturasStore } from '../stores/capturas'

export const useCapturas = () => {
    const capturasStore = useCapturasStore()
    const { 
        getServiceList, saveCaptures, eventSave, setDateCapture,
        saveSectionFile, getCategories, listenerObservations
    } = capturasStore
    const { servicesList,currentService, categories, listener
    } = storeToRefs(capturasStore)
    

    return {
        servicesList,currentService,categories,listener,listenerObservations,
        getServiceList, saveCaptures,  setDateCapture, saveSectionFile,
        getCategories
    }
}