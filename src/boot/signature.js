import { boot } from 'quasar/wrappers';
import SignaturePad from "vue3-signature-pad";

export default boot(({ app }) => {
  app.use(SignaturePad);
  // app.component('signature-pad', SignaturePad)
});
