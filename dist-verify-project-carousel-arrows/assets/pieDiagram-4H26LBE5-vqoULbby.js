import{g as e,h as t}from"./src-Gc0VHc7x.js";import{t as n}from"./ordinal-DCsgWfZW.js";import{n as r}from"./path-yo4Xej8w.js";import{t as i}from"./arc-CXOFozwo.js";import{t as a}from"./array-C0548cPn.js";import{Bt as o,It as s,Lt as c,N as l,O as u,Ot as d,Pt as f,Qt as p,Rt as m,Vt as h,Zt as g,en as _,jt as v,pt as y}from"./index-BY3_yBfX.js";import{t as b}from"./chunk-4BX2VUAB-UyKAQL9s.js";import{t as x}from"./mermaid-parser.core-BheaWB-g.js";function S(e,t){return t<e?-1:t>e?1:t>=e?0:NaN}function C(e){return e}function w(){var e=C,t=S,n=null,i=r(0),o=r(d),s=r(0);function c(r){var c,l=(r=a(r)).length,u,f,p=0,m=Array(l),h=Array(l),g=+i.apply(this,arguments),_=Math.min(d,Math.max(-d,o.apply(this,arguments)-g)),v,y=Math.min(Math.abs(_)/l,s.apply(this,arguments)),b=y*(_<0?-1:1),x;for(c=0;c<l;++c)(x=h[m[c]=c]=+e(r[c],c,r))>0&&(p+=x);for(t==null?n!=null&&m.sort(function(e,t){return n(r[e],r[t])}):m.sort(function(e,n){return t(h[e],h[n])}),c=0,f=p?(_-l*b)/p:0;c<l;++c,g=v)u=m[c],x=h[u],v=g+(x>0?x*f:0)+b,h[u]={data:r[u],index:c,value:x,startAngle:g,endAngle:v,padAngle:y};return h}return c.value=function(t){return arguments.length?(e=typeof t==`function`?t:r(+t),c):e},c.sortValues=function(e){return arguments.length?(t=e,n=null,c):t},c.sort=function(e){return arguments.length?(n=e,t=null,c):n},c.startAngle=function(e){return arguments.length?(i=typeof e==`function`?e:r(+e),c):i},c.endAngle=function(e){return arguments.length?(o=typeof e==`function`?e:r(+e),c):o},c.padAngle=function(e){return arguments.length?(s=typeof e==`function`?e:r(+e),c):s},c}var T=s.pie,E={sections:new Map,showData:!1,config:T},D=E.sections,O=E.showData,k=structuredClone(T),A={getConfig:t(()=>structuredClone(k),`getConfig`),clear:t(()=>{D=new Map,O=E.showData,v()},`clear`),setDiagramTitle:_,getDiagramTitle:h,setAccTitle:p,getAccTitle:m,setAccDescription:g,getAccDescription:c,addSection:t(({label:t,value:n})=>{if(n<0)throw Error(`"${t}" has invalid value: ${n}. Negative values are not allowed in pie charts. All slice values must be >= 0.`);D.has(t)||(D.set(t,n),e.debug(`added new section: ${t}, with value: ${n}`))},`addSection`),getSections:t(()=>D,`getSections`),setShowData:t(e=>{O=e},`setShowData`),getShowData:t(()=>O,`getShowData`)},j=t((e,t)=>{b(e,t),t.setShowData(e.showData),e.sections.map(t.addSection)},`populateDb`),M={parse:t(async t=>{let n=await x(`pie`,t);e.debug(n),j(n,A)},`parse`)},N=t(e=>`
  .pieCircle{
    stroke: ${e.pieStrokeColor};
    stroke-width : ${e.pieStrokeWidth};
    opacity : ${e.pieOpacity};
  }
  .pieOuterCircle{
    stroke: ${e.pieOuterStrokeColor};
    stroke-width: ${e.pieOuterStrokeWidth};
    fill: none;
  }
  .pieTitleText {
    text-anchor: middle;
    font-size: ${e.pieTitleTextSize};
    fill: ${e.pieTitleTextColor};
    font-family: ${e.fontFamily};
  }
  .slice {
    font-family: ${e.fontFamily};
    fill: ${e.pieSectionTextColor};
    font-size:${e.pieSectionTextSize};
    // fill: white;
  }
  .legend text {
    fill: ${e.pieLegendTextColor};
    font-family: ${e.fontFamily};
    font-size: ${e.pieLegendTextSize};
  }
`,`getStyles`),P=t(e=>{let t=[...e.values()].reduce((e,t)=>e+t,0),n=[...e.entries()].map(([e,t])=>({label:e,value:t})).filter(e=>e.value/t*100>=1);return w().value(e=>e.value).sort(null)(n)},`createPieArcs`),F={parser:M,db:A,renderer:{draw:t((t,r,a,s)=>{e.debug(`rendering pie chart
`+t);let c=s.db,d=o(),p=u(c.getConfig(),d.pie),m=y(r),h=m.append(`g`);h.attr(`transform`,`translate(225,225)`);let{themeVariables:g}=d,[_]=l(g.pieOuterStrokeWidth);_??=2;let v=p.textPosition,b=i().innerRadius(0).outerRadius(185),x=i().innerRadius(185*v).outerRadius(185*v);h.append(`circle`).attr(`cx`,0).attr(`cy`,0).attr(`r`,185+_/2).attr(`class`,`pieOuterCircle`);let S=c.getSections(),C=P(S),w=[g.pie1,g.pie2,g.pie3,g.pie4,g.pie5,g.pie6,g.pie7,g.pie8,g.pie9,g.pie10,g.pie11,g.pie12],T=0;S.forEach(e=>{T+=e});let E=C.filter(e=>(e.data.value/T*100).toFixed(0)!==`0`),D=n(w).domain([...S.keys()]);h.selectAll(`mySlices`).data(E).enter().append(`path`).attr(`d`,b).attr(`fill`,e=>D(e.data.label)).attr(`class`,`pieCircle`),h.selectAll(`mySlices`).data(E).enter().append(`text`).text(e=>(e.data.value/T*100).toFixed(0)+`%`).attr(`transform`,e=>`translate(`+x.centroid(e)+`)`).style(`text-anchor`,`middle`).attr(`class`,`slice`);let O=h.append(`text`).text(c.getDiagramTitle()).attr(`x`,0).attr(`y`,-400/2).attr(`class`,`pieTitleText`),k=[...S.entries()].map(([e,t])=>({label:e,value:t})),A=h.selectAll(`.legend`).data(k).enter().append(`g`).attr(`class`,`legend`).attr(`transform`,(e,t)=>{let n=22*k.length/2;return`translate(216,`+(t*22-n)+`)`});A.append(`rect`).attr(`width`,18).attr(`height`,18).style(`fill`,e=>D(e.label)).style(`stroke`,e=>D(e.label)),A.append(`text`).attr(`x`,22).attr(`y`,14).text(e=>c.getShowData()?`${e.label} [${e.value}]`:e.label);let j=512+Math.max(...A.selectAll(`text`).nodes().map(e=>e?.getBoundingClientRect().width??0)),M=O.node()?.getBoundingClientRect().width??0,N=450/2-M/2,F=450/2+M/2,I=Math.min(0,N),L=Math.max(j,F)-I;m.attr(`viewBox`,`${I} 0 ${L} 450`),f(m,450,L,p.useMaxWidth)},`draw`)},styles:N};export{F as diagram};