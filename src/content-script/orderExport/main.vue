<script lang="ts" setup>
import axios, { AxiosRequestConfig } from "axios";
import writeXlsxFile from 'write-excel-file';
import readXlsxFile from 'read-excel-file'
import dayjs from "dayjs";
import { ref } from "vue";


const req = axios.create();
req.interceptors.request.use(async function(config: AxiosRequestConfig) {
  // @ts-ignore
  const {value: csrfToken} = await cookieStore.get("KS-CSRF-Token");
  // @ts-ignore
  const {value: merchantSessionKey} = await cookieStore.get("merchantSessionKey");
  // @ts-ignore
  config.headers?.set("KS-CSRF-Token", csrfToken);
  // @ts-ignore
  config.headers?.set("merchantSessionKey", merchantSessionKey);
  return config;
})
async function exportOrder() {
  const { data } = await req.post("https://s.kwaixiaodian.com/rest/app/tts/ks/seller/order/query/v2", {"orderEsSearchParam":{"oid":"","status":2,"postSaleType":0,"itemTitle":"","buyerMixed":"","buyerNick":"","consigneePhone":"","consigneeName":"","expressNo":"","activityType":0,"refundByDeposit":0,"insuranceType":0,"timeoutOfDeliveryType":0,"cpsType":0,"roleType":0,"distributeRoleName":"","distributeRoleMixed":"","estimatedIncomeRange":{"min":"","max":""},"commissionRateRange":{"min":"","max":""},"sortType":1,"searchForOrderList":1,"checkMerge":true,"offset":0,"limit": 100000,"remindShipment":0,"tradeType":0,"extendReceipt":0,"promiseDeliveryStartTime":0,"promiseDeliveryEndTime":0,"delayDeliveryType":0,"privacyAuthorizeStatus":0},"frontPublishCacheSourceType":1});
  if (data && data.orderList) {
    const orders: Record<string, string>[] = data.orderList.map(({oid, createTime, payTime, itemTitle, skuDesc, province, city, district, town}: Record<string, string>)=> ({oid, createTime, payTime, itemTitle, skuDesc, province, city, district, town}));
    const newOrders = await Promise.all(orders.map(async (order) => {
      try {
        const {data} = await req.post("https://s.kwaixiaodian.com/rest/app/tts/ks/seller/order/getPlainTextV2", {"oid": order.oid,"oids":[],"source":"PC_ORDER_DETAIL"})
        if (data && data.data) {
          const {receiveAddress, buyerPhone, consignee} = data.data.decryptResult;
          return {address: receiveAddress, phone: buyerPhone, name: consignee, ...order};
        }
      } catch (e) {}
      return {address: "", phone: "", name: "", ...order};
    }));
    const schema = [
      { column: '订单号', type: String, width: 20, value: (row: any) => `${row.oid}` },
      { column: '创建时间', type: Date, format: 'yyyy-mm-dd hh:mm:ss', width: 20, value: (row: any) => new Date(row.createTime) },
      { column: '支付时间', type: Date, format: 'yyyy-mm-dd hh:mm:ss', width: 20, value: (row: any) => new Date(row.payTime) },
      { column: '产品名称', type: String, width: 60, value: (row: any) => row.itemTitle },
      { column: '规格名称', type: String,  width: 42, value: (row: any) => row.skuDesc },
      { column: '省份', type: String, width: 22, value: (row: any) => row.province },
      { column: '城市', type: String, width: 22, value: (row: any) => row.city },
      { column: '县市', type: String, width: 22, value: (row: any) => row.district },
      { column: '城镇', type: String, width: 22, value: (row: any) => row.town },
      { column: '地址', type: String, width: 60, value: (row: any) => row.address },
      { column: '联系人', type: String, width: 22, value: (row: any) => row.name },
      { column: '电话', type: String, width: 22, value: (row: any) => row.phone }
    ]
    const fileName = `${dayjs().format('KS-YYYY-MM-DD-HH-mm:ss')}.xlsx`
    await writeXlsxFile(newOrders, {
      schema,
      fileName
    });
  }
  // {"oid":2305100024044302,"oids":[],"source":"PC_ORDER_DETAIL"}
  // https://s.kwaixiaodian.com/rest/app/tts/ks/seller/order/getPlainTextV2
  // {"result":1,"error_msg":"","data":{"decryptResult":{"receiveAddress":"辽宁省抚顺市新抚区永安台街道抚顺市新抚区东一路17号楼二单元四楼一号","buyerPhone":"13841318057","consignee":"刘桂荣"}},"requestId":"676881365128569338"}
}
const inputFileEl = ref();

function importOrder() {
  readXlsxFile(inputFileEl.value.files[0]).then((rows) => {
    console.log(rows);
  })
}
</script>
<template>
  <div class="handle">
    <div class="export" @click="exportOrder">接</div>
    <div class="file"><input @change="importOrder" ref="inputFileEl" type="file" id="input" />发</div>
  </div>
</template>
<style lang="scss" scoped>
.handle {
  font-size: 28px;
  position: absolute;
  left: 50%;
  top: 10px;
  cursor: pointer;
  z-index: 1000;
  user-select: none;
  display: flex;
  .export {
    border-radius: 4px;
    padding: 4px 4px;
    overflow: hidden;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    margin-left: 20px;
  }
  .file {
    position: relative;
    display: inline-block;
    border-radius: 4px;
    padding: 4px 4px;
    overflow: hidden;
    text-decoration: none;
    text-indent: 0;
    line-height: 20px;
    margin-left: 20px;
    input {
      position: absolute;
      font-size: 100px;
      right: 0;
      top: 0;
      opacity: 0;
    }
    &:hover {
      text-decoration: none;
    }
  }
}
</style>