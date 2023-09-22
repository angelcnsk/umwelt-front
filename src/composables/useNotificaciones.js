import { storeToRefs } from 'pinia'
import { useNotificacionesStore } from '../stores/notificaciones'

export const useNotificaciones = () => {
    const notificacionesStore = useNotificacionesStore()
    const { 
        launchNotify, getNotify, setNotifyView
    } = notificacionesStore
    const { notifications
    } = storeToRefs(notificacionesStore)
    

    return {
        launchNotify, notifications, getNotify,setNotifyView
    }
}