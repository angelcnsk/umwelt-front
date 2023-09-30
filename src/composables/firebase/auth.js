import {auth} from 'boot/firebase'
import { getAuth, confirmPasswordReset, parseActionCodeURL, sendPasswordResetEmail } from "firebase/auth";
import {api} from 'boot/axios'
import { useUsers } from "../useUsers";

const useStore = useUsers()
const {resetPassword} = useStore

export async function confirmPassword(params) {
    const parse = parseActionCodeURL(params.url)
    
    let url = new URL(parse.continueUrl);
    let location = new URLSearchParams(url.search);
    const email = location.get('email');

    const reset = await confirmPasswordReset(auth, params.code, params.password2, (confirm) => {
        console.log('contraseña modificada', confirm)
    }).catch((e) => {
        if(e.code == 'auth/invalid-action-code') {
            return {error:'El link de recuperación ya no es válido'}
        }
    })
    
    if(reset != undefined) return reset
    
    return await resetPassword({password:params.password2, email:email})
    
}

export async function recovery(params) {
    const actionCodeSettings = {
        url: params.domain,
        handleCodeInApp: true,
        email:params.email
    }

    sendPasswordResetEmail(auth, params.email, actionCodeSettings)
    return true

}