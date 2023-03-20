import { defineStore } from 'pinia'
import { api } from 'boot/axios'

export const useCapturasStore = defineStore('capturas', {
    state: () => {
        return { 
            areas:[],
            a_points:[],
            numberDot:1,
            maxPoint:0,
            fo_aml_01_4:[],
            eventClickLocal:0,
            servicesList:[],
            currentService:{},
            luxometro:null,
            captureActive:false
        }
    },
    actions:{
        getServiceList (payload) {
            const url = 'spa/getServiceStaff'
            
            const options = {
              params:{id:payload}
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                if (typeof payload === 'undefined') {
                  this.servicesList = response.data.service_list
                  // localStorage.setItem('serviceList', JSON.stringify(response.data.service_list))
                  // localStorage.setItem('deviceList', JSON.stringify(response.data.device))
                }
                //se evalúa si puede accionar botón sincronizar
                this.captureActive = response.data.capture_active != undefined ? response.data.capture_active : false

                this.fo_aml_01_4 = response.data.table_a1 != undefined ? response.data.table_a1 : this.fo_aml_01_4
                this.currentService = response.data.service_data != undefined ? response.data.service_data : this.currentService
                this.a_points = response.data.service_data != undefined ? response.data.service_data : []
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        async saveAreas (payload) {
            const url = 'spa/createArea'
            
            const options = {
            //   params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        getServiceAreas () {
            const url = 'spa/getServiceAreas'
            
            const options = {
            //   params:payload
            }
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                // commit('SET_SERVICES_LIST', response.data.data)
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        getAreas (payload) { 
            const url = 'spa/getAreas'
            
            const options = {
              params:payload
            }
        
            return new Promise((resolve, reject) => {
              api.get(url, options).then((response) => {
                // commit('SET_AREAS_LIST', response.data.areas)
                this.areas = response.data.areas
                resolve()
              }).catch((error) => { reject(error) })
            })
        },
        saveCaptures (capturas) {
            const url = 'spa/saveCaptures'
            
            const options = {
            //   params:payload
            }
            // const dataCapture = JSON.parse(localStorage.getItem(capturas))
            const payload = {capturas:capturas}
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                if(response.data == undefined){
                  resolve(response)
                }
                resolve(response)
              })
            })
        },
        saveLuxometro () {
            const url = 'spa/saveVerificationDevice'
            
            const options = {
            //   params:payload
            }
            const data = {luxometro: JSON.parse(localStorage.getItem('luxometro')), areas: JSON.parse(localStorage.getItem('areas_capturadas')) }
            return new Promise((resolve, reject) => {
              api.post(url, data, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        saveVerificationDevice (device) {
            const url = 'spa/saveVerificationDevice'
            
            const options = {
            //   params:payload
            }
            // const dataCapture = JSON.parse(localStorage.getItem(`capturePointsArea_${area.id}`))
            const deviceLocal = JSON.parse(localStorage.getItem('luxometro'))
            const payload = device
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                deviceLocal.measure_id = response.data.measure_id
                deviceLocal.time = new Date()
                localStorage.setItem('luxometro', JSON.stringify(deviceLocal))
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        },
        setDateCapture(payload){
            const url = 'spa/setDateCapture'
            
            const options = {
            //   params:payload
            }
            return new Promise((resolve, reject) => {
              api.post(url, payload, options).then((response) => {
                resolve(response)
              }).catch((error) => { reject(error) })
            })
        }
    }
})