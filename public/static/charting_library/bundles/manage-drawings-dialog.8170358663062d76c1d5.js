(self.webpackChunktradingview=self.webpackChunktradingview||[]).push([[1702],{4914:e=>{e.exports={itemRow:"itemRow-BadjY5sX",active:"active-BadjY5sX",selected:"selected-BadjY5sX",mobile:"mobile-BadjY5sX",itemInfo:"itemInfo-BadjY5sX",title:"title-BadjY5sX",details:"details-BadjY5sX",itemInfoWithPadding:"itemInfoWithPadding-BadjY5sX",favoriteButton:"favoriteButton-BadjY5sX",favorite:"favorite-BadjY5sX",removeButton:"removeButton-BadjY5sX"}},18929:e=>{e.exports={dialog:"dialog-lmxpCvnK",dialogWrapper:"dialogWrapper-lmxpCvnK",wrap:"wrap-lmxpCvnK"}},68016:e=>{e.exports={title:"title-QPktCwTY",container:"container-QPktCwTY",mobile:"mobile-QPktCwTY",empty:"empty-QPktCwTY",image:"image-QPktCwTY",spinner:"spinner-QPktCwTY",contentList:"contentList-QPktCwTY",item:"item-QPktCwTY"}},64530:(e,t,n)=>{"use strict";n.d(t,{DialogContentItem:()=>m});var i=n(50959),a=n(97754),l=n.n(a),o=n(49483),s=n(36189),r=n(96040);function c(e){const{url:t,...n}=e;return t?i.createElement("a",{...n,href:t}):i.createElement("div",{...n})}var u=n(60925),d=n(4914);function m(e){const{title:t,subtitle:n,removeBtnLabel:a,onClick:m,onClickFavorite:h,onClickRemove:g,isActive:f,isSelected:w,isFavorite:C,isMobile:b=!1,showFavorite:p=!0,className:y,...E}=e;return i.createElement(c,{...E,className:l()(d.itemRow,f&&!w&&d.active,b&&d.mobile,w&&d.selected,y),onClick:v.bind(null,m),"data-role":"list-item","data-active":f},p&&h&&i.createElement(s.FavoriteButton,{className:l()(d.favoriteButton,C&&d.favorite,o.CheckMobile.any()&&d.mobile),isActive:f&&!w,isFilled:C,onClick:v.bind(null,h),"data-name":"list-item-favorite-button","data-favorite":C}),i.createElement("div",{className:l()(d.itemInfo,!p&&d.itemInfoWithPadding)},i.createElement("div",{className:l()(d.title,f&&!w&&d.active,b&&d.mobile),"data-name":"list-item-title"},t),i.createElement("div",{className:l()(d.details,f&&!w&&d.active,b&&d.mobile)},n)),i.createElement(r.RemoveButton,{className:d.removeButton,isActive:f&&!w,onClick:v.bind(null,g),"data-name":"list-item-remove-button",title:a,icon:u}))}function v(e,t){t.defaultPrevented||(t.preventDefault(),e(t))}},41662:(e,t,n)=>{"use strict";n.r(t),n.d(t,{ManageDrawingsDialogRenderer:()=>v});var i=n(50959),a=n(11542),l=n(16216),o=n(77788),s=n(79418),r=n(11386),c=n(18929);class u extends i.PureComponent{constructor(e){super(e),this._dialogRef=i.createRef(),this._renderChildren=e=>i.createElement("div",{className:c.wrap},i.createElement(r.ManageDrawings,{isSmallWidth:e.isSmallWidth,chartWidget:this._activeChartWidget}));const t=(0,l.service)(o.CHART_WIDGET_COLLECTION_SERVICE);this._activeChartWidget=t.activeChartWidget.value(),this.state={layoutName:t.metaInfo.name.value()}}render(){return i.createElement(s.AdaptivePopupDialog,{wrapperClassName:c.dialogWrapper,className:c.dialog,dataName:"manage-drawings-dialog",isOpened:!0,onClickOutside:this.props.onClose,onClose:this.props.onClose,ref:this._dialogRef,render:this._renderChildren,showSeparator:!0,title:a.t(null,void 0,n(81031)),subtitle:this.state.layoutName})}}var d=n(29280),m=n(28124)
;class v extends d.DialogRenderer{constructor(e){super(),this._handleClose=()=>{var e;this._onClose&&this._onClose(),null===(e=this._rootInstance)||void 0===e||e.unmount(),this._setVisibility(!1)},this._onClose=e}hide(){this._handleClose()}show(){this.visible().value()||(this._rootInstance=(0,m.createReactRoot)(i.createElement(u,{onClose:this._handleClose}),this._container),this._setVisibility(!0))}}},11386:(e,t,n)=>{"use strict";n.d(t,{ManageDrawings:()=>_});var i=n(50959),a=n(43370),l=n(97754),o=n.n(l),s=n(9745),r=n(11542),c=n(45126),u=n(64147),d=n(31955),m=n(630),v=n(64530),h=n(37265),g=n(63932),f=n(89846);const w=r.t(null,void 0,n(92931)),C=r.t(null,void 0,n(41870)),b=r.t(null,void 0,n(80996));function p(e){const{sharingMode:t,onTabClick:n}=e,a=i.useMemo((()=>[{children:w,id:"2"},{children:C,id:"1"},{children:b,id:"0"}]),[]);return i.createElement(f.RoundButtonTabs,{id:"manage-drawings-tabs",isActive:e=>parseInt(e.id)===t,onActivate:function(e){n(parseInt(e.id))},overflowBehaviour:"scroll",items:a})}var y=n(29540),E=n(68016);const S=(0,d.getLogger)("Chart.ManageDrawings"),k=new Map;function M(e){let t=k.get(e);return void 0===t&&(t=new u.WatchedValue([]),k.set(e,t)),t}const B=new c.TranslatedString("remove all line tools for {symbol}",r.t(null,void 0,n(58407))),R=r.t(null,void 0,n(8182)),I=r.t(null,void 0,n(84212));function N(e){const[t,n]=i.useState(null),[l,o]=i.useState(null),[s,r]=i.useState(null),[c,u]=(i.useRef(null),i.useState([]));return i.useEffect((()=>{let t;const i=()=>{t&&o(t.mainSeries().proSymbol())};return e.withModel(null,(()=>{t=e.model(),n(t),i(),t.mainSeries().symbolResolved().subscribe(null,i)})),()=>{null==t||t.mainSeries().symbolResolved().unsubscribe(null,i),n(null)}}),[e]),i.useEffect((()=>{if(null!==t){const e={},n=(0,a.default)(f,250,{leading:!1});return f(),t.model().dataSourceCollectionChanged().subscribe(e,n),()=>{t.model().dataSourceCollectionChanged().unsubscribe(e,n)}}}),[t]),i.useEffect((()=>{if(null!==t){const e=M(t.model().id()).spawn();return u([...e.value()]),e.subscribe((()=>u([...e.value()]))),()=>null==e?void 0:e.destroy()}}),[t]),i.useMemo((()=>({currentSymbol:l,symbolDrawingsMaps:s,removeSymbolDrawings:d,changeSymbol:v,hiddenSymbols:c})),[l,s,d,v,c]);async function d(e,n){if(t&&s){const i=s[n].get(e);if(i){const n=Array.from(i).map((e=>t.model().dataSourceForId(e))).filter(h.notNull);n.length>0&&t.removeSources(n,!1,B.format({symbol:e}));const a=M(t.model().id());a.setValue([...a.value(),e]);try{await f()}catch(e){S.logError(`Error removing line tools: ${e}`)}a.setValue(a.value().filter((t=>t!==e)))}}}function v(n){e.setSymbol(n),null!==t&&o(n)}async function g(e){const t=function(e){const t=[new Map,new Map,new Map];return e.forEach((e=>{var n;if((0,m.isLineTool)(e)&&e.showInObjectTree()){const i=null!==(n=e.symbol())&&void 0!==n?n:"",a=e.sharingMode().value();t[a].set(i,(t[a].get(i)||new Set).add(e.id()))}})),t}(e);return(await async function(){return[new Map,new Map,new Map]}()).forEach(((e,n)=>{const i=t[n];e.forEach(((e,t)=>{const n=i.get(t)||new Set
;e.forEach((e=>n.add(e))),i.set(t,n)}))})),t}async function f(){null!==t&&r(await g(t.dataSources()))}}function _(e){const{isMobile:t,isSmallWidth:a,chartWidget:l,onClose:c,onInitialized:u}=e,{currentSymbol:d,symbolDrawingsMaps:m,removeSymbolDrawings:h,changeSymbol:f,hiddenSymbols:w}=N(l),[C,b]=i.useState(null),[S,k]=i.useMemo((()=>{var e;if(null!==d&&null!==m){const t=[];let n=C;if(null===n)for(n=2;n>0&&!(((null===(e=m[n].get(d))||void 0===e?void 0:e.size)||0)>0);)n--;return m[n].forEach(((e,n)=>{w.includes(n)||t.push({symbol:n,drawingsCount:e.size,onRemove:()=>function(e){h(e,k)}(n),onClick:()=>function(e){""!==e&&(f(e),null==c||c())}(n)})})),t.sort(((e,t)=>e.drawingsCount===t.drawingsCount?e.symbol.localeCompare(t.symbol):e.drawingsCount>t.drawingsCount?-1:1)),[t,n]}return[[],0]}),[d,C,m,w]);return i.useEffect((()=>{null!==m&&(null==u||u())}),[m]),i.createElement(i.Fragment,null,i.createElement("div",{className:o()(E.container,(a||t)&&E.mobile)},i.createElement(p,{sharingMode:k,onTabClick:b})),0===S.length?null===m?i.createElement(g.Spinner,{className:E.spinner}):i.createElement("div",{className:E.empty},i.createElement(s.Icon,{className:E.image,icon:y}),i.createElement("span",null,I)):S.map((({symbol:e,drawingsCount:a,onRemove:l,onClick:o})=>{return i.createElement(v.DialogContentItem,{key:e,title:e,subtitle:(s=a,r.t(null,{plural:"{drawingsCount} drawings",count:s},n(90755)).format({drawingsCount:s.toString()})),removeBtnLabel:R,isActive:e===d,isMobile:t,onClick:o,onClickRemove:l,showFavorite:!1,className:E.item});var s})))}},29540:e=>{e.exports='<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 72" width="72" height="72"><path fill="currentColor" d="M15 24a21 21 0 1 1 42 0v7.41l8.97 5.01 1.08.6-.82.94-7.77 8.82 2.34 2.53-1.47 1.36L57 48.15V69H46v-7h-6v5h-9V56h-6v13H15V48.15l-2.33 2.52-1.47-1.36 2.35-2.53-7.78-8.82-.82-.93 1.08-.6L15 31.4V24Zm0 9.7-6.9 3.87L15 45.4V33.7Zm42 11.7 6.91-7.83-6.9-3.87v11.7ZM36 5a19 19 0 0 0-19 19v43h6V54h10v11h5v-5h10v7h7V24A19 19 0 0 0 36 5Zm-5 19.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM42.5 26a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z"/></svg>'}}]);