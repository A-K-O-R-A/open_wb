import{_ as c,p as o,k as u,l as p,A as t,L as s,u as a,q as d,x as l}from"./vendor-03b35897.js";import"./vendor-sortablejs-31643b9d.js";const _={name:"DeviceSunnyBoyCounter",emits:["update:configuration"],props:{configuration:{type:Object,required:!0},deviceId:{default:void 0},componentId:{required:!0}},methods:{updateConfiguration(e,n=void 0){this.$emit("update:configuration",{value:e,object:n})}}},f={class:"device-sunnyboy-counter"},m={class:"small"};function b(e,n,g,y,h,v){const i=o("openwb-base-heading"),r=o("openwb-base-alert");return u(),p("div",f,[t(i,null,{default:s(()=>[a(" Einstellungen für SMA Sunny Boy/Tripower Zähler "),d("span",m,"(Modul: "+l(e.$options.name)+")",1)]),_:1}),t(r,{subtype:"info"},{default:s(()=>[a(" Diese Komponente benötigt keine Einstellungen. ")]),_:1})])}const $=c(_,[["render",b],["__file","/opt/openWB-dev/openwb-ui-settings/src/components/devices/sma_sunny_boy/counter.vue"]]);export{$ as default};