import { useState } from 'react';
import { fmt, CATS } from '../lib/constants';

const F = "'Plus Jakarta Sans', sans-serif";
const ANTON = "'Anton', sans-serif";
const A = '#FF5A14';
const TEAL = '#00E5B8';

// ── TOAST ─────────────────────────────────────────────────────────────────
export function Toast({ msg }) {
  return (
    <div style={{
      position:'absolute',top:62,left:20,right:20,
      background:TEAL,
      borderRadius:12,padding:'12px 16px',display:'flex',alignItems:'center',gap:10,
      fontSize:12,fontWeight:700,color:'#000',zIndex:100,
      boxShadow:'3px 3px 0px rgba(0,0,0,0.4)',
      animation:'tsd .3s ease',fontFamily:F,
    }}>
      ✓ {msg}
      <style>{`@keyframes tsd{from{opacity:0;transform:translateY(-8px)}to{opacity:1;transform:none}}`}</style>
    </div>
  );
}

// ── BOTTOM NAV ────────────────────────────────────────────────────────────
export function BottomNav({ active, onChange }) {
  const tabs = [
    { id:'home',    icon:'⌂', lbl:'Inicio'   },
    { id:'explore', icon:'◎', lbl:'Explorar' },
    { id:'wallet',  icon:'◈', lbl:'Billetera'},
    { id:'notifs',  icon:'◉', lbl:'Alertas'  },
    { id:'profile', icon:'◐', lbl:'Perfil'   },
  ];
  return (
    <div style={{
      position:'absolute',bottom:0,left:0,right:0,height:86,
      background:'rgba(10,10,10,0.98)',backdropFilter:'blur(24px)',
      borderTop:'2px solid rgba(255,90,20,0.25)',
      display:'flex',alignItems:'flex-start',paddingTop:12,justifyContent:'space-around',
    }}>
      {tabs.map(t => (
        <div key={t.id} onClick={() => onChange(t.id)}
          style={{
            display:'flex',flexDirection:'column',alignItems:'center',gap:5,
            cursor:'pointer',padding:'4px 12px',borderRadius:10,
            background: active===t.id ? 'rgba(255,90,20,0.12)' : 'transparent',
            transition:'all .18s',
          }}>
          <span style={{
            fontSize:18,fontStyle:'normal',fontFamily:'monospace',
            filter: active===t.id ? `drop-shadow(0 0 6px ${A})` : 'none',
          }}>
            {t.icon}
          </span>
          <span style={{
            fontSize:9,fontWeight:700,letterSpacing:'.8px',textTransform:'uppercase',
            color: active===t.id ? A : '#666',fontFamily:F,
          }}>
            {t.lbl}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── INCOMING REQUEST (Provider side) ─────────────────────────────────────
const INCOMING_DATA = {
  user:'Laura M.',career:'Diseño Gráfico',cat:'Académico',
  desc:'Necesito que me expliquen regresión lineal para mi parcial de mañana.',
  price:25000,distance:'80m',time:'Hoy 3:00 PM → 4:30 PM',
};

export function Incoming({ selCat, setInc, showToast, setCounter }) {
  const [step, setStep] = useState('view');
  const range = selCat?.range || [10000,50000];
  const [counter, setLocalCounter] = useState(INCOMING_DATA.price);
  const pct = ((counter - range[0]) / (range[1] - range[0]) * 100).toFixed(1) + '%';

  const overlay = {
    position:'absolute',inset:0,
    background:'rgba(5,5,5,0.96)',
    backdropFilter:'blur(12px)',
    zIndex:200,display:'flex',flexDirection:'column',
    alignItems:'center',justifyContent:'center',padding:28,
    fontFamily:F,
  };

  if (step === 'counter') return (
    <div style={overlay}>
      <div style={{
        background:'#1A1A1A',border:`2px solid ${A}`,borderRadius:20,
        padding:24,width:'100%',marginBottom:20,textAlign:'center',
        boxShadow:`5px 5px 0px rgba(255,90,20,0.3)`,
      }}>
        <div style={{fontFamily:ANTON,fontSize:13,letterSpacing:2,color:'#666',textTransform:'uppercase',marginBottom:8}}>Tu contraoferta</div>
        <div style={{fontFamily:ANTON,fontSize:52,color:TEAL,lineHeight:1,marginBottom:4}}>{fmt(counter)}</div>
        <div style={{fontSize:12,color:'#666'}}>Cliente ofreció {fmt(INCOMING_DATA.price)}</div>
      </div>
      <div style={{width:'100%',marginBottom:6}}>
        <div style={{display:'flex',justifyContent:'space-between',fontSize:11,color:'#666',marginBottom:10}}>
          <span style={{fontWeight:700}}>{fmt(range[0])}</span>
          <span style={{fontWeight:700}}>{fmt(range[1])}</span>
        </div>
        <input type="range" min={range[0]} max={range[1]} step={1000} value={counter}
          style={{width:'100%',height:6,WebkitAppearance:'none',outline:'none',cursor:'pointer',borderRadius:3,
            background:`linear-gradient(to right,${A} ${pct},rgba(255,90,20,0.12) ${pct})`}}
          onChange={e => setLocalCounter(Number(e.target.value))}/>
      </div>
      <div style={{fontSize:12,color:'#666',marginBottom:24,textAlign:'center',fontWeight:600}}>Arrastra para ajustar</div>
      <div style={{display:'flex',gap:10,width:'100%'}}>
        <button onClick={() => setStep('view')}
          style={{flex:1,padding:14,background:'transparent',border:`2px solid rgba(255,90,20,0.3)`,borderRadius:14,color:'#F8F8F8',cursor:'pointer',fontSize:13,fontFamily:F,fontWeight:700,textTransform:'uppercase',letterSpacing:.5}}>
          ← Volver
        </button>
        <button onClick={() => { setCounter(counter); setInc(false); showToast(`Contraoferta de ${fmt(counter)} enviada`); }}
          style={{flex:1,padding:14,background:TEAL,border:'2px solid rgba(0,0,0,0.2)',borderRadius:14,color:'#000',cursor:'pointer',fontSize:13,fontFamily:F,fontWeight:700,textTransform:'uppercase',letterSpacing:.5,boxShadow:'3px 3px 0px rgba(0,229,184,0.3)'}}>
          Enviar
        </button>
      </div>
    </div>
  );

  return (
    <div style={overlay}>
      <div style={{
        fontFamily:ANTON,fontSize:11,letterSpacing:3,color:'#666',
        textTransform:'uppercase',marginBottom:6,
      }}>
        {INCOMING_DATA.distance} de ti
      </div>
      <div style={{fontFamily:ANTON,fontSize:26,textAlign:'center',marginBottom:20,lineHeight:1.2}}>
        NUEVA SOLICITUD <span style={{color:A}}>CERCANA</span>
      </div>

      <div style={{
        background:'#1A1A1A',border:`2px solid rgba(255,90,20,0.35)`,
        borderRadius:18,padding:18,width:'100%',marginBottom:16,
        position:'relative',overflow:'hidden',
        boxShadow:`4px 4px 0px rgba(255,90,20,0.2)`,
      }}>
        <div style={{position:'absolute',left:0,top:0,bottom:0,width:4,background:A}}/>
        <div style={{display:'flex',gap:12,marginBottom:12,paddingLeft:10}}>
          <div style={{
            width:44,height:44,borderRadius:'50%',background:A,
            border:'2px solid rgba(255,90,20,0.5)',
            display:'flex',alignItems:'center',justifyContent:'center',
            fontFamily:ANTON,fontSize:20,color:'#fff',flexShrink:0,
            boxShadow:'2px 2px 0px rgba(255,90,20,0.3)',
          }}>L</div>
          <div style={{paddingTop:4}}>
            <div style={{fontSize:14,fontWeight:700}}>{INCOMING_DATA.user}</div>
            <div style={{fontSize:12,color:'#666',marginTop:2}}>{INCOMING_DATA.career}</div>
          </div>
        </div>
        <div style={{
          display:'inline-flex',background:A,borderRadius:6,
          padding:'5px 10px',fontSize:10,fontWeight:800,
          letterSpacing:'.8px',textTransform:'uppercase',color:'#fff',marginBottom:10,
        }}>{INCOMING_DATA.cat}</div>
        <div style={{fontSize:13,color:'#AAAAAA',lineHeight:1.55,marginBottom:12}}>{INCOMING_DATA.desc}</div>
        <div style={{height:1,background:'rgba(255,90,20,0.12)',margin:'10px 0'}}/>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:6}}>
          <div style={{fontSize:12,color:'#666',fontWeight:600}}>Oferta del cliente</div>
          <div style={{fontFamily:ANTON,fontSize:20,color:A}}>{fmt(INCOMING_DATA.price)}</div>
        </div>
        <div style={{display:'flex',justifyContent:'space-between'}}>
          <div style={{fontSize:12,color:'#666',fontWeight:600}}>Horario</div>
          <div style={{fontSize:12,fontWeight:700}}>{INCOMING_DATA.time}</div>
        </div>
      </div>

      <div style={{display:'flex',gap:10,width:'100%',marginBottom:10}}>
        <button onClick={() => { setInc(false); showToast('Solicitud rechazada'); }}
          style={{flex:1,padding:14,background:'transparent',border:`2px solid rgba(255,90,20,0.3)`,borderRadius:14,color:'#F8F8F8',cursor:'pointer',fontSize:12,fontFamily:F,fontWeight:700,textTransform:'uppercase',letterSpacing:.5}}>
          Rechazar
        </button>
        <button onClick={() => { setInc(false); showToast('Solicitud aceptada'); }}
          style={{flex:1,padding:14,background:A,border:'2px solid rgba(0,0,0,0.2)',borderRadius:14,color:'#fff',cursor:'pointer',fontSize:12,fontFamily:F,fontWeight:700,textTransform:'uppercase',letterSpacing:.5,boxShadow:'3px 3px 0px rgba(255,90,20,0.35)'}}>
          Aceptar ✓
        </button>
      </div>
      <button onClick={() => setStep('counter')}
        style={{width:'100%',padding:14,background:'rgba(0,229,184,0.1)',border:`2px solid rgba(0,229,184,0.3)`,borderRadius:14,color:TEAL,cursor:'pointer',fontSize:12,fontFamily:F,fontWeight:700,textTransform:'uppercase',letterSpacing:.5}}>
        Hacer contraoferta
      </button>
    </div>
  );
}

export default { Toast, BottomNav, Incoming };
