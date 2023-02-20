import { createApp, reactive, watch } from "vue";
import orderExportApp from "./main.vue";

const app = createApp(orderExportApp);

const div = document.createElement("div");
const id = "orderHelper"
div.id = id;
document.body.appendChild(div);

app.mount(`#${id}`);