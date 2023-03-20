import { storeToRefs } from 'pinia'
import { useCapturasStore } from '../stores/capturas'

export const useCapturas = () => {
    const capturasStore = useCapturasStore()
    const { 
        getServiceList, saveAreas, getServiceAreas, getAreas, saveCaptures, saveLuxometro, eventSave, saveVerificationDevice, setDateCapture
    } = capturasStore
    const { areas, a_points, numberDot, maxPoint,captureActive, fo_aml_01_4,eventClickLocal, servicesList,currentService, luxometro
    } = storeToRefs(capturasStore)
    

    return {
        areas, a_points, numberDot, maxPoint,captureActive, fo_aml_01_4,eventClickLocal,servicesList,currentService,luxometro,
        getServiceList, saveAreas, getServiceAreas, getAreas, saveCaptures, saveLuxometro, eventSave, saveVerificationDevice, setDateCapture
    }
}