import{_ as l,q as n,k as _,l as m,B as o,M as s,x as a,u as b,y as f}from"./vendor-b03da118.js";import"./vendor-sortablejs-595f2e06.js";const v={name:"DeviceSunnyBoy",emits:["update:configuration"],props:{configuration:{type:Object,required:!0},deviceId:{default:void 0}},methods:{updateConfiguration(t,e=void 0){this.$emit("update:configuration",{value:t,object:e})}}},y={class:"device-sunnyboy"},g={class:"small"};function w(t,e,i,h,x,r){const d=n("openwb-base-heading"),u=n("openwb-base-alert"),p=n("openwb-base-text-input");return _(),m("div",y,[o(d,null,{default:s(()=>[a(" Einstellungen für SMA Sunny Boy/Tripower "),b("span",g,"(Modul: "+f(t.$options.name)+")",1)]),_:1}),o(u,{subtype:"info"},{default:s(()=>[a(' ModbusTCP muss entweder direkt am Wechselrichter, per Sunny Portal oder über das Tool "Sunny Explorer" aktiviert werden. Dies ist standardmäßig deaktiviert. ')]),_:1}),o(p,{title:"IP oder Hostname",subtype:"host",required:"","model-value":i.configuration.ip_address,"onUpdate:modelValue":e[0]||(e[0]=c=>r.updateConfiguration(c,"configuration.ip_address"))},null,8,["model-value"])])}const S=l(v,[["render",w],["__file","/opt/openWB-dev/openwb-ui-settings/src/components/devices/sma_sunny_boy/device.vue"]]);export{S as default};