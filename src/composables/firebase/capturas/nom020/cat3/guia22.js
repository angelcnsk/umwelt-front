import { getData } from "src/composables/firebase/firebaseService";

export async function getCategories(){
    return getData('/16')
}