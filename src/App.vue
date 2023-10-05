<template>
  <router-view />
</template>
<script setup>
import { ref,provide } from "vue";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "boot/firebase";

const fireUser = ref(false);

provide('fireUser', fireUser);

onAuthStateChanged(auth, (user) => {
  fireUser.value = user;
})

</script>
