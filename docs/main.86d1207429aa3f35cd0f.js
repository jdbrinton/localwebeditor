"use strict";(()=>{(self.webpackChunklocalwebeditor=self.webpackChunklocalwebeditor||[]).push([[8792],{37584:(h=>{h.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjNDI0MjQyIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="}),48827:((h,j,a)=>{var x=a(39887),W=a(893),S=a(51355),s=a(27325),f=a(50292),V=a(2898),D=a(85072),O=a.n(D),Q=a(97825),G=a.n(Q),J=a(77659),K=a.n(J),X=a(55056),$=a.n(X),q=a(10540),_=a.n(q),ee=a(41113),te=a.n(ee),N=a(50365),T={};T.styleTagTransform=te(),T.setAttributes=$(),T.insert=K().bind(null,"head"),T.domAPI=G(),T.insertStyleElement=_();var be=O()(N.A,T);const pe=N.A&&N.A.locals?N.A.locals:void 0;var re=Object.defineProperty,ne=(t,e,r)=>e in t?re(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,p=(t,e,r)=>ne(t,typeof e!="symbol"?e+"":e,r);const L=class b extends s.x0{constructor(e,r="",n=null,l=!1){super(),p(this,"editor",null),p(this,"initialContent"),p(this,"fileHandle",null),p(this,"contextMenuHandler",null),p(this,"isPreview",!1),this.setFlag(s.x0.Flag.DisallowLayout),this.addClass("content"),this.title.label=e,this.title.closable=!0,this.title.caption=`Editing: ${e}`,this.title.iconClass="fa fa-file",this.initialContent=r,this.fileHandle=n,this.isPreview=l,this.node.style.width="100%",this.node.style.height="100%",this.contextMenuHandler=d=>{b.menuFocus=this},this.node.addEventListener("contextmenu",this.contextMenuHandler),this.isPreview&&(this.title.className+=" preview-tab")}onAfterAttach(e){super.onAfterAttach(e);let r=null;const n=f.zn.parse("file:///"+(this.fileHandle?this.fileHandle.name:this.title.label));f.EN.getModel(n)||f.EN.createModel(this.initialContent,void 0,n),r=f.EN.getModel(n),this.editor=f.EN.create(this.node,{model:r,automaticLayout:!0}),this.isPreview&&this.editor&&this.editor.onDidChangeModelContent(()=>{this.convertToPermanent()})}onResize(e){super.onResize(e),this.editor&&this.editor.layout()}onActivateRequest(e){this.editor&&this.editor.focus(),b.currentWidget=this}onBeforeDetach(e){super.onBeforeDetach(e)}dispose(){if(b.menuFocus===this&&(b.menuFocus=null),b.currentWidget===this&&(b.currentWidget=null),b.previewWidget===this&&(b.previewWidget=null),this.contextMenuHandler&&(this.node.removeEventListener("contextmenu",this.contextMenuHandler),this.contextMenuHandler=null),this.editor){const e=this.editor.getModel();e&&!e.isDisposed()&&e.dispose(),this.editor.dispose(),this.editor=null}super.dispose()}getEditorContent(){return this.editor?this.editor.getValue():""}getFileHandle(){return this.fileHandle}setFileHandle(e){this.fileHandle=e,this.title.label=e.name,this.title.caption=`Editing: ${e.name}`}getEditor(){return this.editor}isPreviewMode(){return this.isPreview}convertToPermanent(){this.isPreview&&(this.isPreview=!1,this.title.className=this.title.className.replace(" preview-tab",""),b.previewWidget===this&&(b.previewWidget=null))}};p(L,"menuFocus"),p(L,"currentWidget",null),p(L,"previewWidget",null);let m=L;var oe=a(96903),ae=Object.defineProperty,ie=(t,e,r)=>e in t?ae(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,B=(t,e,r)=>ie(t,typeof e!="symbol"?e+"":e,r);class le extends s.x0{constructor(e){super(),B(this,"container"),B(this,"directoryHandle"),B(this,"directoryTree",null),B(this,"expandedPaths",new Set),B(this,"selectedItem",null),B(this,"_fileOpened",new oe.H(this)),B(this,"commands"),this.commands=e,this.addClass("directory-viewer-widget"),this.container=document.createElement("div"),this.container.className="directory-viewer-container",this.node.appendChild(this.container),this.directoryHandle=null;const r=document.createElement("button");r.textContent="Open Directory",r.classList.add("lm-Button"),r.addEventListener("click",()=>{this.commands.execute("file:open-directory")}),this.container.appendChild(r)}get fileOpened(){return this._fileOpened}async setDirectoryHandle(e){this.directoryHandle=e,this.directoryTree={name:e.name,kind:"directory",handle:e,loaded:!1,children:new Map},this.expandedPaths.clear(),this.expandedPaths.add(this.directoryTree.name),this.directoryTree.loaded=!0,this.directoryTree.children=new Map;for await(const[l,d]of e.entries())if(d.kind==="file"){const c={name:d.name,kind:"file",handle:d};this.directoryTree.children.set(l,c)}else{const c={name:d.name,kind:"directory",handle:d,loaded:!1,children:new Map};this.directoryTree.children.set(l,c)}const r=await this.createDomNode(this.directoryTree),n=document.createElement("ul");n.className="directory-tree",n.appendChild(r),this.container.innerHTML="",this.container.appendChild(n)}async createDomNode(e,r=""){const n=document.createElement("li");n.className="directory-item";const l=r?`${r}/${e.name}`:e.name;n.setAttribute("data-path",l);const d=document.createElement("span");d.className="directory-icon";const c=document.createElement("span");if(c.textContent=e.name,n.appendChild(d),n.appendChild(c),e.kind==="directory"){const A=document.createElement("ul");if(A.className="nested",n.appendChild(A),this.expandedPaths.has(l)){if(n.classList.add("expanded"),d.classList.add("fa","fa-folder-open"),e.loaded)for(const g of e.children.values()){const o=await this.createDomNode(g,l);A.appendChild(o)}}else n.classList.add("collapsed"),d.classList.add("fa","fa-folder");n.addEventListener("click",async g=>{if(g.stopPropagation(),n.classList.contains("collapsed")){if(n.classList.remove("collapsed"),n.classList.add("expanded"),d.classList.remove("fa-folder"),d.classList.add("fa-folder-open"),this.expandedPaths.add(l),!e.loaded){e.loaded=!0,e.children=new Map;for await(const[o,i]of e.handle.entries())if(i.kind==="file"){const u={name:i.name,kind:"file",handle:i};e.children.set(o,u)}else{const u={name:i.name,kind:"directory",handle:i,loaded:!1,children:new Map};e.children.set(o,u)}}A.innerHTML="";for(const o of e.children.values()){const i=await this.createDomNode(o,l);A.appendChild(i)}}else n.classList.remove("expanded"),n.classList.add("collapsed"),d.classList.remove("fa-folder-open"),d.classList.add("fa-folder"),this.expandedPaths.delete(l),A.innerHTML=""})}else{d.classList.add("fa","fa-file");let A=null;n.addEventListener("click",g=>{g.stopPropagation(),this.selectedItem&&this.selectedItem.classList.remove("file-selected"),n.classList.add("file-selected"),this.selectedItem=n,A!==null?(clearTimeout(A),A=null,this._fileOpened.emit({path:l,handle:e.handle,preview:!1})):A=window.setTimeout(()=>{this._fileOpened.emit({path:l,handle:e.handle,preview:!0}),A=null},250)})}return n}}var de=Object.defineProperty,ce=(t,e,r)=>e in t?de(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,M=(t,e,r)=>ce(t,typeof e!="symbol"?e+"":e,r);class Ae extends s.x0{constructor(e){super(),M(this,"fileHandle"),M(this,"pdfDoc",null),M(this,"currentPage",1),M(this,"totalPages",0),M(this,"scale",1),M(this,"canvas"),M(this,"pageNumberDisplay"),this.fileHandle=e,this.setFlag(s.x0.Flag.DisallowLayout),this.title.label=e.name,this.title.closable=!0,this.title.caption=`Viewing: ${e.name}`,this.title.iconClass="fa fa-file-pdf-o",this.addClass("pdf-viewer-widget");const r=document.createElement("div");r.className="pdf-viewer-container",this.node.appendChild(r);const n=document.createElement("div");n.className="pdf-viewer-controls";const l=document.createElement("button");l.textContent="-",l.title="Zoom Out",l.addEventListener("click",()=>{this.zoomOut()});const d=document.createElement("button");d.textContent="+",d.title="Zoom In",d.addEventListener("click",()=>{this.zoomIn()});const c=document.createElement("button");c.textContent="Prev",c.title="Previous Page",c.addEventListener("click",()=>{this.goToPreviousPage()});const A=document.createElement("button");A.textContent="Next",A.title="Next Page",A.addEventListener("click",()=>{this.goToNextPage()});const g=document.createElement("span");g.textContent=`${this.currentPage} / ${this.totalPages}`,this.pageNumberDisplay=g,n.appendChild(l),n.appendChild(d),n.appendChild(c),n.appendChild(A),n.appendChild(g),r.appendChild(n);const o=document.createElement("div");o.className="pdf-canvas-container",r.appendChild(o),this.canvas=document.createElement("canvas"),o.appendChild(this.canvas)}async onAfterAttach(e){super.onAfterAttach(e),await this.loadPDF()}async loadPDF(){const r=await(await this.fileHandle.getFile()).arrayBuffer();this.pdfDoc=await(0,x.YE)({data:r}).promise,this.totalPages=this.pdfDoc.numPages,this.updatePageNumberDisplay(),await this.renderPage(this.currentPage)}async renderPage(e){if(!this.pdfDoc)return;const r=await this.pdfDoc.getPage(e),n=r.getViewport({scale:this.scale}),l=this.canvas.getContext("2d");if(!l)return;this.canvas.height=n.height,this.canvas.width=n.width;const d={canvasContext:l,viewport:n,canvas:this.canvas};await r.render(d).promise}zoomIn(){this.scale+=.1,this.renderPage(this.currentPage)}zoomOut(){this.scale>.2&&(this.scale-=.1,this.renderPage(this.currentPage))}goToPreviousPage(){this.currentPage>1&&(this.currentPage-=1,this.updatePageNumberDisplay(),this.renderPage(this.currentPage))}goToNextPage(){this.currentPage<this.totalPages&&(this.currentPage+=1,this.updatePageNumberDisplay(),this.renderPage(this.currentPage))}updatePageNumberDisplay(){this.pageNumberDisplay&&(this.pageNumberDisplay.textContent=`${this.currentPage} / ${this.totalPages}`)}}function I(t){document.body.dataset.theme=t;let e="vs";t==="light"?e="vs":t==="dark"?e="vs-dark":t==="high-contrast"&&(e="hc-black"),f.EN.setTheme(e),localStorage.setItem("theme",t)}function F(t,e){t.classList.remove("light-theme-icon","dark-theme-icon","high-contrast-theme-icon"),e==="light"?t.classList.add("light-theme-icon"):e==="dark"?t.classList.add("dark-theme-icon"):e==="high-contrast"&&t.classList.add("high-contrast-theme-icon")}function se(t,e,r,n,l,d,c){t.addCommand("file:new",{label:"New File",mnemonic:0,execute:()=>{let o="untitled.txt",i="",u=new m(o,i);r.addWidget(u),r.activateWidget(u)}}),t.addCommand("file:open-directory",{label:"Open Directory",mnemonic:5,caption:"Open a directory and display its files",execute:async()=>{try{if("showDirectoryPicker"in window){const o=await window.showDirectoryPicker();await n.setDirectoryHandle(o)}else alert("File System Access API is not supported in this browser.")}catch(o){console.error(o)}}}),t.addCommand("file:save",{label:"Save",mnemonic:0,execute:async()=>{let o=m.currentWidget;if(o){let i=o.getFileHandle();if(i)try{const u=await i.createWritable();await u.write(o.getEditorContent()),await u.close(),console.log("File saved.")}catch(u){console.error("Error saving file:",u)}else await t.execute("file:save-as")}}}),t.addCommand("file:save-as",{label:"Save As...",mnemonic:5,execute:async()=>{let o=m.currentWidget;if(o)try{if("showSaveFilePicker"in window){const i=await window.showSaveFilePicker(),u=await i.createWritable();await u.write(o.getEditorContent()),await u.close(),o.setFileHandle(i),console.log("File saved as:",i.name)}else alert("File System Access API is not supported in this browser.")}catch(i){console.error("Error saving file:",i)}}}),t.addCommand("file:close",{label:"Close",mnemonic:0,execute:()=>{let o=m.currentWidget;o&&o.close()}}),t.addCommand("edit:undo",{label:"Undo",mnemonic:0,execute:()=>{let o=m.currentWidget;if(o){let i=o.getEditor();i&&i.trigger("keyboard","undo",null)}}}),t.addCommand("edit:redo",{label:"Redo",mnemonic:0,execute:()=>{let o=m.currentWidget;if(o){let i=o.getEditor();i&&i.trigger("keyboard","redo",null)}}}),t.addCommand("edit:cut",{label:"Cut",mnemonic:1,iconClass:"fa fa-cut",execute:()=>{document.execCommand("cut")}}),t.addCommand("edit:copy",{label:"Copy",mnemonic:0,iconClass:"fa fa-copy",execute:()=>{document.execCommand("copy")}}),t.addCommand("edit:paste",{label:"Paste",mnemonic:0,iconClass:"fa fa-paste",execute:()=>{document.execCommand("paste")}}),t.addCommand("edit:select-all",{label:"Select All",mnemonic:7,execute:()=>{let o=m.currentWidget;if(o){let i=o.getEditor();i&&i.trigger("keyboard","selectAll",null)}}}),t.addCommand("view:toggle-directory-viewer",{label:"Toggle Directory Viewer",mnemonic:7,execute:()=>{l.isHidden?l.show():l.hide()}}),t.addCommand("view:toggle-status-bar",{label:"Toggle Status Bar",mnemonic:7,execute:()=>{d.isHidden?d.show():d.hide()}}),t.addCommand("view:toggle-command-palette",{label:"Toggle Command Palette",mnemonic:7,execute:()=>{e.isHidden?e.show():e.hide()}}),t.addCommand("theme:light",{label:"Light Theme",execute:()=>{I("light"),F(c,"light")}}),t.addCommand("theme:dark",{label:"Dark Theme",execute:()=>{I("dark"),F(c,"dark")}}),t.addCommand("theme:high-contrast",{label:"High-Contrast Dark Theme",execute:()=>{I("high-contrast"),F(c,"high-contrast")}}),t.addCommand("example:split-left",{label:"Split left",execute:()=>g("split-left")}),t.addCommand("example:split-right",{label:"Split right",execute:()=>g("split-right")}),t.addCommand("example:split-top",{label:"Split top",execute:()=>g("split-top")}),t.addCommand("example:split-bottom",{label:"Split bottom",execute:()=>g("split-bottom")}),t.addCommand("save-dock-layout",{label:"Save Layout",caption:"Save the current dock layout",execute:()=>{A.push(r.saveLayout()),e.addItem({command:"restore-dock-layout",category:"Dock Layout",args:{index:A.length-1}})}}),t.addCommand("restore-dock-layout",{label:o=>`Restore Layout ${o.index}`,execute:o=>{r.restoreLayout(A[o.index])}}),t.addCommand("view:toggle-add-button",{label:"Toggle Add Button",mnemonic:0,caption:"Toggle Add Button",execute:()=>{r.addButtonEnabled=!r.addButtonEnabled}}),t.addKeyBinding({keys:["Accel X"],selector:"body",command:"edit:cut"}),t.addKeyBinding({keys:["Accel C"],selector:"body",command:"edit:copy"}),t.addKeyBinding({keys:["Accel V"],selector:"body",command:"edit:paste"}),t.addKeyBinding({keys:["Accel A"],selector:"body",command:"edit:select-all"}),t.addKeyBinding({keys:["Accel Z"],selector:"body",command:"edit:undo"}),t.addKeyBinding({keys:["Accel Shift Z"],selector:"body",command:"edit:redo"}),e.addItem({command:"file:new",category:"File",rank:1}),e.addItem({command:"file:open-directory",category:"File",rank:2}),e.addItem({command:"file:save",category:"File",rank:3}),e.addItem({command:"file:save-as",category:"File",rank:4}),e.addItem({command:"save-dock-layout",category:"Dock Layout",rank:0});let A=[];function g(o){let i=m.menuFocus;if(i){let u="untitled.txt",R="",z=new m(u,R);r.addWidget(z,{mode:o,ref:i})}}}function me(t){let e=new s.W1({commands:t});return e.title.label="File",e.title.mnemonic=0,e.addItem({command:"file:new"}),e.addItem({command:"file:open-directory"}),e.addItem({command:"file:save"}),e.addItem({command:"file:save-as"}),e.addItem({command:"file:close"}),e}function ge(t){let e=new s.W1({commands:t});return e.title.label="Edit",e.title.mnemonic=0,e.addItem({command:"edit:undo"}),e.addItem({command:"edit:redo"}),e.addItem({command:"edit:cut"}),e.addItem({command:"edit:copy"}),e.addItem({command:"edit:paste"}),e.addItem({command:"edit:select-all"}),e}function ue(t){let e=new s.W1({commands:t});e.title.label="View",e.title.mnemonic=0,e.addItem({command:"view:toggle-directory-viewer"}),e.addItem({command:"view:toggle-status-bar"}),e.addItem({command:"view:toggle-command-palette"});let r=new s.W1({commands:t});return r.title.label="Appearance",r.addItem({command:"theme:light"}),r.addItem({command:"theme:dark"}),r.addItem({command:"theme:high-contrast"}),e.addItem({type:"submenu",submenu:r}),e}function he(t){let e=document.createElement("button");e.id="themeToggleButton",e.className="theme-toggle-button";let r=["light","dark","high-contrast"],n=r.indexOf(localStorage.getItem("theme")||"light");return Y(e,r[n]),e.addEventListener("click",()=>{n=(n+1)%r.length;let l=r[n];t(l),Y(e,l)}),e}function Y(t,e){t.classList.remove("light-theme-icon","dark-theme-icon","high-contrast-theme-icon"),e==="light"?t.classList.add("light-theme-icon"):e==="dark"?t.classList.add("dark-theme-icon"):e==="high-contrast"&&t.classList.add("high-contrast-theme-icon")}x.EA.workerSrc=new URL(a(36391),a.b).toString();const v=new W.J;function fe(){let t=new le(v),e=new s.Rj;e.addMenu(me(v)),e.addMenu(ge(v)),e.addMenu(ue(v)),e.id="menuBar";let r=he(I);e.node.appendChild(r);let n=new s.xq({commands:v});n.id="palette";let l=`Welcome to the Application!
This is the landing page. Use the directory viewer to open files.`,d=new m("Home",l),c=new s.Cc;c.addWidget(d),c.id="dock";let A=new s.e6({direction:"top-to-bottom",spacing:0});A.id="leftPanel",A.addWidget(n),A.addWidget(t),s.e6.setStretch(n,0),s.e6.setStretch(t,1);let g=new s.x0;g.addClass("status-bar"),g.node.textContent="Ready - Open Source Propulsion Works \xA9 2024";let o=new s.e6({direction:"top-to-bottom",spacing:0});o.id="main";let i=new s.ri({orientation:"horizontal",spacing:0});i.addWidget(A),i.addWidget(c),i.setRelativeSizes([.2,.8]),o.addWidget(i),o.addWidget(g),s.e6.setStretch(i,1),s.e6.setStretch(g,0);const u=()=>{S.Mu.postMessage(e,new s.x0.ResizeMessage(-1,-1)),o.update()};window.addEventListener("resize",u),s.x0.attach(e,document.body),s.x0.attach(o,document.body),t.fileOpened.connect(async(E,{path:w,handle:C,preview:Ce})=>{try{if(C.name.split(".").pop()?.toLowerCase()==="pdf"){let k=new Ae(C);c.addWidget(k),c.activateWidget(k)}else{const k=f.zn.parse("file:///"+C.name);let U=f.EN.getModel(k);if(!U){const P=await(await C.getFile()).text();U=f.EN.createModel(P,void 0,k)}if(Ce){if(m.previewWidget){if(m.previewWidget.getFileHandle()===C){c.activateWidget(m.previewWidget);return}m.previewWidget.close()}let y=new m(C.name,"",C,!0);m.previewWidget=y,c.addWidget(y),c.activateWidget(y)}else{let y=R(C);if(y)c.activateWidget(y);else if(m.previewWidget&&m.previewWidget.getFileHandle()===C)m.previewWidget.convertToPermanent(),m.previewWidget=null;else{let P=new m(C.name,"",C);c.addWidget(P),c.activateWidget(P)}}}}catch(H){console.error("Error opening file:",H)}});function R(E){for(let w of c.widgets())if(w instanceof m&&w.getFileHandle()===E&&!w.isPreviewMode())return w;return null}window.addEventListener("beforeunload",()=>{document.removeEventListener("keydown",Z),window.removeEventListener("resize",u)});let z=localStorage.getItem("theme")||"light";I(z),Y(r,z);const Z=E=>{v.processKeydownEvent(E)};document.addEventListener("keydown",Z),se(v,n,c,t,A,g,r),window.MonacoEnvironment={getWorker:function(E,w){switch(w){case"json":return new Worker(new URL(a.p+a.u(1162),a.b));case"css":case"scss":case"less":return new Worker(new URL(a.p+a.u(9044),a.b));case"html":case"handlebars":case"razor":return new Worker(new URL(a.p+a.u(4064),a.b));case"typescript":case"javascript":return new Worker(new URL(a.p+a.u(2150),a.b));default:return new Worker(new URL(a.p+a.u(1821),a.b))}}},window.addEventListener("error",E=>{console.error("Global error handler caught an error:",E.error||E)})}window.onload=fe}),50365:((h,j,a)=>{a.d(j,{A:()=>O});var x=a(71354),W=a.n(x),S=a(76314),s=a.n(S),f=a(43210),V=a(838),D=s()(W());D.i(f.A),D.i(V.A),D.push([h.id,`body {
  display: flex;
  flex-direction: column;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: 0;
  padding: 0;
  overflow: hidden;
  background-color: var(--background-color);
  color: var(--text-color);
}

body[data-theme="light"] {
  --background-color: #ffffff;
  --text-color: #000000;
  --primary-color: #007aff;
  --hover-color: #f0f0f0;
  --border-color: #ccc;
  --menu-active-bg: #007aff;
  --menu-active-text: #ffffff;
  --tab-active-bg: #e0e0e0;
  --tab-active-text: #000000;
}

body[data-theme="dark"] {
  --background-color: #1e1e1e;
  --text-color: #d4d4d4;
  --primary-color: #0a84ff;
  --hover-color: #2a2a2a;
  --border-color: #3c3c3c;
  --menu-active-bg: #0a84ff;
  --menu-active-text: #ffffff;
  --tab-active-bg: #2d2d2d;
  --tab-active-text: #ffffff;
}

body[data-theme="high-contrast"] {
  --background-color: #000000;
  --text-color: #ffffff;
  --primary-color: #ffff00;
  --hover-color: #1a1a1a;
  --border-color: #ffffff;
  --menu-active-bg: #ffff00;
  --menu-active-text: #000000;
  --tab-active-bg: #ffffff;
  --tab-active-text: #000000;
}

#menuBar {
  flex: 0 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

#menuBar .lm-MenuBar-item {
  color: var(--text-color);
}

#menuBar .lm-MenuBar-item.lm-mod-active,
#menuBar .lm-MenuBar-item:active,
#menuBar .lm-MenuBar-item:hover {
  background-color: var(--menu-active-bg);
  color: var(--menu-active-text);
}

#themeToggleButton {
  margin-right: 10px;
  padding: 4px;
  background-color: transparent;
  border: none;
  cursor: pointer;
  font-size: 16px;
  color: var(--text-color);
}

#themeToggleButton.light-theme-icon::before {
  content: "\\f185";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

#themeToggleButton.dark-theme-icon::before {
  content: "\\f186";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

#themeToggleButton.high-contrast-theme-icon::before {
  content: "\\f0eb";
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

#main {
  flex: 1 1 auto;
  display: flex;
  flex-direction: row;
  overflow: hidden;
}

#leftPanel {
  width: 300px;
  min-width: 200px;
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--background-color);
}

/* Adjust the CommandPalette styles */
#leftPanel > .lm-CommandPalette {
  /* Remove height: 100%; */
  flex: 0 0 auto;
  min-height: 250px;
  overflow: auto;
  z-index: 1;
  border: 0px;
}

