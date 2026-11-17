/*! COSMOSIS script6.js - realistic procedural planets: Mercury to Pluto + Moon, with rings, tilts and a layered cut-away interior (Three.js r128, no image files needed)
 * Used by earth.html (Discover) and index12.html (Skill Lab). Put it in the SAME folder as index.html.
 * Terrain, oceans with sun-glint, biomes, polar ice, noise clouds, city lights, atmosphere glow and a
 * layered "cut open" interior are all generated on the GPU, so the page works offline after Three.js loads. */
(function () {
    'use strict';
    var T = window.THREE; if (!T || window.CosmosEarth) return;
    var RM = window.matchMedia && matchMedia('(prefers-reduced-motion:reduce)').matches;

    /* ---------------- shaders ---------------- */
    var NZ = 'float h31(vec3 p){p=fract(p*.1031);p+=dot(p,p.zyx+31.32);return fract((p.x+p.y)*p.z);}' +
        'float vn(vec3 x){vec3 i=floor(x),f=fract(x);f=f*f*(3.-2.*f);return mix(mix(mix(h31(i),h31(i+vec3(1.,0.,0.)),f.x),mix(h31(i+vec3(0.,1.,0.)),h31(i+vec3(1.,1.,0.)),f.x),f.y),mix(mix(h31(i+vec3(0.,0.,1.)),h31(i+vec3(1.,0.,1.)),f.x),mix(h31(i+vec3(0.,1.,1.)),h31(i+vec3(1.,1.,1.)),f.x),f.y),f.z);}' +
        'float fbm(vec3 p){float a=.5,s=0.;for(int i=0;i<5;i++){s+=a*vn(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=.5;}return s;}';
    var VS = 'varying vec3 vP;void main(){vP=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
    var CUT = 'if(uCut>.5&&vP.x>0.&&vP.y>0.&&vP.z>0.)discard;';

    /* surface: domain-warped continents, climate-driven biomes, shallow-water coasts, snow-capped peaks, craters,
       banded gas giants with storms, ring shadows, sun glint, twilight glow, city lights */
    var FS = `uniform vec3 uSunL,uCamL,uL1,uL2,uL3,uAtm;
uniform float uSea,uOcean,uVeg,uIce,uCrat,uBand,uCity,uCut,uWarm,uAtmK,uSeed,uTime,uBF,uSpot,uSpotY,uDark,uHeart,uRing,uRi,uRo;varying vec3 vP;` + NZ + `
float hgt(vec3 p){vec3 q=p*2.1+uSeed,w=vec3(vn(q),vn(q+5.2),vn(q+9.1))-.5;return fbm(p*1.6+w*1.1+uSeed)*.84+vn(p*12.+uSeed)*.16;}
float crat(vec3 p,float sc){vec3 q=p*sc,i=floor(q),f=fract(q);float s=0.;for(int x=-1;x<=1;x++)for(int y=-1;y<=1;y++)for(int z=-1;z<=1;z++){vec3 o=vec3(float(x),float(y),float(z)),k=i+o;if(h31(k+3.)>.45)continue;vec3 c=o+vec3(h31(k),h31(k+7.),h31(k+13.));float r=.16+.22*h31(k+21.),d=length(f-c)/r;s+=-.22*(1.-smoothstep(.55,.9,d))+.3*exp(-pow((d-1.)*5.,2.));}return s;}
void main(){` + CUT + `
vec3 p=normalize(vP),v=normalize(uCamL-vP);float dl=dot(p,uSunL),day=smoothstep(-.1,.22,dl),lat=abs(p.y);
vec3 col,n=p;float oc=0.,ice=0.,el=0.,cityM=0.;vec3 rp=vec3(0.);
if(uBand>.5){
float w=fbm(vec3(p.x*2.,p.y*8.,p.z*2.)+uTime*.01)*.5;float y=p.y+w*.16;
float b=.5+.5*sin(y*uBF);b=b*.65+fbm(vec3(p.x*5.,p.y*uBF*1.3+w*3.,p.z*5.))*.35;col=mix(uL1,uL2,smoothstep(.25,.75,b));
float a=mod(atan(p.z,p.x)-1.1+3.14159,6.28318)-3.14159;float sd=length(vec2(a*.9,(p.y-uSpotY)*3.));
col=mix(col,uL3,(1.-smoothstep(.08,.3,sd))*uSpot);col*=1.+.12*uSpot*sin(sd*30.)*(1.-smoothstep(.3,.6,sd));
col=mix(col,col*1.25+.05,smoothstep(.62,.8,fbm(vec3(p.x*9.,p.y*uBF*2.,p.z*9.)))*.35);col*=1.-.25*smoothstep(.6,1.,lat);
}else{
float h=hgt(p),e=.011;vec3 g=(vec3(hgt(normalize(p+vec3(e,0.,0.))),hgt(normalize(p+vec3(0.,e,0.))),hgt(normalize(p+vec3(0.,0.,e))))-h)/e;
oc=uOcean*step(h,uSea);el=clamp((h-uSea)/.34,0.,1.);
float mo=fbm(p*3.3+7.3)+.18*(1.-smoothstep(0.,.3,lat))-.3*exp(-pow((lat-.3)/.11,2.));float tp=1.-lat*1.2-el*.45+uWarm;
float veg=uVeg*smoothstep(.36,.6,mo)*smoothstep(.02,.3,tp);
vec3 lc=mix(uL2*(.82+.36*fbm(p*4.+1.9)),mix(uL1*.7,uL1*1.35,fbm(p*14.)),veg);
lc=mix(lc,uL3*(.7+.6*fbm(p*20.)),smoothstep(.3,.75,el));
lc=mix(lc,uL2*1.25,(1.-smoothstep(0.,.025,h-uSea))*uOcean*.6);
lc=mix(lc,vec3(.95,.96,.98),smoothstep(.72,.92,el)*uOcean);
if(uCrat>0.)lc*=1.+crat(p,5.)+.6*crat(p,14.);
lc=mix(lc,uL3*.55,uDark*smoothstep(.52,.58,fbm(p*2.2+3.)));
if(uHeart>0.){float hd=max(dot(p,normalize(vec3(.1,.25,.96))),dot(p,normalize(vec3(.6,0.,.8))));lc=mix(lc,vec3(.95,.88,.8),uHeart*smoothstep(.9,.95,hd));}
float dp=clamp((uSea-h)/.14,0.,1.);vec3 sea=mix(vec3(.05,.42,.5),vec3(.008,.04,.14),pow(dp,.6));sea*=.92+.16*fbm(p*30.);
sea=mix(sea,vec3(.16,.66,.64),(1.-smoothstep(0.,.03,uSea-h))*.8);sea+=(1.-smoothstep(0.,.006,uSea-h))*.45;
ice=smoothstep(1.-uIce-.04,1.-uIce+.04,lat+el*.22+.08*(fbm(p*7.)-.5))*step(.001,uIce);
col=mix(mix(lc,sea,oc),vec3(.93,.96,1.),ice);rp=vec3(vn(p*70.+uTime*.04),vn(p*70.+7.),vn(p*70.+13.))-.5;n=normalize(p-g*.09*(1.-oc)*(1.-ice*.7)+rp*.04*(1.-oc)*(1.-ice));
cityM=smoothstep(.6,.7,fbm(p*26.+3.))*(.55+.9*vn(p*140.))*(1.-smoothstep(.15,.5,el))*(1.-oc)*(1.-ice)*smoothstep(.1,.4,uVeg);}
float sp=oc*(1.-ice),rs=1.;
if(uRing>.5&&abs(uSunL.y)>.02){float tt=-p.y/uSunL.y;if(tt>0.){vec3 hp=p+uSunL*tt;float rr=length(hp.xz);rs=1.-.7*smoothstep(uRi,uRi*1.02,rr)*(1.-smoothstep(uRo*.98,uRo,rr));}}
float lit=max(dot(n,uSunL),0.)*day*rs;vec3 hv=normalize(uSunL+v);float fr=1.-max(dot(p,v),0.);float hp2=max(dot(normalize(p+rp*.07*oc),hv),0.);
col=mix(col,vec3(.35,.55,.85),pow(fr,4.)*.35*sp);
vec3 c=col*(lit*1.4+.03)+vec3(1.,.93,.8)*(pow(hp2,90.)*1.3+pow(hp2,12.)*.06)*sp*day*rs;
c+=vec3(.95,.4,.12)*exp(-pow(dl/.13,2.))*uAtmK*.09;c+=uAtm*pow(fr,3.)*uAtmK*(.12+day*.88)*.75;
c*=1.-(uBand>.5?.35:0.)*pow(fr,2.);
c+=vec3(1.,.74,.38)*cityM*(1.-smoothstep(-.14,.04,dl))*uCity*1.5;gl_FragColor=vec4(c,1.);}`;

    /* clouds: swirling, self-shadowed (Venus uses cover>1 for a solid acid-cloud deck) */
    var CF = 'uniform vec3 uSunL,uCol;uniform float uCover,uCut,uTime,uSeed2;varying vec3 vP;' + NZ +
        'float cn(vec3 p){vec3 q=vec3(p.x*2.4,p.y*4.2,p.z*2.4)+vec3(uTime*.012,0.,uSeed2);return fbm(q+fbm(q*2.+3.)*.7);}' +
        'void main(){' + CUT + 'vec3 p=normalize(vP);float n=cn(p),tc=.7-.45*uCover,a=smoothstep(tc-.13,tc+.17,n);' +
        'float sh=clamp(1.-(cn(normalize(p+uSunL*.03))-n)*3.,.55,1.15),l=smoothstep(-.12,.3,dot(p,uSunL));' +
        'gl_FragColor=vec4(uCol*(.05+l*1.05)*(.75+.5*n)*sh,a*.94);}';

    var AV = 'varying vec3 vN;void main(){vN=normalize(normalMatrix*normal);gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
    var AF = 'uniform vec3 uAtm,uSunV;uniform float uK;varying vec3 vN;void main(){float c=clamp(-vN.z,0.,1.);float i=pow(c,1.4)*2.4;float s=.3+.7*smoothstep(-.4,.5,dot(vN,uSunV));gl_FragColor=vec4(uAtm*i*s*uK,1.);}';

    /* cut-away walls: up to 5 layers, rock grain, flowing liquid metal, icy streaks, crust strata,
       heat glow toward the centre, dark boundary lines and corner shading */
    var KF = 'uniform float uR[5];uniform vec3 uC[5];uniform float uT[5];uniform float uHi,uTime,uN;varying vec3 vP;' + NZ + `
void main(){float d=length(vP.xy),id=0.;vec3 c=uC[0];float tp=uT[0],r0=0.,r1=uR[0];
for(int i=1;i<5;i++){if(float(i)<uN&&d>uR[i-1]){id=float(i);c=uC[i];tp=uT[i];r0=uR[i-1];r1=uR[i];}}
vec2 q=vP.xy;float sp=tp>.5&&tp<1.5?.16:(tp>1.5&&tp<2.5?.07:.02);
float a=fbm(vec3(q*8.,id*5.+uTime*sp)),b=vn(vec3(q*34.,id*9.));vec3 k=c*(.6+.75*a);
if(tp<.5)k*=.88+.24*b;
else if(tp<1.5){float s=fbm(vec3(q.x*14.+a*4.,q.y*5.,uTime*.25+id));k+=c*pow(s,2.)*1.4;}
else if(tp>2.5)k=mix(k,vec3(.88,.95,1.),.3*a)*(.9+.2*b);
if(id>uN-1.5&&tp<.5)k*=.82+.18*sin(d*480.+a*6.);
k*=1.+.55*(1.-d);
float e=min(abs(d-r1),id>.5?abs(d-r0):1.);k*=.45+.55*smoothstep(0.,.011,e);
k*=.6+.4*smoothstep(0.,.07,min(vP.x,vP.y));
k*=(uHi<-.5||abs(uHi-id)<.5)?1.:.25;if(abs(uHi-id)<.5)k*=1.2+.12*sin(uTime*4.);
gl_FragColor=vec4(k,1.);}`;

    /* the innermost core as a real glowing ball sitting in the cut-away */
    var BF = 'uniform vec3 uCol,uCamL;uniform float uHi,uTime;varying vec3 vP;' + NZ +
        'void main(){vec3 p=normalize(vP),v=normalize(uCamL-vP);float fr=pow(1.-max(dot(p,v),0.),2.5),a=fbm(p*6.+uTime*.05),b=vn(p*22.);' +
        'vec3 c=uCol*(.7+.6*a)*(.9+.2*b)+vec3(1.,.85,.5)*(.25+fr*.9);c*=(uHi<-.5||abs(uHi)<.5)?1.:.3;gl_FragColor=vec4(c,1.);}';

    /* rings: Saturn (C, B, Cassini gap, A, Encke gap) and Uranus (thin, faint), with the planet's shadow */
    var RF = 'uniform vec3 uSunT;uniform float uRi,uRo,uType;varying vec3 vP;float hh(float x){return fract(sin(x*127.1)*43758.5453);}' + `
void main(){float t=clamp((length(vP.xz)-uRi)/(uRo-uRi),0.,1.),dn=0.;
if(uType<.5){dn=smoothstep(0.,.03,t)*(1.-smoothstep(.27,.29,t))*.22+smoothstep(.27,.3,t)*(1.-smoothstep(.68,.7,t))*(.75+.25*hh(floor(t*90.)))+smoothstep(.77,.79,t)*(1.-smoothstep(.985,1.,t))*.6;
dn*=(1.-.9*exp(-pow((t-.95)/.008,2.)))*(.8+.2*hh(floor(t*220.)));}
else dn=.55*exp(-pow((t-.12)/.02,2.))+.5*exp(-pow((t-.5)/.025,2.))+.8*exp(-pow((t-.9)/.03,2.));
vec3 s=normalize(uSunT);float b=dot(vP,s),dc=b*b-(dot(vP,vP)-1.);float sh=(dc>0.&&b<0.)?.12:1.;
vec3 col=mix(vec3(.58,.5,.4),vec3(.86,.78,.64),hh(floor(t*140.)+3.))*sh*(.55+.6*dn);
gl_FragColor=vec4(col,dn*(uType<.5?.92:.4));}`;

    /* ---------------- planet data ----------------
     * s = look (shader inputs) · layers = [outer radius, colour, name, text, type 0 rock/1 liquid/2 gas/3 ice] (crust drawn thicker than real)
     * f = facts · k = life checklist (water, air, temperature, magnetic shield, solid ground) · r = radius vs Earth · ext = size incl. rings */
    var N0 = [0, 0, 0];
    var P = {
        earth: {
            n: 'Earth', tag: 'The only world we know with life.', spin: .12, seed: 0, tilt: 23.4, r: 1, ext: 1,
            s: { sea: .545, ocean: 1, veg: 1, ice: .08, crat: 0, band: 0, city: 1, warm: 0, atmK: 1, atm: [.3, .55, 1], cover: .48, ccol: [1, 1, 1], L1: [.18, .36, .1], L2: [.62, .5, .32], L3: [.46, .42, .4] },
            layers: [[.19, '#ffe08a', 'Inner core', 'A solid iron-nickel ball, about 5,400 °C (as hot as the Sun’s surface), squeezed so hard it cannot melt.', 0], [.546, '#ff8a2a', 'Outer core', 'Liquid iron-nickel, about 2,200 km thick. Its churning motion makes Earth’s magnetic field, our shield against the solar wind.', 1], [.895, '#d2461e', 'Lower mantle', 'Hot, dense rock (1,000–3,700 °C) that creeps slowly. Heat rising from here drives the plates above.', 0], [.965, '#9c3a22', 'Upper mantle', 'Rock that flows like very thick toffee over millions of years and carries the tectonic plates.', 0], [1, '#6b5a45', 'Crust', 'The thin rocky skin we live on, 5–70 km thick (drawn thicker here).', 0]],
            f: ['6,371 km', '9.8 m/s² (1 g)', '15 °C average', '24 hours', '78% nitrogen, 21% oxygen, 1 atm', 'Oceans cover 71%', 'Strong (liquid core dynamo)', '1 AU'], k: '11111',
            why: 'Earth sits in the “Goldilocks zone”: not too hot, not too cold. Liquid water, breathable air, a magnetic shield and just enough gravity to hold the atmosphere all work together.'
        },
        moon: {
            n: 'Moon', tag: 'Earth’s only natural satellite.', spin: .03, seed: 5, tilt: 6.7, r: .27, ext: 1,
            s: { sea: .5, ocean: 0, veg: 0, ice: 0, crat: 1, band: 0, city: 0, warm: 0, atmK: 0, atm: N0, cover: 0, ccol: [1, 1, 1], L1: [.5, .5, .5], L2: [.56, .55, .52], L3: [.74, .73, .7], dark: .8 },
            layers: [[.14, '#ffe3a0', 'Inner core', 'A small solid iron-rich ball, about 240 km in radius.', 0], [.19, '#ff9a3a', 'Outer core', 'A thin shell of liquid iron.', 1], [.965, '#a05a3a', 'Mantle', 'Cool, mostly solid rock. Ancient lava from here filled the dark “seas” (maria).', 0], [1, '#8d8a85', 'Crust', 'Cratered grey rock, about 40 km thick (drawn thicker here).', 0]],
            f: ['1,737 km', '1.6 m/s² (0.17 g)', '−20 °C average (−173 to 127 °C)', '27.3 days', 'Almost none', 'Only ice in dark polar craters', 'None', '1 AU'], k: '00001',
            why: 'The Moon is too small to hold an atmosphere. With no air to spread heat or block radiation, days are scorching, nights are freezing, and water cannot stay liquid.'
        },
        mercury: {
            n: 'Mercury', tag: 'A scorched, cratered iron ball.', spin: .02, seed: 11, tilt: 0, r: .38, ext: 1,
            s: { sea: .5, ocean: 0, veg: 0, ice: 0, crat: 1, band: 0, city: 0, warm: 0, atmK: 0, atm: N0, cover: 0, ccol: [1, 1, 1], L1: [.5, .5, .5], L2: [.5, .46, .42], L3: [.64, .61, .58], dark: .3 },
            layers: [[.41, '#ffe3a0', 'Solid inner core', 'A solid iron ball, hidden deep inside.', 0], [.83, '#ff9a3a', 'Liquid outer core', 'Mercury’s core is huge: about 83% of its radius. Part of it is liquid, which gives a weak magnetic field.', 1], [.97, '#a05a3a', 'Silicate mantle', 'A surprisingly thin layer of rock, only about 400 km thick.', 0], [1, '#8d7f73', 'Crust', 'Dark, cratered rock, shrivelled and cracked as the planet cooled and shrank.', 0]],
            f: ['2,440 km (0.38× Earth)', '3.7 m/s² (0.38 g)', '167 °C average (−180 to 430 °C)', '176 Earth days (sunrise to sunrise)', 'Almost none (a thin exosphere)', 'Only ice in dark polar craters', 'Weak (about 1% of Earth’s)', '0.39 AU'], k: '00011',
            why: 'Mercury is too small to keep an atmosphere, so heat escapes at night. Sunlit rock reaches 430 °C while shadows fall to −180 °C. There is no air and no liquid water.'
        },
        venus: {
            n: 'Venus', tag: 'Earth’s twin in size, but a furnace.', spin: -.02, seed: 8, tilt: 3, r: .95, ext: 1,
            s: { sea: .4, ocean: 0, veg: 0, ice: 0, crat: 0, band: 0, city: 0, warm: .9, atmK: 1.3, atm: [1, .65, .25], cover: 1.6, ccol: [.93, .79, .46], L1: [.5, .3, .18], L2: [.52, .33, .18], L3: [.4, .28, .2] },
            layers: [[.5, '#ffb347', 'Core', 'An iron-nickel core, probably liquid, about half the planet’s radius.', 1], [.965, '#b8431f', 'Mantle', 'Hot rock, similar to Earth’s. Venus has no moving plates, so heat builds up.', 0], [1, '#6e4a30', 'Crust', 'Volcanic plains under crushing pressure (drawn thicker here).', 0]],
            f: ['6,052 km', '8.9 m/s² (0.9 g)', '464 °C average', '243 Earth days (spins backwards)', '96% CO₂, 92× Earth’s pressure', 'None – it boiled away', 'Very weak (induced only)', '0.72 AU'], k: '00001',
            why: 'Venus is a runaway greenhouse. A thick CO₂ blanket traps heat, so the surface is hot enough to melt lead, with 92× Earth’s pressure and clouds of sulphuric acid.'
        },
        mars: {
            n: 'Mars', tag: 'The cold red desert next door.', spin: .115, seed: 3, tilt: 25.2, r: .53, ext: 1,
            s: { sea: .38, ocean: 0, veg: 0, ice: .07, crat: 0, band: 0, city: 0, warm: .3, atmK: .28, atm: [.85, .55, .4], cover: .07, ccol: [.95, .82, .7], L1: [.5, .25, .14], L2: [.74, .39, .2], L3: [.36, .2, .15], dark: .55 },
            layers: [[.54, '#ffb347', 'Core', 'A dense iron-sulphur core, probably liquid, about 1,800 km in radius.', 1], [.965, '#a9442a', 'Mantle', 'Rock that is no longer moving much, so Mars has little volcanic activity left.', 0], [1, '#8a4a30', 'Crust', 'Iron-rich rock; the iron rusts, which makes Mars red (drawn thicker here).', 0]],
            f: ['3,390 km', '3.7 m/s² (0.38 g)', '−63 °C average', '24 h 37 min', 'Very thin CO₂ (0.6% of Earth’s pressure)', 'Ice caps; no liquid water on the surface', 'No global field (weak patches only)', '1.52 AU'], k: '00001',
            why: 'Scientists think Mars lost its global magnetic field early, letting the solar wind strip most of its air. Now it is cold and the air is so thin that liquid water would boil away. Radiation reaches the ground.'
        },
        jupiter: {
            n: 'Jupiter', tag: 'A gas giant with a storm bigger than Earth.', spin: .3, seed: 2, tilt: 3.1, r: 11.2, ext: 1,
            s: { sea: .5, ocean: 0, veg: 0, ice: 0, crat: 0, band: 1, city: 0, warm: 0, atmK: .35, atm: [.7, .75, .9], cover: 0, ccol: [1, 1, 1], L1: [.84, .68, .5], L2: [.58, .38, .27], L3: [.74, .3, .16], bf: 26, spot: .85, spotY: -.3 },
            layers: [[.15, '#ffd27a', 'Dense core', 'A hot core of rock, ice and metal, perhaps 10–20 Earth masses. Its size is still uncertain.', 0], [.8, '#9fb8d8', 'Metallic hydrogen', 'So squeezed that hydrogen conducts electricity. This makes Jupiter’s enormous magnetic field.', 1], [.97, '#d8b48a', 'Molecular hydrogen', 'Hydrogen and helium gas getting denser with depth. There is no solid ground.', 2], [1, '#e8d3b5', 'Cloud tops', 'Ammonia clouds stretched into coloured bands. The Great Red Spot is a storm.', 2]],
            f: ['69,911 km (11× Earth)', '24.8 m/s² (2.5 g)', '−110 °C at cloud tops', '9.9 hours', 'Hydrogen and helium', 'Only vapour deep inside', 'Extreme (≈20,000× Earth’s)', '5.2 AU'], k: '00010',
            why: 'Jupiter has no solid surface to stand on, crushing pressure, and deadly radiation belts. Its temperature swings from freezing cloud tops to thousands of degrees inside.'
        },
        saturn: {
            n: 'Saturn', tag: 'The ringed jewel, light enough to float.', spin: .28, seed: 4, tilt: 26.7, r: 9.45, ext: 2.3, ring: [1.24, 2.27, 0],
            s: { sea: .5, ocean: 0, veg: 0, ice: 0, crat: 0, band: 2, city: 0, warm: 0, atmK: .25, atm: [.9, .8, .6], cover: 0, ccol: [1, 1, 1], L1: [.93, .84, .62], L2: [.78, .66, .45], L3: [.7, .6, .4], bf: 20, spot: 0, spotY: 0 },
            layers: [[.2, '#ffd27a', 'Rocky core', 'A hot core of rock and ice, roughly 9–22 Earth masses, near 11,700 °C.', 0], [.6, '#9fb8d8', 'Metallic hydrogen', 'Liquid metal-like hydrogen. Its flow powers Saturn’s strong magnetic field.', 1], [.97, '#e0c590', 'Molecular hydrogen', 'Hydrogen and helium gas, with helium raining slowly downward.', 2], [1, '#ecd9a8', 'Cloud tops', 'Pale ammonia clouds in gentle golden bands.', 2]],
            f: ['58,232 km (9.5× Earth)', '10.4 m/s² (1.06 g)', '−140 °C at cloud tops', '10.7 hours', 'Hydrogen and helium', 'Only vapour deep inside', 'Strong (≈600× Earth’s)', '9.6 AU'], k: '00010',
            why: 'Saturn has no solid ground, crushing pressure inside and winds over 1,000 km/h. It is so light (less dense than water) that it would float in a giant enough bathtub. The rings are billions of icy chunks.'
        },
        uranus: {
            n: 'Uranus', tag: 'An ice giant rolling on its side.', spin: -.17, seed: 6, tilt: 97.8, r: 4, ext: 2, ring: [1.6, 2, 1],
            s: { sea: .5, ocean: 0, veg: 0, ice: 0, crat: 0, band: 3, city: 0, warm: 0, atmK: .5, atm: [.5, .9, .95], cover: 0, ccol: [1, 1, 1], L1: [.66, .9, .92], L2: [.58, .84, .88], L3: [.6, .85, .9], bf: 6, spot: 0, spotY: 0 },
            layers: [[.25, '#ffd27a', 'Rocky core', 'A small core of rock and iron, only about as hot as the Sun’s surface.', 0], [.8, '#8fd0ff', 'Icy mantle', 'A hot, dense “slush” of water, ammonia and methane. Astronomers call these chemicals “ices”.', 3], [1, '#bff3f0', 'Atmosphere', 'Hydrogen, helium and methane. Methane absorbs red light and makes Uranus pale cyan.', 2]],
            f: ['25,362 km (4× Earth)', '8.9 m/s² (0.9 g)', '−195 °C at cloud tops', '17 hours (spins on its side)', 'Hydrogen, helium and methane', 'Deep, hot “water” mantle', 'Strong, tilted and off-centre', '19.2 AU'], k: '00010',
            why: 'Uranus is a frozen, windy giant with no solid surface. It is tipped over 98°, so each pole gets 42 years of sunlight, then 42 years of darkness.'
        },
        neptune: {
            n: 'Neptune', tag: 'The windiest world, deep blue and far away.', spin: .2, seed: 9, tilt: 28.3, r: 3.88, ext: 1,
            s: { sea: .5, ocean: 0, veg: 0, ice: 0, crat: 0, band: 3, city: 0, warm: 0, atmK: .5, atm: [.3, .5, 1], cover: 0, ccol: [1, 1, 1], L1: [.2, .35, .9], L2: [.12, .22, .72], L3: [.04, .08, .35], bf: 14, spot: .8, spotY: -.35 },
            layers: [[.25, '#ffd27a', 'Rocky core', 'A core of rock and iron, about as massive as Earth.', 0], [.8, '#6fa8ff', 'Icy mantle', 'Hot, dense water, ammonia and methane. “Diamond rain” may fall deep inside.', 3], [1, '#9fc4ff', 'Atmosphere', 'Hydrogen, helium and methane. The blue colour comes from methane.', 2]],
            f: ['24,622 km (3.9× Earth)', '11.1 m/s² (1.14 g)', '−200 °C at cloud tops', '16 hours', 'Hydrogen, helium and methane', 'Deep, hot “water” mantle', 'Strong but tilted (≈27× Earth’s)', '30.1 AU'], k: '00010',
            why: 'Neptune has the fastest winds in the Solar System (over 2,000 km/h), no solid surface and temperatures near −200 °C. Sunlight there is 900× fainter than on Earth.'
        },
        pluto: {
            n: 'Pluto', tag: 'A tiny, icy dwarf planet with a heart.', spin: -.04, seed: 13, tilt: 122, r: .19, ext: 1,
            s: { sea: .5, ocean: 0, veg: 0, ice: 0, crat: 0, band: 0, city: 0, warm: 0, atmK: .12, atm: [.4, .55, .9], cover: 0, ccol: [1, 1, 1], L1: [.5, .4, .3], L2: [.62, .5, .4], L3: [.45, .25, .18], dark: .35, heart: .9 },
            layers: [[.7, '#c98a55', 'Rocky core', 'A core of rock, about 1,700 km across, making up most of Pluto’s mass.', 0], [.83, '#4fa3ff', 'Hidden ocean (possible)', 'Evidence suggests a deep salty ocean may lie under the ice, kept liquid by heat from the core.', 1], [.975, '#bfe3ff', 'Water-ice shell', 'Water ice as hard as rock at −230 °C.', 3], [1, '#f2e6d8', 'Surface ices', 'Frozen nitrogen, methane and carbon monoxide. The bright “heart” is a plain of nitrogen ice.', 3]],
            f: ['1,188 km (0.19× Earth)', '0.62 m/s² (0.06 g)', '−229 °C average', '6.4 Earth days (spins backwards)', 'Thin nitrogen haze (≈100,000× thinner than Earth’s)', 'Possibly an underground ocean', 'None detected', '39.5 AU (29–49 AU)'], k: '00001',
            why: 'Pluto is a dwarf planet at the cold edge of the Solar System. It is far too cold for liquid water at the surface, its air is almost gone, and sunlight is 1,000× fainter than on Earth.'
        }
    };

    /* ---------------- planet factory ---------------- */
    var inv = new T.Matrix4();
    function planet(key) {
        var d = P[key], s = d.s, g = new T.Group(), tl = new T.Group(), sp = new T.Group(), cutOn = false, cut = { value: 0 }, tilt = (d.tilt || 0) * Math.PI / 180, rg = d.ring;
        g.add(tl); tl.add(sp); tl.rotation.z = tilt;
        var V = function (a) { return new T.Vector3(a[0], a[1], a[2]); };
        var u = {
            uSunL: { value: new T.Vector3(1, 0, 0) }, uCamL: { value: new T.Vector3(0, 0, 4) }, uL1: { value: V(s.L1) }, uL2: { value: V(s.L2) }, uL3: { value: V(s.L3) }, uAtm: { value: V(s.atm) }, uSea: { value: s.sea }, uOcean: { value: s.ocean }, uVeg: { value: s.veg }, uIce: { value: s.ice }, uCrat: { value: s.crat }, uBand: { value: s.band }, uCity: { value: s.city }, uCut: cut, uWarm: { value: s.warm }, uAtmK: { value: s.atmK }, uSeed: { value: d.seed }, uTime: { value: 0 },
            uBF: { value: s.bf || 0 }, uSpot: { value: s.spot || 0 }, uSpotY: { value: s.spotY || 0 }, uDark: { value: s.dark || 0 }, uHeart: { value: s.heart || 0 }, uRing: { value: rg && rg[2] === 0 ? 1 : 0 }, uRi: { value: rg ? rg[0] : 0 }, uRo: { value: rg ? rg[1] : 0 }
        };
        sp.add(new T.Mesh(new T.SphereGeometry(1, 112, 72), new T.ShaderMaterial({ uniforms: u, vertexShader: VS, fragmentShader: FS })));
        var uc = { uSunL: u.uSunL, uCol: { value: V(s.ccol) }, uCover: { value: s.cover }, uCut: cut, uTime: u.uTime, uSeed2: { value: d.seed * 3.1 + 1.3 } };
        var cl = new T.Mesh(new T.SphereGeometry(1.013, 80, 56), new T.ShaderMaterial({ uniforms: uc, vertexShader: VS, fragmentShader: CF, transparent: true, depthWrite: false }));
        cl.renderOrder = 1; cl.visible = s.cover > .02; sp.add(cl);
        var ua = { uAtm: u.uAtm, uK: { value: 0 }, uSunV: { value: new T.Vector3(1, 0, 0) } };
        var at = new T.Mesh(new T.SphereGeometry(1.09, 64, 48), new T.ShaderMaterial({ uniforms: ua, vertexShader: AV, fragmentShader: AF, transparent: true, side: T.BackSide, blending: T.AdditiveBlending, depthWrite: false }));
        at.renderOrder = 2; g.add(at);
        var ring = null, ru = null;
        if (rg) {
            var rgeo = new T.RingGeometry(rg[0], rg[1], 180, 1); rgeo.rotateX(-Math.PI / 2);
            ru = { uSunT: { value: new T.Vector3(1, 0, 0) }, uRi: { value: rg[0] }, uRo: { value: rg[1] }, uType: { value: rg[2] } };
            ring = new T.Mesh(rgeo, new T.ShaderMaterial({ uniforms: ru, vertexShader: VS, fragmentShader: RF, transparent: true, side: T.DoubleSide, depthWrite: false }));
            ring.renderOrder = 1; tl.add(ring);
        }
        /* cut-away: three wall quarter-discs + the inner core as a real ball (arrays padded to 5 layers) */
        var L = d.layers, n = L.length, pad = function (f) { var a = []; for (var i = 0; i < 5; i++) a.push(f(L[Math.min(i, n - 1)])); return a; };
        var cu = { uR: { value: pad(function (l) { return l[0]; }) }, uC: { value: pad(function (l) { return new T.Color(l[1]); }) }, uT: { value: pad(function (l) { return l[4] || 0; }) }, uN: { value: n }, uHi: { value: -1 }, uTime: u.uTime };
        var capM = new T.ShaderMaterial({ uniforms: cu, vertexShader: VS, fragmentShader: KF, side: T.DoubleSide });
        var caps = new T.Group();
        [[0, 0], [Math.PI / 2, 0], [0, -Math.PI / 2]].forEach(function (r) { var m = new T.Mesh(new T.CircleGeometry(.997, 64, 0, Math.PI / 2), capM); m.rotation.set(r[0], r[1], 0); caps.add(m); });
        caps.visible = false; sp.add(caps);
        var bu = { uCol: { value: new T.Color(L[0][1]) }, uCamL: u.uCamL, uHi: cu.uHi, uTime: u.uTime };
        var ball = new T.Mesh(new T.SphereGeometry(1, 48, 32), new T.ShaderMaterial({ uniforms: bu, vertexShader: VS, fragmentShader: BF }));
        ball.scale.setScalar(L[0][0] * .998); ball.visible = false; sp.add(ball);
        var FM = { sea: u.uSea, ocean: u.uOcean, veg: u.uVeg, ice: u.uIce, warm: u.uWarm, city: u.uCity, atmK: u.uAtmK, cover: uc.uCover };
        var VM = { L1: u.uL1, L2: u.uL2, L3: u.uL3, atm: u.uAtm, ccol: uc.uCol };
        function glow() { ua.uK.value = cutOn ? 0 : u.uAtmK.value * .85; cl.visible = uc.uCover.value > .02; }
        glow();
        return {
            g: g, key: key, u: u,
            set: function (o) { for (var k in o) { if (FM[k]) FM[k].value = o[k]; else if (VM[k]) VM[k].value.set(o[k][0], o[k][1], o[k][2]); } glow(); },
            cut: function (on) { cutOn = !!on; cut.value = on ? 1 : 0; caps.visible = ball.visible = cutOn; tl.rotation.z = on ? 0 : tilt; if (on) sp.rotation.y = 0; if (ring) ring.visible = !on; glow(); },
            hi: function (i) { cu.uHi.value = i; },
            update: function (t, dt, cam, sun) {
                if (!g.visible) return;
                if (!cutOn && !RM) sp.rotation.y += d.spin * dt;
                u.uTime.value = t; g.updateMatrixWorld(true); inv.copy(sp.matrixWorld).invert();
                u.uSunL.value.copy(sun).transformDirection(inv); u.uCamL.value.copy(cam.position).applyMatrix4(inv);
                ua.uSunV.value.copy(sun).transformDirection(cam.matrixWorldInverse);
                if (ru) { inv.copy(tl.matrixWorld).invert(); ru.uSunT.value.copy(sun).transformDirection(inv); }
            }
        };
    }

    /* ---------------- scene, sky, loop ---------------- */
    function sky(sc, SUN) {
        var n = 2600, p = new Float32Array(n * 3), c = new Float32Array(n * 3), seed = 11, r = function () { return (seed = seed * 16807 % 2147483647) / 2147483647; };
        for (var i = 0; i < n; i++) {
            var y = r() < .4 ? (r() + r() + r() - 1.5) * .35 : r() * 2 - 1, a = r() * 6.283, q = Math.sqrt(1 - y * y), b = .35 + r() * .65, tint = r();
            p.set([400 * q * Math.cos(a), 400 * y, 400 * q * Math.sin(a)], i * 3);
            c.set(tint < .2 ? [.7 * b, .8 * b, b] : tint < .35 ? [b, .85 * b, .65 * b] : [b, b, b], i * 3);
        }
        var gm = new T.BufferGeometry(); gm.setAttribute('position', new T.BufferAttribute(p, 3)); gm.setAttribute('color', new T.BufferAttribute(c, 3));
        var st = new T.Points(gm, new T.PointsMaterial({ size: 1.6, sizeAttenuation: false, vertexColors: true, transparent: true, opacity: .9, depthWrite: false })); st.frustumCulled = false; sc.add(st);
        var cv = document.createElement('canvas'); cv.width = cv.height = 128; var x = cv.getContext('2d'), gr = x.createRadialGradient(64, 64, 0, 64, 64, 64);
        gr.addColorStop(0, 'rgba(255,250,225,1)'); gr.addColorStop(.12, 'rgba(255,225,150,.7)'); gr.addColorStop(.4, 'rgba(255,160,60,.16)'); gr.addColorStop(1, 'rgba(255,120,40,0)'); x.fillStyle = gr; x.fillRect(0, 0, 128, 128);
        var sp = new T.Sprite(new T.SpriteMaterial({ map: new T.CanvasTexture(cv), blending: T.AdditiveBlending, depthWrite: false, transparent: true })); sp.scale.setScalar(70); sp.position.copy(SUN).multiplyScalar(120); sc.add(sp);
    }

    function init(cv, o) {
        o = o || {};
        var r = new T.WebGLRenderer({ canvas: cv, antialias: true, powerPreference: 'high-performance' }); r.setClearColor(0x02030a);
        var sc = new T.Scene(), cam = new T.PerspectiveCamera(45, 1, .1, 800), ctl = new T.OrbitControls(cam, cv);
        ctl.enablePan = false; ctl.enableDamping = true; ctl.minDistance = 1.8; ctl.maxDistance = 18;
        var SUN = new T.Vector3(-.75, .3, .6).normalize(), DIR = new T.Vector3(.5, .3, .81).normalize(), list = [], env = { scene: sc, camera: cam, ctl: ctl, renderer: r };
        sky(sc, SUN);
        function size() {
            var w = innerWidth, h = innerHeight, mob = w <= 760, asp = w / h;
            r.setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)); r.setSize(w, h, false); cam.aspect = asp; cam.fov = asp < 1 ? Math.min(78, 45 / Math.max(.45, asp)) : 45;
            var sx = mob ? 0 : (o.shift || 0), sy = mob ? Math.round(h * (o.shiftY || 0)) : 0;
            if (sx || sy) cam.setViewOffset(w, h, sx, sy, w, h); else cam.clearViewOffset();
            cam.updateProjectionMatrix();
        }
        addEventListener('resize', size); size();
        env.dist = function (d) { cam.position.copy(DIR).multiplyScalar(d); ctl.target.set(0, 0, 0); ctl.update(); };
        env.add = function (p) { sc.add(p.g); list.push(p); return p; };
        env.dist(o.dist || 4);
        var last = 0, t = 0;
        (function tick(ms) {
            requestAnimationFrame(tick); var dt = Math.min(.05, (ms - last) / 1000 || 0); last = ms; t += dt;
            ctl.update(); list.forEach(function (p) { p.update(t, dt, cam, SUN); }); if (env.onFrame) env.onFrame(dt, t); r.render(sc, cam);
        })(0);
        return env;
    }

    /* ---------------- XP (once per milestone, per account) ---------------- */
    function uid() { try { var u = JSON.parse(localStorage.getItem('cosmosis_current_user')); if (!u) return 'anon'; var e = String(u.email || '').trim().toLowerCase(); return (!e || e === 'guest@cosmosis.space') ? 'guest' : e.replace(/[^a-z0-9@._-]/g, '_'); } catch (e) { return 'anon'; } }
    function done(k) { try { return !!JSON.parse(localStorage.getItem('cosmosis_earth_v1:' + uid()) || '{}')[k]; } catch (e) { return false; } }
    function award(k, xp, why) {
        try {
            var key = 'cosmosis_earth_v1:' + uid(), d = JSON.parse(localStorage.getItem(key) || '{}'); if (d[k]) return false; d[k] = 1; localStorage.setItem(key, JSON.stringify(d));
            if (window.CosmosLearn && CosmosLearn.addXP) CosmosLearn.addXP(xp, why);
            else { var xk = 'cosmosis_learn_v1:' + uid(), S = JSON.parse(localStorage.getItem(xk) || '{"xp":0}'); S.xp = (S.xp || 0) + xp; localStorage.setItem(xk, JSON.stringify(S)); }
            return true;
        } catch (e) { return false; }
    }

    /* ---------------- real world population (UN-based, rounded) ---------------- */
    var POP = {
        base: 8.16e9, t0: Date.UTC(2024, 6, 1), rate: .0088,
        now: function () { return this.base * Math.exp(this.rate * (Date.now() - this.t0) / 31557600000); },
        hist: [['10,000 BCE', '≈ 4 million'], ['Year 1', '≈ 200–300 million'], ['1804', '1 billion'], ['1927', '2 billion'], ['1974', '4 billion'], ['1999', '6 billion'], ['2022', '8 billion']],
        top: [['India', '≈ 1.45 billion'], ['China', '≈ 1.41 billion'], ['United States', '≈ 340 million'], ['Indonesia', '≈ 280 million'], ['Pakistan', '≈ 250 million'], ['Nigeria', '≈ 230 million']]
    };
    window.CosmosEarth = { P: P, POP: POP, init: init, planet: planet, award: award, done: done };
})();