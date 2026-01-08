"use strict";(()=>{var e={};e.id=2830,e.ids=[2830],e.modules={20399:e=>{e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},30517:e=>{e.exports=require("next/dist/compiled/next-server/app-route.runtime.prod.js")},11687:(e,t,r)=>{r.r(t),r.d(t,{originalPathname:()=>m,patchFetch:()=>x,requestAsyncStorage:()=>p,routeModule:()=>d,serverHooks:()=>l,staticGenerationAsyncStorage:()=>c});var o={};r.r(o),r.d(o,{POST:()=>i});var a=r(49303),s=r(88716),n=r(60670),u=r(87070);async function i(e){try{let{orderId:t,status:r,reason:o}=await e.json();if(!t||!r)return u.NextResponse.json({error:"Param\xe8tres manquants"},{status:400});let a="",s="";return"verified"===r?(a=`Votre commande #${t} a \xe9t\xe9 valid\xe9e`,s=`
Bonjour,

Votre commande #${t} a \xe9t\xe9 valid\xe9e avec succ\xe8s.
Notre \xe9quipe prepare maintenant votre commande pour l'exp\xe9dition.

Vous recevrez une notification quand votre colis sera en route.

Cordialement,
TsarstvoDereva
      `):"rejected"===r&&(a=`Votre commande #${t} a \xe9t\xe9 rejet\xe9e`,s=`
Bonjour,

Votre commande #${t} a \xe9t\xe9 rejet\xe9e.
${o?`Raison: ${o}`:""}

Veuillez nous contacter pour plus d'informations.

Cordialement,
TsarstvoDereva
      `),console.log("Email envoy\xe9 au client"),console.log("Sujet:",a),console.log("Contenu:",s),u.NextResponse.json({success:!0,message:`Commande #${t} ${"verified"===r?"valid\xe9e":"rejet\xe9e"}`,orderId:t},{status:200})}catch(e){return console.error("Erreur:",e),u.NextResponse.json({error:"Erreur lors de la mise \xe0 jour de la commande"},{status:500})}}let d=new a.AppRouteRouteModule({definition:{kind:s.x.APP_ROUTE,page:"/api/orders/update-status/route",pathname:"/api/orders/update-status",filename:"route",bundlePath:"app/api/orders/update-status/route"},resolvedPagePath:"/home/deo/Desktop/bois/app/api/orders/update-status/route.ts",nextConfigOutput:"",userland:o}),{requestAsyncStorage:p,staticGenerationAsyncStorage:c,serverHooks:l}=d,m="/api/orders/update-status/route";function x(){return(0,n.patchFetch)({serverHooks:l,staticGenerationAsyncStorage:c})}}};var t=require("../../../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),o=t.X(0,[9276,5972],()=>r(11687));module.exports=o})();