/* Ensure the directory-viewer-widget fills the remaining space */
#leftPanel > .directory-viewer-widget {
  flex: 1 1 auto;
  overflow: auto;
  z-index: 0;
  border-top: 1px solid var(--border-color);
}

#palette {
  min-width: 300px;
  border-right: 1px solid var(--border-color);
  background-color: var(--background-color);
  color: var(--text-color);
}

#dock {
  padding: 4px;
  flex: 1 1 auto;
  overflow: auto;
  background-color: var(--background-color);
  color: var(--text-color);
}

.content {
  min-width: 50px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-top: none;
  background: var(--background-color);
}

.content > div {
  flex: 1 1 auto;
  border: 1px solid var(--border-color);
  overflow: auto;
}

.content input {
  margin: 8px;
}

.directory-viewer-widget {
  padding: 10px;
  overflow: auto;
  background-color: var(--background-color);
  font: 13px Helvetica, Arial, sans-serif;
  color: var(--text-color);
}

/* Add the new styles below */

.directory-viewer-container {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
  overflow: auto;
}

.directory-tree {
  list-style-type: none;
  margin: 0;
  padding: 0;
}

.directory-tree ul {
  list-style-type: none;
  margin: 0;
  padding-left: 20px;
}

.directory-item {
  cursor: pointer;
  user-select: none;
  position: relative;
  padding: 4px 0;
  color: var(--text-color);
}

