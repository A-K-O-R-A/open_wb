import{u as F}from"./index-572580bf.js";import{D as H}from"./DashBoardCard-c40659b7.js";import{S as K,C as Q}from"./ChargePointPlugBadge-033e3571.js";import{l as U,f as Z,a as j,F as D,b as Y,c as $,j as ee,k as te,m as ne,n as le,o as oe,e as ie,p as ae,q as re,r as ce,s as se,t as de,u as ge,v as he,w as ue,x as me,y as Ce,z as fe,A as _e}from"./vendor-fortawesome-63041232.js";import{l as h,o as s,n as P,p as t,s as e,z as w,k as a,x as u,i as d,I as pe,e as v,j as ve,F as T,A as L}from"./vendor-caccd77e.js";import{_ as A}from"./vendor-inkline-7939cbce.js";U.add(Z,j);const Pe={name:"ChargePointLockButton",props:{chargePointId:{required:!0,type:Number},changesLocked:{required:!1,type:Boolean,default:!1}},data(){return{mqttStore:F()}},components:{FontAwesomeIcon:D},computed:{locked(){return this.mqttStore.getChargePointManualLock(this.chargePointId)},stateIcon(){return this.locked?["fas","fa-lock"]:["fas","fa-lock-open"]},stateClass(){return this.locked?["_color:danger"]:"_color:success"}},methods:{toggleChargePointManualLock(){this.changesLocked||this.$root.sendTopicToBroker(`openWB/chargepoint/${this.chargePointId}/set/manual_lock`,!this.mqttStore.getValueBool(`openWB/chargepoint/${this.chargePointId}/set/manual_lock`))}}};function Ve(i,l,c,f,n,r){const k=h("font-awesome-icon"),_=h("i-button");return s(),P(_,{size:"lg",disabled:c.changesLocked,outline:c.changesLocked},{default:t(()=>[e(k,{"fixed-width":"",icon:r.stateIcon,class:w(r.stateClass),onClick:l[0]||(l[0]=p=>r.toggleChargePointManualLock())},null,8,["icon","class"])]),_:1},8,["disabled","outline"])}const be=A(Pe,[["render",Ve],["__file","/var/www/html/openWB/packages/modules/display_themes/cards/source/src/components/ChargePointLockButton.vue"]]),Se={name:"ExtendedNumberInput",inheritAttrs:!1,props:{modelValue:{type:Number},unit:{type:String},min:{type:Number,default:0},max:{type:Number,default:100},step:{type:Number,default:1},labels:{type:Array}},emits:["update:modelValue"],data(){return{minimum:this.labels?0:this.min,maximum:this.labels?this.labels.length-1:this.max,stepSize:this.labels?1:this.step}},computed:{label(){var i;return this.labels&&this.inputValue!=null?this.inputValue<this.labels.length?i=this.labels[this.inputValue].label:console.error("index out of bounds: "+this.inputValue):i=this.inputValue,typeof i=="number"&&(i=i.toLocaleString(void 0,{minimumFractionDigits:this.precision,maximumFractionDigits:this.precision})),i},precision(){if(!isFinite(this.stepSize))return 0;for(var i=1,l=0;Math.round(this.stepSize*i)/i!==this.stepSize;)i*=10,l++;return l},inputValue:{get(){if(this.labels){var i=void 0;for(let l=0;l<this.labels.length;l++)if(this.labels[l].value==this.modelValue){i=l;break}return i===void 0&&this.modelValue!==void 0?(console.warn("inputValue: not found in values: ",this.modelValue,"using minimum as default: ",this.minimum),this.minimum):i}return this.modelValue},set(i){if(this.labels){var l=this.labels[i].value;this.$emit("update:modelValue",l)}else this.$emit("update:modelValue",i)}}},methods:{increment(){var i=Math.min(this.inputValue+this.stepSize,this.maximum);this.inputValue=Math.round(i*Math.pow(10,this.precision))/Math.pow(10,this.precision)},decrement(){var i=Math.max(this.inputValue-this.stepSize,this.minimum);this.inputValue=Math.round(i*Math.pow(10,this.precision))/Math.pow(10,this.precision)}}};function ke(i,l,c,f,n,r){const k=h("i-button"),_=h("i-input");return s(),P(_,{plaintext:"",class:"_text-align:right",size:"lg",modelValue:r.label,"onUpdate:modelValue":l[0]||(l[0]=p=>r.label=p)},{prepend:t(()=>[e(k,{onClick:r.decrement},{default:t(()=>[a("-")]),_:1},8,["onClick"])]),suffix:t(()=>[a(u(c.unit),1)]),append:t(()=>[e(k,{onClick:r.increment},{default:t(()=>[a("+")]),_:1},8,["onClick"])]),_:1},8,["modelValue"])}const O=A(Se,[["render",ke],["__file","/var/www/html/openWB/packages/modules/display_themes/cards/source/src/components/ExtendedNumberInput.vue"]]);U.add(Y,$);const Ie={name:"ManualSocInput",props:{modelValue:{required:!0,type:Boolean,default:!1},vehicleId:{required:!0,type:Number,default:0}},data(){return{mqttStore:F(),newSoc:0}},components:{ExtendedNumberInput:O,FontAwesomeIcon:D},emits:["update:modelValue"],methods:{enter(i){let l=this.newSoc*10+i;l>=0&&l<=100&&(this.newSoc=l)},removeDigit(){this.newSoc=Math.trunc(this.newSoc/10)},clear(){this.newSoc=0},close(){this.$emit("update:modelValue",!1),this.newSoc=0},updateManualSoc(){this.$root.sendTopicToBroker(`openWB/vehicle/${this.vehicleId}/soc_module/general_config/soc_start`,this.newSoc),this.close()}}};function qe(i,l,c,f,n,r){const k=h("extended-number-input"),_=h("i-column"),p=h("i-row"),m=h("i-button"),I=h("i-container"),C=h("FontAwesomeIcon"),B=h("i-modal");return s(),P(pe,{to:"body"},[e(B,{modelValue:c.modelValue,"onUpdate:modelValue":l[15]||(l[15]=g=>i.$emit("update:modelValue",g)),size:"sm"},{header:t(()=>[a(' SoC für Fahrzeug "'+u(n.mqttStore.getVehicleName(c.vehicleId))+'" ',1)]),footer:t(()=>[e(I,null,{default:t(()=>[e(p,null,{default:t(()=>[d(" charge point data on left side "),e(_,null,{default:t(()=>[e(m,{color:"danger",onClick:l[13]||(l[13]=g=>r.close())},{default:t(()=>[a(" Zurück ")]),_:1})]),_:1}),e(_,{class:"_text-align:right"},{default:t(()=>[e(m,{color:"success",onClick:l[14]||(l[14]=g=>r.updateManualSoc())},{default:t(()=>[a(" OK ")]),_:1})]),_:1})]),_:1})]),_:1})]),default:t(()=>[e(I,null,{default:t(()=>[e(p,{center:"",class:"_padding-bottom:1"},{default:t(()=>[e(_,null,{default:t(()=>[e(k,{modelValue:n.newSoc,"onUpdate:modelValue":l[0]||(l[0]=g=>n.newSoc=g),unit:"%",min:0,max:100,step:1,size:"lg",class:"_text-align:center"},null,8,["modelValue"])]),_:1})]),_:1}),e(p,{center:"",class:"_padding-bottom:1"},{default:t(()=>[e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[1]||(l[1]=g=>r.enter(1))},{default:t(()=>[a("1")]),_:1})]),_:1}),e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[2]||(l[2]=g=>r.enter(2))},{default:t(()=>[a("2")]),_:1})]),_:1}),e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[3]||(l[3]=g=>r.enter(3))},{default:t(()=>[a("3")]),_:1})]),_:1})]),_:1})]),_:1}),e(I,null,{default:t(()=>[e(p,{center:"",class:"_padding-bottom:1"},{default:t(()=>[e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[4]||(l[4]=g=>r.enter(4))},{default:t(()=>[a("4")]),_:1})]),_:1}),e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[5]||(l[5]=g=>r.enter(5))},{default:t(()=>[a("5")]),_:1})]),_:1}),e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[6]||(l[6]=g=>r.enter(6))},{default:t(()=>[a("6")]),_:1})]),_:1})]),_:1})]),_:1}),e(I,null,{default:t(()=>[e(p,{center:"",class:"_padding-bottom:1"},{default:t(()=>[e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[7]||(l[7]=g=>r.enter(7))},{default:t(()=>[a("7")]),_:1})]),_:1}),e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[8]||(l[8]=g=>r.enter(8))},{default:t(()=>[a("8")]),_:1})]),_:1}),e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[9]||(l[9]=g=>r.enter(9))},{default:t(()=>[a("9")]),_:1})]),_:1})]),_:1})]),_:1}),e(I,null,{default:t(()=>[e(p,{center:"",class:"_padding-bottom:1"},{default:t(()=>[e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[10]||(l[10]=g=>r.clear())},{default:t(()=>[e(C,{"fixed-width":"",icon:["fas","fa-eraser"]})]),_:1})]),_:1}),e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[11]||(l[11]=g=>r.enter(0))},{default:t(()=>[a("0")]),_:1})]),_:1}),e(_,{class:"_flex-grow:0"},{default:t(()=>[e(m,{size:"lg",class:"numberButton",onClick:l[12]||(l[12]=g=>r.removeDigit())},{default:t(()=>[e(C,{"fixed-width":"",icon:["fas","fa-delete-left"]})]),_:1})]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])])}const we=A(Ie,[["render",qe],["__scopeId","data-v-4ad611a1"],["__file","/var/www/html/openWB/packages/modules/display_themes/cards/source/src/components/ChargePoints/ManualSocInput.vue"]]);U.add(ee,te,ne,le,Z,j,oe,ie,ae,re,ce,se,de,ge,he,ue,me,Ce,fe,_e);const xe={name:"ChargePointsView",data(){return{mqttStore:F(),modalChargeModeSettingVisible:!1,modalVehicleSelectVisible:!1,modalChargePointSettingsVisible:!1,modalChargePointId:0,modalVehicleId:0,modalActiveTab:"tab-general",modalManualSocInputVisible:!1}},props:{changesLocked:{required:!1,type:Boolean,default:!1}},components:{DashBoardCard:H,SparkLine:K,ChargePointPlugBadge:Q,ChargePointLockButton:be,ExtendedNumberInput:O,ManualSocInput:we,FontAwesomeIcon:D},watch:{changesLocked(i,l){l!==!0&&i===!0&&(this.modalChargeModeSettingVisible=!1,this.modalVehicleSelectVisible=!1,this.modalChargePointSettingsVisible=!1,this.modalManualSocInputVisible=!1)}},computed:{vehicleList(){let i=this.mqttStore.getVehicleList;var l=[];return Object.keys(i).forEach(c=>{let f=parseInt(c.match(/(?:\/)([0-9]+)(?=\/)*/g)[0].replace(/[^0-9]+/g,""));l.push({id:f,name:i[c]})}),l}},methods:{toggleChargePointSettings(i){switch(this.mqttStore.getChargePointConnectedVehicleChargeMode(i).mode){case"pv_charging":this.modalActiveTab="tab-pv-charging";break;case"scheduled_charging":this.modalActiveTab="tab-scheduled-charging";break;default:this.modalActiveTab="tab-instant-charging"}this.modalChargePointId=i,this.modalChargePointSettingsVisible=!0},handleChargeModeClick(i){this.changesLocked||(this.modalChargePointId=i,this.modalChargeModeSettingVisible=!0)},handleVehicleClick(i){!this.changesLocked&&this.mqttStore.getChargePointVehicleChangePermitted(i)&&(this.modalChargePointId=i,this.modalVehicleSelectVisible=!0)},handleSocClick(i){let l=this.mqttStore.getChargePointConnectedVehicleId(i);if(this.mqttStore.getVehicleSocIsManual(l)){this.modalVehicleId=l,this.modalManualSocInputVisible=!0;return}this.$root.sendTopicToBroker(`openWB/set/vehicle/${l}/get/force_soc_update`,1)},setChargePointConnectedVehicle(i,l){l.id!=this.mqttStore.getChargePointConnectedVehicleId(i)&&this.$root.sendTopicToBroker(`openWB/chargepoint/${i}/config/ev`,l.id),this.modalVehicleSelectVisible&&(this.modalVehicleSelectVisible=!1)},setChargePointConnectedVehicleChargeMode(i,l){if(l.id!=this.mqttStore.getChargePointConnectedVehicleChargeMode(i)){var c=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${c}/chargemode/selected`,l)}},setChargePointConnectedVehiclePriority(i,l){if(l!=this.mqttStore.getChargePointConnectedVehiclePriority(i)){var c=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${c}/prio`,l)}},setChargePointConnectedVehicleTimeChargingActive(i,l){if(l!=this.mqttStore.getChargePointConnectedVehicleTimeChargingActive(i)){var c=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${c}/time_charging/active`,l)}},setChargePointConnectedVehicleInstantChargingCurrent(i,l){if(l&&l!=this.mqttStore.getChargePointConnectedVehicleInstantChargingCurrent(i)){var c=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${c}/chargemode/instant_charging/current`,parseFloat(l))}},setChargePointConnectedVehicleInstantChargingLimit(i,l){if(l&&l!=this.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(i).selected){var c=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${c}/chargemode/instant_charging/limit/selected`,l)}},setChargePointConnectedVehicleInstantChargingLimitSoc(i,l){if(l&&l!=this.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(i).soc){var c=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${c}/chargemode/instant_charging/limit/soc`,parseInt(l))}},setChargePointConnectedVehicleInstantChargingLimitAmount(i,l){if(l&&l!=this.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(i).amount){var c=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${c}/chargemode/instant_charging/limit/amount`,l)}},setChargePointConnectedVehiclePvChargingFeedInLimit(i,l){if(l!=this.mqttStore.getChargePointConnectedVehiclePvChargingFeedInLimit(i)){var c=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${c}/chargemode/pv_charging/feed_in_limit`,l)}},setChargePointConnectedVehiclePvChargingMinCurrent(i,l){let c=this.mqttStore.getChargePointConnectedVehiclePvChargingMinCurrent(i),f=parseInt(l);if(f!=c&&!isNaN(f)){var n=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${n}/chargemode/pv_charging/min_current`,f)}},setChargePointConnectedVehiclePvChargingMinSoc(i,l){let c=this.mqttStore.getChargePointConnectedVehiclePvChargingMinSoc(i),f=parseInt(l);if(f!=c&&!isNaN(f)){var n=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${n}/chargemode/pv_charging/min_soc`,f)}},setChargePointConnectedVehiclePvChargingMinSocCurrent(i,l){let c=this.mqttStore.getChargePointConnectedVehiclePvChargingMinSocCurrent(i),f=parseInt(l);if(f!=c&&!isNaN(f)){var n=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${n}/chargemode/pv_charging/min_soc_current`,f)}},setChargePointConnectedVehiclePvChargingMaxSoc(i,l){let c=this.mqttStore.getChargePointConnectedVehiclePvChargingMaxSoc(i),f=parseInt(l);if(f!=c&&!isNaN(f)){var n=this.mqttStore.getChargePointConnectedVehicleChargeTemplateIndex(i);this.$root.sendTopicToBroker(`openWB/vehicle/template/charge_template/${n}/chargemode/pv_charging/max_soc`,f)}},setChargePointConnectedVehicleScheduledChargingPlanActive(i,l){this.$root.sendTopicToBroker(`${i}/active`,l)},setChargePointConnectedVehicleTimeChargingPlanActive(i,l){this.$root.sendTopicToBroker(`${i}/active`,l)}}},ye={class:"charge-points-card-wrapper"},Te={key:0},Be={key:0},Le={key:1},Me={key:2},ze={key:3},Ae={key:4},Ne={key:0},We={key:1},Fe={key:0},Ue={key:1},De={key:2},Ee={key:3},Ze={key:4};function je(i,l,c,f,n,r){const k=h("charge-point-plug-badge"),_=h("charge-point-lock-button"),p=h("i-column"),m=h("i-row"),I=h("spark-line"),C=h("font-awesome-icon"),B=h("i-badge"),g=h("i-button"),N=h("i-container"),R=h("dash-board-card"),b=h("i-form-label"),x=h("i-button-group"),V=h("i-form-group"),y=h("i-form"),W=h("i-modal"),M=h("i-tab-title"),q=h("extended-number-input"),z=h("i-tab"),E=h("i-alert"),J=h("i-tabs"),X=h("manual-soc-input");return s(),v(T,null,[ve("div",ye,[(s(!0),v(T,null,L(n.mqttStore.getChargePointIds,o=>(s(),P(R,{key:o,color:"primary"},{headerLeft:t(()=>[a(u(n.mqttStore.getChargePointName(o)),1)]),headerRight:t(()=>[e(k,{chargePointId:[o]},null,8,["chargePointId"])]),default:t(()=>[e(N,null,{default:t(()=>[e(m,null,{default:t(()=>[d(" charge point data on left side "),e(p,null,{default:t(()=>[e(m,null,{default:t(()=>[e(p,{class:"_padding-left:0 _padding-right:0"},{default:t(()=>[e(_,{chargePointId:o,changesLocked:c.changesLocked},null,8,["chargePointId","changesLocked"])]),_:2},1024),e(p,{class:"_text-align:right _padding-left:0"},{default:t(()=>[a(u(n.mqttStore.getChargePointPower(o))+" "+u(n.mqttStore.getChargePointPhasesInUse(o))+" "+u(n.mqttStore.getChargePointSetCurrent(o)),1)]),_:2},1024)]),_:2},1024),e(m,{class:"_padding-top:1"},{default:t(()=>[e(p,{class:"_padding-left:0"},{default:t(()=>[e(I,{color:"var(--color--primary)",data:n.mqttStore.getChargePointPowerChartData(o)},null,8,["data"])]),_:2},1024)]),_:2},1024)]),_:2},1024),d(" vehicle data on right side "),e(p,{md:"6"},{default:t(()=>[d(" vehicle and soc "),e(m,{class:"_display:flex"},{default:t(()=>[e(p,{class:"_padding-left:0 _padding-right:0 _flex-grow:1"},{default:t(()=>[e(B,{size:"lg",class:w(["full-width",c.changesLocked?"":"clickable"]),disabled:!n.mqttStore.getChargePointVehicleChangePermitted(n.modalChargePointId),onClick:S=>r.handleVehicleClick(o)},{default:t(()=>[e(C,{"fixed-width":"",icon:["fas","fa-car"]}),a(" "+u(n.mqttStore.getChargePointConnectedVehicleName(o)),1)]),_:2},1032,["class","disabled","onClick"])]),_:2},1024),n.mqttStore.getVehicleSocConfigured(n.mqttStore.getChargePointConnectedVehicleId(o))||n.mqttStore.getVehicleFaultState(n.mqttStore.getChargePointConnectedVehicleId(o))!=0?(s(),P(p,{key:0,class:"_flex-grow:0 _padding-right:0 _padding-left:1"},{default:t(()=>[e(g,{size:"sm",disabled:c.changesLocked,class:w(c.changesLocked?"":"clickable"),onClick:S=>r.handleSocClick(o)},{default:t(()=>[n.mqttStore.getVehicleSocConfigured(n.mqttStore.getChargePointConnectedVehicleId(o))?(s(),v("span",Te,[e(C,{"fixed-width":"",icon:n.mqttStore.getVehicleSocIsManual(n.mqttStore.getChargePointConnectedVehicleId(o))?["fas","fa-edit"]:["fas","fa-car-battery"]},null,8,["icon"]),a(" "+u(n.mqttStore.getChargePointConnectedVehicleSoc(o).soc)+"% ",1)])):d("v-if",!0),n.mqttStore.getVehicleFaultState(n.mqttStore.getChargePointConnectedVehicleId(o))!=0?(s(),P(C,{key:1,"fixed-width":"",icon:n.mqttStore.getVehicleFaultState(n.mqttStore.getChargePointConnectedVehicleId(o))>0?n.mqttStore.getVehicleFaultState(n.mqttStore.getChargePointConnectedVehicleId(o))>1?["fas","times-circle"]:["fas","exclamation-triangle"]:[],class:w(n.mqttStore.getVehicleFaultState(n.mqttStore.getChargePointConnectedVehicleId(o))>0?n.mqttStore.getVehicleFaultState(n.mqttStore.getChargePointConnectedVehicleId(o))>1?"_color:danger":"_color:warning":"")},null,8,["icon","class"])):d("v-if",!0)]),_:2},1032,["disabled","class","onClick"])]),_:2},1024)):d("v-if",!0)]),_:2},1024),d(" charge mode info "),e(m,{class:"_padding-top:1 _display:flex"},{default:t(()=>[e(p,{class:"_padding-left:0 _padding-right:0 _flex-grow:1"},{default:t(()=>[e(B,{size:"lg",class:w(["full-width",c.changesLocked?"":"clickable"]),color:n.mqttStore.getChargePointConnectedVehicleChargeMode(o).class,onClick:S=>r.handleChargeModeClick(o)},{default:t(()=>[a(u(n.mqttStore.getChargePointConnectedVehicleChargeMode(o).label)+" ",1),e(C,{"fixed-width":"",icon:n.mqttStore.getChargePointConnectedVehiclePriority(o)?["fas","fa-star"]:["far","fa-star"],class:w(n.mqttStore.getChargePointConnectedVehiclePriority(o)?"_color:warning":"")},null,8,["icon","class"])]),_:2},1032,["class","color","onClick"])]),_:2},1024),n.mqttStore.getChargePointConnectedVehicleTimeChargingActive(o)?(s(),P(p,{key:0,class:"_flex-grow:0 _padding-right:0 _padding-left:1"},{default:t(()=>[e(B,{size:"lg"},{default:t(()=>[n.mqttStore.getChargePointConnectedVehicleTimeChargingActive(o)?(s(),P(C,{key:0,"fixed-width":"",icon:n.mqttStore.getChargePointConnectedVehicleTimeChargingRunning(o)?["fas","fa-clock"]:["far","fa-clock"],class:w(n.mqttStore.getChargePointConnectedVehicleTimeChargingRunning(o)?"_color:success":"")},null,8,["icon","class"])):d("v-if",!0)]),_:2},1024)]),_:2},1024)):d("v-if",!0)]),_:2},1024),d(" settings button "),c.changesLocked?d("v-if",!0):(s(),P(m,{key:0,class:"_padding-top:1"},{default:t(()=>[e(p,{class:"_padding-left:0 _padding-right:0"},{default:t(()=>[e(g,{block:"",onClick:S=>r.toggleChargePointSettings(o)},{default:t(()=>[e(C,{"fixed-width":"",icon:["fas","fa-wrench"]})]),_:2},1032,["onClick"])]),_:2},1024)]),_:2},1024))]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),d(" modals "),d(" charge mode only "),e(W,{modelValue:n.modalChargeModeSettingVisible,"onUpdate:modelValue":l[2]||(l[2]=o=>n.modalChargeModeSettingVisible=o),size:"lg"},{header:t(()=>[a(' Lademodus für "'+u(n.mqttStore.getChargePointConnectedVehicleName(n.modalChargePointId))+'" auswählen ',1)]),default:t(()=>[e(y,null,{default:t(()=>[e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("Lademodus")]),_:1}),e(x,{block:""},{default:t(()=>[(s(!0),v(T,null,L(n.mqttStore.chargeModeList(),o=>(s(),P(g,{key:o.id,outline:"",color:o.class!="dark"?o.class:"light",active:n.mqttStore.getChargePointConnectedVehicleChargeMode(n.modalChargePointId)!=null&&o.id==n.mqttStore.getChargePointConnectedVehicleChargeMode(n.modalChargePointId).mode,onClick:S=>r.setChargePointConnectedVehicleChargeMode(n.modalChargePointId,o.id)},{default:t(()=>[a(u(o.label),1)]),_:2},1032,["color","active","onClick"]))),128))]),_:1})]),_:1}),e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("Priorität")]),_:1}),e(x,{block:""},{default:t(()=>[e(g,{color:n.mqttStore.getChargePointConnectedVehiclePriority(n.modalChargePointId)!==!0?"danger":"",onClick:l[0]||(l[0]=o=>r.setChargePointConnectedVehiclePriority(n.modalChargePointId,!1))},{default:t(()=>[a(" Nein ")]),_:1},8,["color"]),e(g,{color:n.mqttStore.getChargePointConnectedVehiclePriority(n.modalChargePointId)===!0?"success":"",onClick:l[1]||(l[1]=o=>r.setChargePointConnectedVehiclePriority(n.modalChargePointId,!0))},{default:t(()=>[a(" Ja ")]),_:1},8,["color"])]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),d(" end charge mode only"),d(" vehicle only "),e(W,{class:"modal-vehicle-select",modelValue:n.modalVehicleSelectVisible,"onUpdate:modelValue":l[3]||(l[3]=o=>n.modalVehicleSelectVisible=o),size:"lg"},{header:t(()=>[a(' Fahrzeug an "'+u(n.mqttStore.getChargePointName(n.modalChargePointId))+'" auswählen ',1)]),default:t(()=>[e(y,null,{default:t(()=>[e(V,null,{default:t(()=>[e(x,{vertical:"",block:""},{default:t(()=>[(s(!0),v(T,null,L(r.vehicleList,o=>(s(),P(g,{key:o.id,active:n.mqttStore.getChargePointConnectedVehicleId(n.modalChargePointId)==o.id,color:n.mqttStore.getChargePointConnectedVehicleId(n.modalChargePointId)==o.id?"primary":"",onClick:S=>r.setChargePointConnectedVehicle(n.modalChargePointId,o)},{default:t(()=>[a(u(o.name),1)]),_:2},1032,["active","color","onClick"]))),128))]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]),d(" end vehicle only"),d(" charge point settings "),e(W,{modelValue:n.modalChargePointSettingsVisible,"onUpdate:modelValue":l[19]||(l[19]=o=>n.modalChargePointSettingsVisible=o),size:"lg"},{header:t(()=>[a(' Einstellungen für Ladepunkt "'+u(n.mqttStore.getChargePointName(n.modalChargePointId))+'" ',1)]),default:t(()=>[e(J,{modelValue:n.modalActiveTab,"onUpdate:modelValue":l[18]||(l[18]=o=>n.modalActiveTab=o),stretch:""},{header:t(()=>[e(M,{for:"tab-instant-charging"},{default:t(()=>[a(" Sofort ")]),_:1}),e(M,{for:"tab-pv-charging"},{default:t(()=>[a(" PV ")]),_:1}),e(M,{for:"tab-scheduled-charging"},{default:t(()=>[a(" Zielladen ")]),_:1}),e(M,{for:"tab-time-charging"},{default:t(()=>[a(" Zeitladen ")]),_:1})]),default:t(()=>[e(z,{name:"tab-instant-charging"},{default:t(()=>[e(y,null,{default:t(()=>[e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("Stromstärke")]),_:1}),e(q,{unit:"A",min:6,max:32,"model-value":n.mqttStore.getChargePointConnectedVehicleInstantChargingCurrent(n.modalChargePointId),"onUpdate:modelValue":l[4]||(l[4]=o=>r.setChargePointConnectedVehicleInstantChargingCurrent(n.modalChargePointId,o))},null,8,["model-value"])]),_:1}),e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("Begrenzung")]),_:1}),e(x,{block:""},{default:t(()=>[e(g,{color:n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).selected=="none"?"primary":"",active:n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).selected=="none",onClick:l[5]||(l[5]=o=>r.setChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId,"none"))},{default:t(()=>[a(" Keine ")]),_:1},8,["color","active"]),e(g,{color:n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).selected=="soc"?"primary":"",active:n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).selected=="soc",onClick:l[6]||(l[6]=o=>r.setChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId,"soc"))},{default:t(()=>[a(" EV-SoC ")]),_:1},8,["color","active"]),e(g,{color:n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).selected=="amount"?"primary":"",active:n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).selected=="amount",onClick:l[7]||(l[7]=o=>r.setChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId,"amount"))},{default:t(()=>[a(" Energie ")]),_:1},8,["color","active"])]),_:1})]),_:1}),n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).selected=="soc"?(s(),P(V,{key:0},{default:t(()=>[e(b,null,{default:t(()=>[a("Max. SoC")]),_:1}),e(q,{unit:"%",min:5,max:100,step:5,"model-value":n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).soc,"onUpdate:modelValue":l[8]||(l[8]=o=>r.setChargePointConnectedVehicleInstantChargingLimitSoc(n.modalChargePointId,o))},null,8,["model-value"])]),_:1})):d("v-if",!0),n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).selected=="amount"?(s(),P(V,{key:1},{default:t(()=>[e(b,null,{default:t(()=>[a("Max. Energie")]),_:1}),e(q,{unit:"kWh",min:1,max:100,"model-value":n.mqttStore.getChargePointConnectedVehicleInstantChargingLimit(n.modalChargePointId).amount/1e3,"onUpdate:modelValue":l[9]||(l[9]=o=>r.setChargePointConnectedVehicleInstantChargingLimitAmount(n.modalChargePointId,o*1e3))},null,8,["model-value"])]),_:1})):d("v-if",!0)]),_:1})]),_:1}),e(z,{name:"tab-pv-charging"},{default:t(()=>[e(y,null,{default:t(()=>[e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("Einspeisegrenze beachten")]),_:1}),e(x,{block:""},{default:t(()=>[e(g,{color:n.mqttStore.getChargePointConnectedVehiclePvChargingFeedInLimit(n.modalChargePointId)!==!0?"danger":"",onClick:l[10]||(l[10]=o=>r.setChargePointConnectedVehiclePvChargingFeedInLimit(n.modalChargePointId,!1))},{default:t(()=>[a(" Nein ")]),_:1},8,["color"]),e(g,{color:n.mqttStore.getChargePointConnectedVehiclePvChargingFeedInLimit(n.modalChargePointId)===!0?"success":"",onClick:l[11]||(l[11]=o=>r.setChargePointConnectedVehiclePvChargingFeedInLimit(n.modalChargePointId,!0))},{default:t(()=>[a(" Ja ")]),_:1},8,["color"])]),_:1})]),_:1}),e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("Minimaler Dauerstrom")]),_:1}),e(q,{unit:"A",labels:[{label:"Aus",value:0},{label:6,value:6},{label:7,value:7},{label:8,value:8},{label:9,value:9},{label:10,value:10},{label:11,value:11},{label:12,value:12},{label:13,value:13},{label:14,value:14},{label:15,value:15},{label:16,value:16}],"model-value":n.mqttStore.getChargePointConnectedVehiclePvChargingMinCurrent(n.modalChargePointId),"onUpdate:modelValue":l[12]||(l[12]=o=>r.setChargePointConnectedVehiclePvChargingMinCurrent(n.modalChargePointId,o))},null,8,["model-value"])]),_:1}),e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("Mindest-SoC")]),_:1}),e(q,{unit:"%",labels:[{label:"Aus",value:0},{label:5,value:5},{label:10,value:10},{label:15,value:15},{label:20,value:20},{label:25,value:25},{label:30,value:30},{label:35,value:35},{label:40,value:40},{label:45,value:45},{label:50,value:50},{label:55,value:55},{label:60,value:60},{label:65,value:65},{label:70,value:70},{label:75,value:75},{label:80,value:80},{label:85,value:85},{label:90,value:90},{label:95,value:95}],"model-value":n.mqttStore.getChargePointConnectedVehiclePvChargingMinSoc(n.modalChargePointId),"onUpdate:modelValue":l[13]||(l[13]=o=>r.setChargePointConnectedVehiclePvChargingMinSoc(n.modalChargePointId,o))},null,8,["model-value"])]),_:1}),e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("Mindest-SoC Strom")]),_:1}),e(q,{min:6,max:32,unit:"A","model-value":n.mqttStore.getChargePointConnectedVehiclePvChargingMinSocCurrent(n.modalChargePointId),"onUpdate:modelValue":l[14]||(l[14]=o=>r.setChargePointConnectedVehiclePvChargingMinSocCurrent(n.modalChargePointId,o))},null,8,["model-value"])]),_:1}),e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("SoC-Limit")]),_:1}),e(q,{unit:"%",labels:[{label:5,value:5},{label:10,value:10},{label:15,value:15},{label:20,value:20},{label:25,value:25},{label:30,value:30},{label:35,value:35},{label:40,value:40},{label:45,value:45},{label:50,value:50},{label:55,value:55},{label:60,value:60},{label:65,value:65},{label:70,value:70},{label:75,value:75},{label:80,value:80},{label:85,value:85},{label:90,value:90},{label:95,value:95},{label:100,value:100},{label:"Aus",value:101}],"model-value":n.mqttStore.getChargePointConnectedVehiclePvChargingMaxSoc(n.modalChargePointId),"onUpdate:modelValue":l[15]||(l[15]=o=>r.setChargePointConnectedVehiclePvChargingMaxSoc(n.modalChargePointId,o))},null,8,["model-value"])]),_:1})]),_:1})]),_:1}),e(z,{name:"tab-scheduled-charging"},{default:t(()=>[Object.keys(n.mqttStore.getChargePointConnectedVehicleScheduledChargingPlans(n.modalChargePointId)).length===0?(s(),P(E,{key:0},{icon:t(()=>[e(C,{"fixed-width":"",icon:["fas","fa-info-circle"]})]),default:t(()=>[a(" Es wurden noch keine Zeitpläne für das Zielladen eingerichtet. ")]),_:1})):(s(),P(y,{key:1},{default:t(()=>[(s(!0),v(T,null,L(n.mqttStore.getChargePointConnectedVehicleScheduledChargingPlans(n.modalChargePointId),(o,S)=>(s(),P(V,{key:S},{default:t(()=>[e(N,null,{default:t(()=>[e(m,null,{default:t(()=>[e(b,null,{default:t(()=>[a(u(o.name),1)]),_:2},1024)]),_:2},1024),e(m,null,{default:t(()=>[e(g,{size:"lg",block:"",color:o.active?"success":"danger",onClick:G=>r.setChargePointConnectedVehicleScheduledChargingPlanActive(S,!o.active)},{default:t(()=>[o.frequency.selected=="once"?(s(),v("span",Be,[e(C,{"fixed-width":"",icon:["fas","calendar-day"]}),a(" "+u(n.mqttStore.formatDate(o.frequency.once)),1)])):d("v-if",!0),o.frequency.selected=="daily"?(s(),v("span",Le,[e(C,{"fixed-width":"",icon:["fas","calendar-week"]}),a(" täglich ")])):d("v-if",!0),o.frequency.selected=="weekly"?(s(),v("span",Me,[e(C,{"fixed-width":"",icon:["fas","calendar-alt"]}),a(" "+u(n.mqttStore.formatWeeklyScheduleDays(o.frequency.weekly)),1)])):d("v-if",!0),e(C,{"fixed-width":"",icon:["fas","clock"]}),a(" "+u(o.time)+" ",1),o.limit.selected=="soc"?(s(),v("span",ze,[e(C,{"fixed-width":"",icon:["fas","car-battery"]}),a(" "+u(o.limit.soc_scheduled)+" % ",1)])):d("v-if",!0),o.limit.selected=="amount"?(s(),v("span",Ae,[e(C,{"fixed-width":"",icon:["fas","bolt"]}),a(" "+u(o.limit.amount/1e3)+" kWh ",1)])):d("v-if",!0)]),_:2},1032,["color","onClick"])]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]),_:1}))]),_:1}),e(z,{name:"tab-time-charging"},{default:t(()=>[e(y,null,{default:t(()=>[e(V,null,{default:t(()=>[e(b,null,{default:t(()=>[a("Zeitladen aktivieren")]),_:1}),e(x,{block:""},{default:t(()=>[e(g,{color:n.mqttStore.getChargePointConnectedVehicleTimeChargingActive(n.modalChargePointId)!==!0?"danger":"",onClick:l[16]||(l[16]=o=>r.setChargePointConnectedVehicleTimeChargingActive(n.modalChargePointId,!1))},{default:t(()=>[a(" Nein ")]),_:1},8,["color"]),e(g,{color:n.mqttStore.getChargePointConnectedVehicleTimeChargingActive(n.modalChargePointId)===!0?"success":"",onClick:l[17]||(l[17]=o=>r.setChargePointConnectedVehicleTimeChargingActive(n.modalChargePointId,!0))},{default:t(()=>[a(" Ja ")]),_:1},8,["color"])]),_:1})]),_:1}),n.mqttStore.getChargePointConnectedVehicleTimeChargingActive(n.modalChargePointId)===!0?(s(),v("div",Ne,[Object.keys(n.mqttStore.getChargePointConnectedVehicleTimeChargingPlans(n.modalChargePointId)).length===0?(s(),P(E,{key:0,color:"warning",class:"_margin-top:2"},{icon:t(()=>[e(C,{"fixed-width":"",icon:["fas","fa-circle-info"]})]),default:t(()=>[a(" Es wurden noch keine Zeitpläne für das Zeitladen eingerichtet. ")]),_:1})):(s(),v("div",We,[(s(!0),v(T,null,L(n.mqttStore.getChargePointConnectedVehicleTimeChargingPlans(n.modalChargePointId),(o,S)=>(s(),P(V,{key:S},{default:t(()=>[e(N,null,{default:t(()=>[e(m,null,{default:t(()=>[e(b,null,{default:t(()=>[a(u(o.name),1)]),_:2},1024)]),_:2},1024),e(m,null,{default:t(()=>[e(g,{size:"lg",block:"",color:o.active?"success":"danger",onClick:G=>r.setChargePointConnectedVehicleTimeChargingPlanActive(S,!o.active)},{default:t(()=>[o.frequency.selected=="once"?(s(),v("span",Fe,[e(C,{"fixed-width":"",icon:["fas","calendar-day"]}),a(" "+u(n.mqttStore.formatDateRange(o.frequency.once)),1)])):d("v-if",!0),o.frequency.selected=="daily"?(s(),v("span",Ue,[e(C,{"fixed-width":"",icon:["fas","calendar-week"]}),a(" täglich ")])):d("v-if",!0),o.frequency.selected=="weekly"?(s(),v("span",De,[e(C,{"fixed-width":"",icon:["fas","calendar-alt"]}),a(" "+u(n.mqttStore.formatWeeklyScheduleDays(o.frequency.weekly)),1)])):d("v-if",!0),e(C,{"fixed-width":"",icon:["fas","clock"]}),a(" "+u(o.time.join("-"))+" ",1),o.limit.selected=="soc"?(s(),v("span",Ee,[e(C,{"fixed-width":"",icon:["fas","car-battery"]}),a(" "+u(o.limit.soc)+" % ",1)])):d("v-if",!0),o.limit.selected=="amount"?(s(),v("span",Ze,[e(C,{"fixed-width":"",icon:["fas","bolt"]}),a(" "+u(o.limit.amount/1e3)+" kWh ",1)])):d("v-if",!0)]),_:2},1032,["color","onClick"])]),_:2},1024)]),_:2},1024)]),_:2},1024))),128))]))])):d("v-if",!0)]),_:1})]),_:1})]),_:1},8,["modelValue"])]),_:1},8,["modelValue"]),d(" end charge point settings modal"),d(" manual soc input "),e(X,{vehicleId:n.modalVehicleId,modelValue:n.modalManualSocInputVisible,"onUpdate:modelValue":l[20]||(l[20]=o=>n.modalManualSocInputVisible=o)},null,8,["vehicleId","modelValue"]),d(" end manual soc input ")],64)}const Ke=A(xe,[["render",je],["__scopeId","data-v-dd5faf5e"],["__file","/var/www/html/openWB/packages/modules/display_themes/cards/source/src/views/ChargePointsView.vue"]]);export{Ke as default};