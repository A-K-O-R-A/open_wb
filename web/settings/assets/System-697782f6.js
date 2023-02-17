import{l as V,Z as F,p as x,_ as q,O as A,$ as D,a0 as U,a1 as T,a2 as E,a3 as j,F as z}from"./vendor-fortawesome-6c4715bf.js";import{C as I}from"./index-f492127f.js";import{_ as $,q as p,l as _,m as y,A as t,K as o,u as s,v as l,p as g,y as O,F as N,G as L,z as B,x as W,P as H,Q as M}from"./vendor-5f866419.js";import"./vendor-bootstrap-22773050.js";import"./vendor-jquery-b0d74e8f.js";import"./vendor-axios-e1e2ff98.js";import"./vendor-sortablejs-793d687d.js";V.add(F,x,q,A,D,U,T,E,j);const P={name:"OpenwbSystem",mixins:[I],emits:["sendCommand"],components:{FontAwesomeIcon:z},data(){return{mqttTopicsToSubscribe:["openWB/system/current_commit","openWB/system/current_branch_commit","openWB/system/current_missing_commits","openWB/system/available_branches","openWB/system/current_branch"],warningAcknowledged:!1,selectedTag:"*HEAD*",selectedFile:void 0,restoreUploadDone:!1}},computed:{updateAvailable(){return this.$store.state.mqtt["openWB/system/current_branch_commit"]&&this.$store.state.mqtt["openWB/system/current_branch_commit"]!=this.$store.state.mqtt["openWB/system/current_commit"]},releaseChangeValid(){return this.$store.state.mqtt["openWB/system/current_branch"]in this.$store.state.mqtt["openWB/system/available_branches"]&&"tags"in this.$store.state.mqtt["openWB/system/available_branches"][this.$store.state.mqtt["openWB/system/current_branch"]]&&(this.selectedTag in this.$store.state.mqtt["openWB/system/available_branches"][this.$store.state.mqtt["openWB/system/current_branch"]].tags||this.selectedTag=="*HEAD*")}},methods:{sendSystemCommand(n,e={}){this.$emit("sendCommand",{command:n,data:e})},getBranchOptions(){var n=this.$store.state.mqtt["openWB/system/available_branches"],e=[];if(n!==void 0)for(const[r,d]of Object.entries(n))e.push({value:r,text:r+" ("+d.commit+")"});return e},getBranchTagOptions(){if(!(this.$store.state.mqtt["openWB/system/current_branch"]in this.$store.state.mqtt["openWB/system/available_branches"]))return[];var n=this.$store.state.mqtt["openWB/system/available_branches"][this.$store.state.mqtt["openWB/system/current_branch"]].tags,e=[];if(n!==void 0)for(const[r,d]of Object.entries(n))e.unshift({value:r,text:d});return e.unshift({value:"*HEAD*",text:"Aktuellster Stand"}),e},updateSelectedFile(n){this.selectedFile=n.target.files[0],console.log("selectedFile",this.selectedFile)},uploadFile(){if(this.selectedFile!==void 0){let n=new FormData;n.append("backupFile",this.selectedFile),this.axios.post(location.protocol+"//"+location.host+"/openWB/web/settings/uploadBackup.php",n,{headers:{"Content-Type":"multipart/form-data"}}).then(e=>{console.log("POST response",e.data);const r="Die Sicherungsdatei wurde erfolgreich hochgeladen. Sie können die Wiederherstellung jetzt starten.",d=Math.floor(Date.now()/1e3);this.$store.commit("addTopic",{topic:"openWB/command/"+this.$root.mqttClientId+"/messages/"+d,payload:{source:"command",type:"success",message:r,timestamp:d}}),this.restoreUploadDone=!0}).catch(e=>{var r="Hochladen der Datei fehlgeschlagen!<br />";e.response?(console.log(e.response.status,e.response.data),r+=e.response.status+": "+e.response.data):e.request?(console.log(e.request),r+="Es wurde keine Antwort vom Server empfangen."):(console.log("Error",e.message),r+="Es ist ein unbekannter Fehler aufgetreten.");const d=Math.floor(Date.now()/1e3);this.$store.commit("addTopic",{topic:"openWB/command/"+this.$root.mqttClientId+"/messages/"+d,payload:{source:"command",type:"danger",message:r,timestamp:d}}),this.restoreUploadDone=!1})}else console.error("no file selected for upload")}}},h=n=>(H("data-v-059847f6"),n=n(),M(),n),Z={class:"system"},G=h(()=>s("h2",null,"Achtung!",-1)),R=h(()=>s("p",null," Vor allen Aktionen auf dieser Seite ist sicherzustellen, dass kein Ladevorgang aktiv ist! Zur Sicherheit bitte zusätzlich alle Fahrzeuge von der Ladestation / den Ladestationen abstecken! ",-1)),J={key:0},K={name:"versionInfoForm"},Q={class:"missing-commits"},X={class:"row justify-content-center"},Y={class:"col-md-4 d-flex py-1 justify-content-center"},ee={class:"col-md-4 d-flex py-1 justify-content-center"},te={name:"backupRestoreForm"},se=h(()=>s("a",{href:"/openWB/data/backup/",target:"_blank"},"hier",-1)),ne={class:"row justify-content-center"},oe={class:"col-md-4 d-flex py-1 justify-content-center"},ae=h(()=>s("hr",null,null,-1)),le=h(()=>s("br",null,null,-1)),ie=h(()=>s("br",null,null,-1)),re={class:"input-group"},de={class:"input-group-prepend"},ce={class:"input-group-text"},ue={class:"custom-file"},me={id:"input-file-label",class:"custom-file-label",for:"input-file","data-browse":"Suchen"},pe={class:"input-group-append"},he=["disabled"],be={class:"row justify-content-center"},fe={class:"col-md-4 d-flex py-1 justify-content-center"},_e={name:"powerForm"},ge={class:"row justify-content-center"},ye={class:"col-md-4 d-flex py-1 justify-content-center"},we={class:"col-md-4 d-flex py-1 justify-content-center"},ve={name:"releaseChangeForm"},ke=h(()=>s("br",null,null,-1)),Be=h(()=>s("ul",null,[s("li",null,"do not allow downgrade")],-1)),We={class:"row justify-content-center"},Se={class:"col-md-4 d-flex py-1 justify-content-center"};function Ce(n,e,r,d,c,i){const S=p("openwb-base-button-group-input"),m=p("openwb-base-alert"),w=p("openwb-base-text-input"),f=p("openwb-base-card"),u=p("font-awesome-icon"),b=p("openwb-base-click-button"),v=p("openwb-base-heading"),k=p("openwb-base-select-input");return _(),y("div",Z,[t(m,{subtype:"danger"},{default:o(()=>[G,R,t(S,{title:"Ich habe die Warnung verstanden",buttons:[{buttonValue:!1,text:"Nein",class:"btn-outline-danger"},{buttonValue:!0,text:"Ja",class:"btn-outline-success"}],modelValue:this.warningAcknowledged,"onUpdate:modelValue":e[0]||(e[0]=a=>this.warningAcknowledged=a)},null,8,["modelValue"])]),_:1}),c.warningAcknowledged?(_(),y("div",J,[s("form",K,[t(f,{title:"Versions-Informationen / Aktualisierung",subtype:"success",collapsible:!0,collapsed:!0},{footer:o(()=>[s("div",X,[s("div",Y,[t(b,{class:"btn-info",onButtonClicked:e[4]||(e[4]=a=>i.sendSystemCommand("systemFetchVersions"))},{default:o(()=>[l(" Informationen aktualisieren "),t(u,{"fixed-width":"",icon:["fas","download"]})]),_:1})]),s("div",ee,[t(b,{class:g(i.updateAvailable?"btn-success clickable":"btn-outline-success"),disabled:!i.updateAvailable,onButtonClicked:e[5]||(e[5]=a=>i.sendSystemCommand("systemUpdate",{}))},{default:o(()=>[l(" Update "),t(u,{"fixed-width":"",icon:["fas","arrow-alt-circle-up"]})]),_:1},8,["class","disabled"])])])]),default:o(()=>[t(w,{title:"Entwicklungszweig",readonly:"",modelValue:n.$store.state.mqtt["openWB/system/current_branch"],"onUpdate:modelValue":e[1]||(e[1]=a=>n.$store.state.mqtt["openWB/system/current_branch"]=a)},null,8,["modelValue"]),t(w,{title:"installierte Version",readonly:"",class:g(i.updateAvailable?"text-danger":"text-success"),modelValue:n.$store.state.mqtt["openWB/system/current_commit"],"onUpdate:modelValue":e[2]||(e[2]=a=>n.$store.state.mqtt["openWB/system/current_commit"]=a)},null,8,["class","modelValue"]),t(w,{title:"aktuellste Version",readonly:"",modelValue:n.$store.state.mqtt["openWB/system/current_branch_commit"],"onUpdate:modelValue":e[3]||(e[3]=a=>n.$store.state.mqtt["openWB/system/current_branch_commit"]=a)},null,8,["modelValue"]),i.updateAvailable?(_(),O(f,{key:0,title:"Änderungen",subtype:"info",collapsible:!0,collapsed:!0},{default:o(()=>[s("ul",Q,[(_(!0),y(N,null,L(n.$store.state.mqtt["openWB/system/current_missing_commits"],(a,C)=>(_(),y("li",{key:C},W(a),1))),128))])]),_:1})):B("v-if",!0),t(m,{subtype:"danger"},{default:o(()=>[l(" Nach einem Update wird die Ladestation direkt neu gestartet! Es werden alle eventuell vorhandenen lokalen Änderungen am Programmcode mit dem Update verworfen! ")]),_:1})]),_:1})]),s("form",te,[t(f,{title:"Sicherung / Wiederherstellung",subtype:"success",collapsible:!0,collapsed:!0},{footer:o(()=>[]),default:o(()=>[t(v,null,{default:o(()=>[l("Sicherung")]),_:1}),t(m,{subtype:"danger"},{default:o(()=>[l(' Aktuell können nur Sicherungen wiederhergestellt werden, die in den Entwicklungszweigen "master" oder "Beta" erstellt wurden! ')]),_:1}),t(m,{subtype:"info"},{default:o(()=>[l(" Nachdem die Sicherung abgeschlossen ist, kann die erstellte Datei über den Link in der Benachrichtigung oder "),se,l(" heruntergeladen werden. ")]),_:1}),s("div",ne,[s("div",oe,[t(b,{class:"btn-success clickable",onButtonClicked:e[6]||(e[6]=a=>i.sendSystemCommand("createBackup",{use_extended_filename:!0}))},{default:o(()=>[l(" Sicherung erstellen "),t(u,{"fixed-width":"",icon:["fas","archive"]})]),_:1})])]),ae,t(v,null,{default:o(()=>[l("Wiederherstellung")]),_:1}),t(m,{subtype:"danger"},{default:o(()=>[l(" Diese Funktion ist noch in Entwicklung! Es kann potentiell das System unbrauchbar werden. Nach Möglichkeit vorher ein Image der Installation erstellen!"),le,l(" Für die Wiederherstellung wird eine aktive Internetverbindung benötigt."),ie,l(' Aktuell können nur Sicherungen wiederhergestellt werden, die in den Entwicklungszweigen "master" oder "Beta" erstellt wurden! ')]),_:1}),s("div",re,[s("div",de,[s("div",ce,[t(u,{"fixed-width":"",icon:["fas","file-archive"]})])]),s("div",ue,[s("input",{id:"input-file",type:"file",class:"custom-file-input",accept:".tar.gz,application/gzip,application/tar+gzip",onChange:e[7]||(e[7]=a=>i.updateSelectedFile(a))},null,32),s("label",me,W(c.selectedFile?c.selectedFile.name:"Bitte eine Datei auswählen"),1)]),s("div",pe,[s("button",{class:g(["btn",c.selectedFile?"btn-success clickable":"btn-outline-success"]),disabled:!c.selectedFile,type:"button",onClick:e[8]||(e[8]=a=>i.uploadFile())},[l(" Hochladen "),t(u,{"fixed-width":"",icon:["fas","upload"]})],10,he)])]),s("div",be,[s("div",fe,[t(b,{class:g(c.restoreUploadDone?"btn-success clickable":"btn-outline-success"),disabled:!c.restoreUploadDone,onButtonClicked:e[9]||(e[9]=a=>i.sendSystemCommand("restoreBackup"))},{default:o(()=>[l(" Wiederherstellung starten "),t(u,{"fixed-width":"",icon:["fas","box-open"]})]),_:1},8,["class","disabled"])])])]),_:1})]),s("form",_e,[t(f,{title:"Betrieb",collapsible:!0,collapsed:!0},{footer:o(()=>[s("div",ge,[s("div",ye,[t(b,{class:"btn-warning",onButtonClicked:e[10]||(e[10]=a=>i.sendSystemCommand("systemReboot"))},{default:o(()=>[l(" Neustart "),t(u,{"fixed-width":"",icon:["fas","undo"]})]),_:1})]),s("div",we,[t(b,{class:"btn-danger",onButtonClicked:e[11]||(e[11]=a=>i.sendSystemCommand("systemShutdown"))},{default:o(()=>[l(" Ausschalten "),t(u,{"fixed-width":"",icon:["fas","power-off"]})]),_:1})])])]),default:o(()=>[t(m,{subtype:"danger"},{default:o(()=>[l(" Wenn die Ladestation ausgeschaltet wird, muss sie komplett spannungsfrei geschaltet werden. Erst beim erneuten Zuschalten der Spannung fährt das System wieder hoch. ")]),_:1})]),_:1})]),s("form",ve,[t(f,{title:"Entwicklungszweig",subtype:"danger",collapsible:!0,collapsed:!0},{footer:o(()=>[s("div",We,[s("div",Se,[t(b,{class:g(i.releaseChangeValid?"btn-danger clickable":"btn-outline-danger"),disabled:!i.releaseChangeValid,onButtonClicked:e[14]||(e[14]=a=>i.sendSystemCommand("systemUpdate",{branch:n.$store.state.mqtt["openWB/system/current_branch"],tag:c.selectedTag}))},{default:o(()=>[t(u,{"fixed-width":"",icon:["fas","skull-crossbones"]}),l(" Branch und Tag wechseln "),t(u,{"fixed-width":"",icon:["fas","skull-crossbones"]})]),_:1},8,["class","disabled"])])])]),default:o(()=>[t(m,{subtype:"danger"},{default:o(()=>[l(" Nach einem Wechsel wird die Ladestation direkt neu gestartet! Es werden alle lokalen Änderungen mit dem Wechsel verworfen! ")]),_:1}),t(m,{subtype:"warning"},{default:o(()=>[l(" Das ist eine experimentelle Option! Verwendung auf eigene Gefahr. Im schlimmsten Fall muss das system neu installiert werden!"),ke,l(" ToDo: "),Be]),_:1}),t(k,{title:"Entwicklungszweig",options:i.getBranchOptions(),"model-value":n.$store.state.mqtt["openWB/system/current_branch"],"onUpdate:modelValue":e[12]||(e[12]=a=>n.updateState("openWB/system/current_branch",a))},null,8,["options","model-value"]),t(k,{title:"Tag",options:i.getBranchTagOptions(),modelValue:c.selectedTag,"onUpdate:modelValue":e[13]||(e[13]=a=>c.selectedTag=a)},null,8,["options","modelValue"])]),_:1})])])):B("v-if",!0)])}const Te=$(P,[["render",Ce],["__scopeId","data-v-059847f6"],["__file","/opt/openWB-dev/openwb-ui-settings/src/views/System.vue"]]);export{Te as default};