.directory-item:hover {
  background-color: var(--hover-color);
}

.directory-item .directory-icon {
  margin-right: 5px;
}

.directory-item.collapsed > ul {
  display: none;
}

.file-selected {
  background-color: var(--primary-color);
}

.fa-folder,
.fa-folder-open,
.fa-file {
  width: 16px;
  display: inline-block;
  text-align: center;
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

.fa-folder::before {
  content: "\\f07b";
}

.fa-folder-open::before {
  content: "\\f07c";
}

.fa-file::before {
  content: "\\f15b";
}

.status-bar {
  background-color: var(--background-color);
  border-top: 1px solid var(--border-color);
  padding: 4px;
  font-size: 12px;
  min-height: 24px;
  box-sizing: border-box;
  color: var(--text-color);
}

.content {
  position: relative;
  width: 100%;
  height: 100%;
}

.content .monaco-editor {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  border: 0px;
}

.lm-TabBar-tab.preview-tab .lm-TabBar-tabLabel {
  font-style: italic;
}

.lm-TabBar-tab {
  display: flex;
  align-items: center;
  padding: 0 8px;
  background-color: var(--background-color);
  color: var(--text-color);
}

.lm-TabBar-tab.lm-mod-current {
  background-color: var(--tab-active-bg);
  color: var(--tab-active-text);
}

.lm-TabBar-tab:hover {
  background-color: var(--hover-color);
  color: var(--text-color);
}

.lm-TabBar-tabIcon {
  display: inline-block;
  vertical-align: middle;
  font-size: 14px;
  line-height: normal;
  margin-right: 4px;
}

.lm-TabBar-tabLabel {
  vertical-align: middle;
  line-height: normal;
}

.lm-TabBar-tabIcon.fa {
  font-family: "Font Awesome 5 Free";
  font-weight: 900;
}

body[data-theme="light"] .lm-MenuBar,
body[data-theme="dark"] .lm-MenuBar,
body[data-theme="high-contrast"] .lm-MenuBar {
  background-color: var(--background-color);
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
}

body[data-theme="light"] .lm-MenuBar-item,
body[data-theme="dark"] .lm-MenuBar-item,
body[data-theme="high-contrast"] .lm-MenuBar-item {
  color: var(--text-color);
}

body[data-theme="light"] .lm-MenuBar-item.lm-mod-active,
body[data-theme="dark"] .lm-MenuBar-item.lm-mod-active,
body[data-theme="high-contrast"] .lm-MenuBar-item.lm-mod-active {
  background-color: var(--menu-active-bg);
  color: var(--menu-active-text);
}

body[data-theme="light"] .lm-TabBar-tab,
body[data-theme="dark"] .lm-TabBar-tab,
body[data-theme="high-contrast"] .lm-TabBar-tab {
  background-color: var(--background-color);
  color: var(--text-color);
}

body[data-theme="light"] .lm-TabBar-tab.lm-mod-current,
body[data-theme="dark"] .lm-TabBar-tab.lm-mod-current,
body[data-theme="high-contrast"] .lm-TabBar-tab.lm-mod-current {
  background-color: var(--tab-active-bg);
  color: var(--tab-active-text);
}

body[data-theme="light"] .lm-TabBar-tab:hover,
body[data-theme="dark"] .lm-TabBar-tab:hover,
body[data-theme="high-contrast"] .lm-TabBar-tab:hover {
  background-color: var(--hover-color);
  color: var(--text-color);
}

/* Styles for PDFViewerWidget */
.pdf-viewer-widget {
  min-width: 50px;
  min-height: 50px;
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-top: none;
  background: var(--background-color);
}

.pdf-viewer-container {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Ensure container doesn't overflow its parent */
}

.pdf-viewer-controls {
  flex: 0 0 auto;
  padding: 4px;
  background-color: var(--background-color);
  border-bottom: 1px solid var(--border-color);
}

.pdf-viewer-controls button {
  margin-right: 4px;
}

.pdf-canvas-container {
  flex: 1 1 auto;
  overflow: auto;
  /* Enable scrolling when content overflows */
}

.pdf-canvas-container canvas {
  display: block;
  margin: 0 auto;
  /* Center the canvas horizontally */
}

.lm-Menu,
.lm-MenuBar-item,
.lm-Menu .lm-Menu-itemLabel,
.lm-Menu .lm-Menu-itemShortcut,
.lm-Menu .lm-Menu-itemIcon,
.lm-TabBar-tabLabel,
.lm-TabBar-tabIcon,
.lm-TabBar-tabCloseIcon,
.monaco-editor,
.monaco-editor .view-lines,
.monaco-editor .mtk0,
.monaco-editor .mtk1,
.monaco-editor .mtk2,
.monaco-editor .mtk3,
.monaco-editor .mtk4,
.monaco-editor .mtk5,
.monaco-editor .mtk6,
.monaco-editor .mtk7,
.monaco-editor .mtk8,
.monaco-editor .mtk9 {
  /*
    Windows browsers render opaque text layers with ClearType, which performs
    sub-pixel (RGB) anti-aliasing. It manipulates each color subpixel to boost
    horizontal resolution, resulting in sharper glyph edges but visible color
    fringing under magnification.

    When the compositor detects any non-opaque or transformed layer (opacity < 1,
    CSS transform, filter, etc.), it can no longer assume a fixed LCD subpixel
    layout. The text then moves off the \u201CLCD text path\u201D to the \u201Cnon-LCD path,\u201D
    where rendering falls back to grayscale anti-aliasing. Grayscale AA averages
    brightness uniformly across RGB, removing colored fringes and matching how
    native Windows menus, tab labels, and captions are drawn.

    Applying \`opacity: 0.999\` forces that GPU-composited path on these UI elements,
    disabling ClearType and ensuring a clean grayscale look for menu labels,
    shortcuts, icons, and Lumino tab labels\u2014consistent with native Windows UI.
  */
  opacity: 0.999;
}
`,"",{version:3,sources:["webpack://./src/styles.css"],names:[],mappings:"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",sourcesContent:[`@import "@lumino/widgets/style/index.css";\r
@import "@lumino/default-theme/style/index.css";\r
\r
body {\r
  display: flex;\r
  flex-direction: column;\r
  position: absolute;\r
  top: 0;\r
  left: 0;\r
  right: 0;\r
  bottom: 0;\r
  margin: 0;\r
  padding: 0;\r
  overflow: hidden;\r
  background-color: var(--background-color);\r
  color: var(--text-color);\r
}\r
\r
body[data-theme="light"] {\r
  --background-color: #ffffff;\r
  --text-color: #000000;\r
  --primary-color: #007aff;\r
  --hover-color: #f0f0f0;\r
  --border-color: #ccc;\r
  --menu-active-bg: #007aff;\r
  --menu-active-text: #ffffff;\r
  --tab-active-bg: #e0e0e0;\r
  --tab-active-text: #000000;\r
}\r
\r
body[data-theme="dark"] {\r
  --background-color: #1e1e1e;\r
  --text-color: #d4d4d4;\r
  --primary-color: #0a84ff;\r
  --hover-color: #2a2a2a;\r
  --border-color: #3c3c3c;\r
  --menu-active-bg: #0a84ff;\r
  --menu-active-text: #ffffff;\r
  --tab-active-bg: #2d2d2d;\r
  --tab-active-text: #ffffff;\r
}\r
\r
body[data-theme="high-contrast"] {\r
  --background-color: #000000;\r
  --text-color: #ffffff;\r
  --primary-color: #ffff00;\r
  --hover-color: #1a1a1a;\r
  --border-color: #ffffff;\r
  --menu-active-bg: #ffff00;\r
  --menu-active-text: #000000;\r
  --tab-active-bg: #ffffff;\r
  --tab-active-text: #000000;\r
}\r
\r
#menuBar {\r
  flex: 0 0 auto;\r
  display: flex;\r
  justify-content: space-between;\r
  align-items: center;\r
  background-color: var(--background-color);\r
  border-bottom: 1px solid var(--border-color);\r
}\r
\r
#menuBar .lm-MenuBar-item {\r
  color: var(--text-color);\r
}\r
\r
#menuBar .lm-MenuBar-item.lm-mod-active,\r
#menuBar .lm-MenuBar-item:active,\r
#menuBar .lm-MenuBar-item:hover {\r
  background-color: var(--menu-active-bg);\r
  color: var(--menu-active-text);\r
}\r
\r
#themeToggleButton {\r
  margin-right: 10px;\r
  padding: 4px;\r
  background-color: transparent;\r
  border: none;\r
  cursor: pointer;\r
  font-size: 16px;\r
  color: var(--text-color);\r
}\r
\r
#themeToggleButton.light-theme-icon::before {\r
  content: "\\f185";\r
  font-family: "Font Awesome 5 Free";\r
  font-weight: 900;\r
}\r
\r
#themeToggleButton.dark-theme-icon::before {\r
  content: "\\f186";\r
  font-family: "Font Awesome 5 Free";\r
  font-weight: 900;\r
}\r
\r
#themeToggleButton.high-contrast-theme-icon::before {\r
  content: "\\f0eb";\r
  font-family: "Font Awesome 5 Free";\r
  font-weight: 900;\r
}\r
\r
#main {\r
  flex: 1 1 auto;\r
  display: flex;\r
  flex-direction: row;\r
  overflow: hidden;\r
}\r
\r
#leftPanel {\r
  width: 300px;\r
  min-width: 200px;\r
  border-right: 1px solid var(--border-color);\r
  display: flex;\r
  flex-direction: column;\r
  overflow: hidden;\r
  background-color: var(--background-color);\r
}\r
\r
/* Adjust the CommandPalette styles */\r
#leftPanel > .lm-CommandPalette {\r
  /* Remove height: 100%; */\r
  flex: 0 0 auto;\r
  min-height: 250px;\r
  overflow: auto;\r
  z-index: 1;\r
  border: 0px;\r
}\r
\r
/* Ensure the directory-viewer-widget fills the remaining space */\r
#leftPanel > .directory-viewer-widget {\r
  flex: 1 1 auto;\r
  overflow: auto;\r
  z-index: 0;\r
  border-top: 1px solid var(--border-color);\r
}\r
\r
#palette {\r
  min-width: 300px;\r
  border-right: 1px solid var(--border-color);\r
  background-color: var(--background-color);\r
  color: var(--text-color);\r
}\r
\r
#dock {\r
  padding: 4px;\r
  flex: 1 1 auto;\r
  overflow: auto;\r
  background-color: var(--background-color);\r
  color: var(--text-color);\r
}\r
\r
.content {\r
  min-width: 50px;\r
  min-height: 50px;\r
  display: flex;\r
  flex-direction: column;\r
  border: 1px solid var(--border-color);\r
  border-top: none;\r
  background: var(--background-color);\r
}\r
\r
.content > div {\r
  flex: 1 1 auto;\r
  border: 1px solid var(--border-color);\r
  overflow: auto;\r
}\r
\r
.content input {\r
  margin: 8px;\r
}\r
\r
.directory-viewer-widget {\r
  padding: 10px;\r
  overflow: auto;\r
  background-color: var(--background-color);\r
  font: 13px Helvetica, Arial, sans-serif;\r
  color: var(--text-color);\r
}\r
\r
/* Add the new styles below */\r
\r
.directory-viewer-container {\r
  display: flex;\r
  flex-direction: column;\r
  flex: 1 1 auto;\r
  overflow: auto;\r
}\r
\r
.directory-tree {\r
  list-style-type: none;\r
  margin: 0;\r
  padding: 0;\r
}\r
\r
.directory-tree ul {\r
  list-style-type: none;\r
  margin: 0;\r
  padding-left: 20px;\r
}\r
\r
.directory-item {\r
  cursor: pointer;\r
  user-select: none;\r
  position: relative;\r
  padding: 4px 0;\r
  color: var(--text-color);\r
}\r
\r
.directory-item:hover {\r
  background-color: var(--hover-color);\r
}\r
\r
.directory-item .directory-icon {\r
  margin-right: 5px;\r
}\r
\r
.directory-item.collapsed > ul {\r
  display: none;\r
}\r
\r
.file-selected {\r
  background-color: var(--primary-color);\r
}\r
\r
.fa-folder,\r
.fa-folder-open,\r
.fa-file {\r
  width: 16px;\r
  display: inline-block;\r
  text-align: center;\r
  font-family: "Font Awesome 5 Free";\r
  font-weight: 900;\r
}\r
\r
.fa-folder::before {\r
  content: "\\f07b";\r
}\r
\r
.fa-folder-open::before {\r
  content: "\\f07c";\r
}\r
\r
.fa-file::before {\r
  content: "\\f15b";\r
}\r
\r
.status-bar {\r
  background-color: var(--background-color);\r
  border-top: 1px solid var(--border-color);\r
  padding: 4px;\r
  font-size: 12px;\r
  min-height: 24px;\r
  box-sizing: border-box;\r
  color: var(--text-color);\r
}\r
\r
.content {\r
  position: relative;\r
  width: 100%;\r
  height: 100%;\r
}\r
\r
.content .monaco-editor {\r
  position: absolute;\r
  top: 0;\r
  right: 0;\r
  bottom: 0;\r
  left: 0;\r
  border: 0px;\r
}\r
\r
.lm-TabBar-tab.preview-tab .lm-TabBar-tabLabel {\r
  font-style: italic;\r
}\r
\r
.lm-TabBar-tab {\r
  display: flex;\r
  align-items: center;\r
  padding: 0 8px;\r
  background-color: var(--background-color);\r
  color: var(--text-color);\r
}\r
\r
.lm-TabBar-tab.lm-mod-current {\r
  background-color: var(--tab-active-bg);\r
  color: var(--tab-active-text);\r
}\r
\r
.lm-TabBar-tab:hover {\r
  background-color: var(--hover-color);\r
  color: var(--text-color);\r
}\r
\r
.lm-TabBar-tabIcon {\r
  display: inline-block;\r
  vertical-align: middle;\r
  font-size: 14px;\r
  line-height: normal;\r
  margin-right: 4px;\r
}\r
\r
.lm-TabBar-tabLabel {\r
  vertical-align: middle;\r
  line-height: normal;\r
}\r
\r
.lm-TabBar-tabIcon.fa {\r
  font-family: "Font Awesome 5 Free";\r
  font-weight: 900;\r
}\r
\r
body[data-theme="light"] .lm-MenuBar,\r
body[data-theme="dark"] .lm-MenuBar,\r
body[data-theme="high-contrast"] .lm-MenuBar {\r
  background-color: var(--background-color);\r
  color: var(--text-color);\r
  border-bottom: 1px solid var(--border-color);\r
}\r
\r
body[data-theme="light"] .lm-MenuBar-item,\r
body[data-theme="dark"] .lm-MenuBar-item,\r
body[data-theme="high-contrast"] .lm-MenuBar-item {\r
  color: var(--text-color);\r
}\r
\r
body[data-theme="light"] .lm-MenuBar-item.lm-mod-active,\r
body[data-theme="dark"] .lm-MenuBar-item.lm-mod-active,\r
body[data-theme="high-contrast"] .lm-MenuBar-item.lm-mod-active {\r
  background-color: var(--menu-active-bg);\r
  color: var(--menu-active-text);\r
}\r
\r
body[data-theme="light"] .lm-TabBar-tab,\r
body[data-theme="dark"] .lm-TabBar-tab,\r
body[data-theme="high-contrast"] .lm-TabBar-tab {\r
  background-color: var(--background-color);\r
  color: var(--text-color);\r
}\r
\r
body[data-theme="light"] .lm-TabBar-tab.lm-mod-current,\r
body[data-theme="dark"] .lm-TabBar-tab.lm-mod-current,\r
body[data-theme="high-contrast"] .lm-TabBar-tab.lm-mod-current {\r
  background-color: var(--tab-active-bg);\r
  color: var(--tab-active-text);\r
}\r
\r
body[data-theme="light"] .lm-TabBar-tab:hover,\r
body[data-theme="dark"] .lm-TabBar-tab:hover,\r
body[data-theme="high-contrast"] .lm-TabBar-tab:hover {\r
  background-color: var(--hover-color);\r
  color: var(--text-color);\r
}\r
\r
/* Styles for PDFViewerWidget */\r
.pdf-viewer-widget {\r
  min-width: 50px;\r
  min-height: 50px;\r
  display: flex;\r
  flex-direction: column;\r
  border: 1px solid var(--border-color);\r
  border-top: none;\r
  background: var(--background-color);\r
}\r
\r
.pdf-viewer-container {\r
  flex: 1 1 auto;\r
  display: flex;\r
  flex-direction: column;\r
  overflow: hidden;\r
  /* Ensure container doesn't overflow its parent */\r
}\r
\r
.pdf-viewer-controls {\r
  flex: 0 0 auto;\r
  padding: 4px;\r
  background-color: var(--background-color);\r
  border-bottom: 1px solid var(--border-color);\r
}\r
\r
.pdf-viewer-controls button {\r
  margin-right: 4px;\r
}\r
\r
.pdf-canvas-container {\r
  flex: 1 1 auto;\r
  overflow: auto;\r
  /* Enable scrolling when content overflows */\r
}\r
\r
.pdf-canvas-container canvas {\r
  display: block;\r
  margin: 0 auto;\r
  /* Center the canvas horizontally */\r
}\r
\r
.lm-Menu,\r
.lm-MenuBar-item,\r
.lm-Menu .lm-Menu-itemLabel,\r
.lm-Menu .lm-Menu-itemShortcut,\r
.lm-Menu .lm-Menu-itemIcon,\r
.lm-TabBar-tabLabel,\r
.lm-TabBar-tabIcon,\r
.lm-TabBar-tabCloseIcon,\r
.monaco-editor,\r
.monaco-editor .view-lines,\r
.monaco-editor .mtk0,\r
.monaco-editor .mtk1,\r
.monaco-editor .mtk2,\r
.monaco-editor .mtk3,\r
.monaco-editor .mtk4,\r
.monaco-editor .mtk5,\r
.monaco-editor .mtk6,\r
.monaco-editor .mtk7,\r
.monaco-editor .mtk8,\r
.monaco-editor .mtk9 {\r
  /*\r
    Windows browsers render opaque text layers with ClearType, which performs\r
    sub-pixel (RGB) anti-aliasing. It manipulates each color subpixel to boost\r
    horizontal resolution, resulting in sharper glyph edges but visible color\r
    fringing under magnification.\r
\r
    When the compositor detects any non-opaque or transformed layer (opacity < 1,\r
    CSS transform, filter, etc.), it can no longer assume a fixed LCD subpixel\r
    layout. The text then moves off the \u201CLCD text path\u201D to the \u201Cnon-LCD path,\u201D\r
    where rendering falls back to grayscale anti-aliasing. Grayscale AA averages\r
    brightness uniformly across RGB, removing colored fringes and matching how\r
    native Windows menus, tab labels, and captions are drawn.\r
\r
    Applying \`opacity: 0.999\` forces that GPU-composited path on these UI elements,\r
    disabling ClearType and ensuring a clean grayscale look for menu labels,\r
    shortcuts, icons, and Lumino tab labels\u2014consistent with native Windows UI.\r
  */\r
  opacity: 0.999;\r
}\r
`],sourceRoot:""}]);const O=D}),68968:(h=>{h.exports="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAZdEVYdFNvZnR3YXJlAHBhaW50Lm5ldCA0LjAuMTZEaa/1AAAAHUlEQVQYV2PYvXu3JAi7uLiAMaYAjAGTQBPYLQkAa/0Zef3qRswAAAAASUVORK5CYII="}),86060:(h=>{h.exports="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIHZpZXdCb3g9IjAgMCA1MyAzNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwKSI+CjxwYXRoIGZpbGwtcnVsZT0iZXZlbm9kZCIgY2xpcC1ydWxlPSJldmVub2RkIiBkPSJNNDguMDM2NCA0LjAxMDQySDQuMDA3NzlMNC4wMDc3OSAzMi4wMjg2SDQ4LjAzNjRWNC4wMTA0MlpNNC4wMDc3OSAwLjAwNzgxMjVDMS43OTcyMSAwLjAwNzgxMjUgMC4wMDUxODc5OSAxLjc5OTg0IDAuMDA1MTg3OTkgNC4wMTA0MlYzMi4wMjg2QzAuMDA1MTg3OTkgMzQuMjM5MiAxLjc5NzIxIDM2LjAzMTIgNC4wMDc3OSAzNi4wMzEySDQ4LjAzNjRDNTAuMjQ3IDM2LjAzMTIgNTIuMDM5IDM0LjIzOTIgNTIuMDM5IDMyLjAyODZWNC4wMTA0MkM1Mi4wMzkgMS43OTk4NCA1MC4yNDcgMC4wMDc4MTI1IDQ4LjAzNjQgMC4wMDc4MTI1SDQuMDA3NzlaTTguMDEwNDIgOC4wMTMwMkgxMi4wMTNWMTIuMDE1Nkg4LjAxMDQyVjguMDEzMDJaTTIwLjAxODIgOC4wMTMwMkgxNi4wMTU2VjEyLjAxNTZIMjAuMDE4MlY4LjAxMzAyWk0yNC4wMjA4IDguMDEzMDJIMjguMDIzNFYxMi4wMTU2SDI0LjAyMDhWOC4wMTMwMlpNMzYuMDI4NiA4LjAxMzAySDMyLjAyNlYxMi4wMTU2SDM2LjAyODZWOC4wMTMwMlpNNDAuMDMxMiA4LjAxMzAySDQ0LjAzMzlWMTIuMDE1Nkg0MC4wMzEyVjguMDEzMDJaTTE2LjAxNTYgMTYuMDE4Mkg4LjAxMDQyVjIwLjAyMDhIMTYuMDE1NlYxNi4wMTgyWk0yMC4wMTgyIDE2LjAxODJIMjQuMDIwOFYyMC4wMjA4SDIwLjAxODJWMTYuMDE4MlpNMzIuMDI2IDE2LjAxODJIMjguMDIzNFYyMC4wMjA4SDMyLjAyNlYxNi4wMTgyWk00NC4wMzM5IDE2LjAxODJWMjAuMDIwOEgzNi4wMjg2VjE2LjAxODJINDQuMDMzOVpNMTIuMDEzIDI0LjAyMzRIOC4wMTA0MlYyOC4wMjZIMTIuMDEzVjI0LjAyMzRaTTE2LjAxNTYgMjQuMDIzNEgzNi4wMjg2VjI4LjAyNkgxNi4wMTU2VjI0LjAyMzRaTTQ0LjAzMzkgMjQuMDIzNEg0MC4wMzEyVjI4LjAyNkg0NC4wMzM5VjI0LjAyMzRaIiBmaWxsPSIjQzVDNUM1Ii8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDAiPgo8cmVjdCB3aWR0aD0iNTMiIGhlaWdodD0iMzYiIGZpbGw9IndoaXRlIi8+CjwvY2xpcFBhdGg+CjwvZGVmcz4KPC9zdmc+Cg=="})},h=>{var j=x=>h(h.s=x);h.O(0,[3642,2380],()=>j(48827));var a=h.O()}]);})();

//# sourceMappingURL=main.86d1207429aa3f35cd0f.js.map