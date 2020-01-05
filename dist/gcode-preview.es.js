import{Scene as e,Color as t,PerspectiveCamera as s,WebGLRenderer as r,Group as i,Euler as n,BufferGeometry as a,Float32BufferAttribute as o,LineBasicMaterial as h,LineSegments as c}from"three";import*as l from"three-orbitcontrols";class d extends class{constructor(e,t){this.gcode=e,this.comment=t}}{constructor(e,t,s){super(e,s),this.params=t}}class m{constructor(e,t){this.layer=e,this.commands=t}}class p{constructor(){this.layers=[],this.curZ=0,this.maxZ=0}parseCommand(e,t=!0){const s=e.trim().split(";"),r=s[0],i=t&&s[1]||null,n=r.split(/ +/g),a=n[0].toLowerCase();switch(a){case"g0":case"g1":const e=this.parseMove(n.slice(1));return new d(a,e,i);default:return null}}parseMove(e){return e.reduce((e,t)=>{const s=t.charAt(0).toLowerCase();return"x"!=s&&"y"!=s&&"z"!=s&&"e"!=s||(e[s]=parseFloat(t.slice(1))),e},{})}groupIntoLayers(e){for(const t of e.filter(e=>e instanceof d)){const e=t.params;e.z&&(this.curZ=e.z),e.e>0&&this.curZ>this.maxZ?(this.maxZ=this.curZ,this.currentLayer=new m(this.layers.length,[t]),this.layers.push(this.currentLayer)):this.currentLayer&&this.currentLayer.commands.push(t)}return this.layers}parseGcode(e){const t=Array.isArray(e)?e:e.split("\n").filter(e=>e.length>0),s=this.lines2commands(t);return this.groupIntoLayers(s),{layers:this.layers}}lines2commands(e){return e.filter(e=>e.length>0).map(e=>this.parseCommand(e)).filter(e=>null!==e)}}class u{constructor(i){if(this.parser=new p,this.backgroundColor=14737632,this.travelColor=10027008,this.extrusionColor=65280,this.renderExtrusion=!0,this.renderTravel=!1,this.scene=new e,this.scene.background=new t(this.backgroundColor),this.targetId=i.targetId,this.limit=i.limit,this.topLayerColor=i.topLayerColor,this.lastSegmentColor=i.lastSegmentColor,this.container=document.getElementById(this.targetId),!this.container)throw new Error("Unable to find element "+this.targetId);this.camera=new s(75,this.container.offsetWidth/this.container.offsetHeight,.1,1e3),this.camera.position.set(0,0,50),this.renderer=new r({preserveDrawingBuffer:!0}),this.renderer.setSize(this.container.offsetWidth,this.container.offsetHeight),this.renderer.setPixelRatio(window.devicePixelRatio),this.canvas=this.renderer.domElement,this.container.appendChild(this.canvas);new l(this.camera,this.renderer.domElement);this.animate()}get layers(){return this.parser.layers}animate(){requestAnimationFrame(()=>this.animate()),this.renderer.render(this.scene,this.camera)}processGCode(e){this.parser.parseGcode(e),this.render()}render(){for(;this.scene.children.length>0;)this.scene.remove(this.scene.children[0]);this.group=new i,this.group.name="gcode";const e={x:0,y:0,z:0,e:0};for(let s=0;s<this.layers.length&&!(s>this.limit);s++){const r={extrusion:[],travel:[],z:e.z},i=this.layers[s];for(const t of i.commands)if("g0"==t.gcode||"g1"==t.gcode){const s=t,i={x:void 0!==s.params.x?s.params.x:e.x,y:void 0!==s.params.y?s.params.y:e.y,z:void 0!==s.params.z?s.params.z:e.z,e:void 0!==s.params.e?s.params.e:e.e},n=s.params.e>0;(n&&this.renderExtrusion||!n&&this.renderTravel)&&this.addLineSegment(r,e,i,n),s.params.x&&(e.x=s.params.x),s.params.y&&(e.y=s.params.y),s.params.z&&(e.z=s.params.z),s.params.e&&(e.e=s.params.e)}if(this.renderExtrusion){const e=Math.round(80*s/this.layers.length),i=new t(`hsl(0, 0%, ${e}%)`).getHex();if(s==this.layers.length-1){const e=void 0!==this.topLayerColor?this.topLayerColor:i,t=void 0!==this.lastSegmentColor?this.lastSegmentColor:e,s=r.extrusion.splice(-3);this.addLine(r.extrusion,e);const n=r.extrusion.splice(-3);this.addLine([...n,...s],t)}else this.addLine(r.extrusion,i)}this.renderTravel&&this.addLine(r.travel,this.travelColor)}this.group.quaternion.setFromEuler(new n(-Math.PI/2,0,0)),this.group.position.set(-100,-20,100),this.scene.add(this.group),this.renderer.render(this.scene,this.camera)}clear(){this.limit=1/0,this.parser=new p}resize(){this.renderer.setSize(this.container.offsetWidth,this.container.offsetHeight),this.renderer.setPixelRatio(window.devicePixelRatio),this.camera.aspect=this.container.offsetWidth/this.container.offsetHeight,this.camera.updateProjectionMatrix()}addLineSegment(e,t,s,r){const i=r?e.extrusion:e.travel;i.push(t.x,t.y,t.z),i.push(s.x,s.y,s.z)}addLine(e,t){const s=new a;s.setAttribute("position",new o(e,3));const r=new h({color:t}),i=new c(s,r);this.group.add(i)}}export{u as WebGLPreview};
