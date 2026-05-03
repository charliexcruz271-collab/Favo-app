import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

// ── AUTH ──────────────────────────────────────────────────────────────────

export function useAuth() {
  const [session, setSession] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchUsuario(session.user.id);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session && !session.user.email?.endsWith('@uniandes.edu.co')) {
        await supabase.auth.signOut();
        return;
      }
      setSession(session);
      if (session) fetchUsuario(session.user.id);
      else { setUsuario(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchUsuario = async (id) => {
    const { data } = await supabase.from('usuarios').select('*').eq('id', id).single();
    setUsuario(data);
    setLoading(false);
  };

  const enviarOtp = async (email) => {
    if (!email.endsWith('@uniandes.edu.co')) throw new Error('Solo correos @uniandes.edu.co');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { shouldCreateUser: true },
    });
    if (error) throw error;
  };

  const verificarOtp = async (email, token) => {
    const { error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'email',
    });
    if (error) throw error;
  };

  const guardarPerfil = async (perfil) => {
    if (!session?.user) throw new Error('No hay sesión activa');
    if (!perfil.nombre || !perfil.telefono || !perfil.codigo || !perfil.carrera || !perfil.tipo)
      throw new Error('Faltan campos requeridos');
    const { data: existe } = await supabase
      .from('usuarios').select('id')
      .eq('codigo', perfil.codigo)
      .neq('id', session.user.id)
      .maybeSingle();
    if (existe) throw new Error('Este código estudiantil ya está registrado');
    const { error } = await supabase.from('usuarios').upsert({
      id:       session.user.id,
      email:    session.user.email,
      nombre:   perfil.nombre,
      telefono: perfil.telefono,
      codigo:   perfil.codigo,
      carrera:  perfil.carrera,
      semestre: perfil.semestre || null,
      tipo:     perfil.tipo,
      posgrado: perfil.posgrado || null,
    }, { onConflict: 'id' });
    if (error) throw error;
    await fetchUsuario(session.user.id);
  };

  const guardarHabilidades = async (habilidades, otras) => {
    if (!session?.user) throw new Error('No hay sesión activa');
    const rows = Object.entries(habilidades).map(([categoria, detalle]) => ({
      usuario_id: session.user.id, categoria, detalle,
    }));
    if (otras) rows.push({ usuario_id: session.user.id, categoria: 'otras', detalle: otras });
    const { error } = await supabase.from('habilidades').insert(rows);
    if (error) throw error;
  };

  const cerrarSesion = () => supabase.auth.signOut();

  return { session, usuario, loading, enviarOtp, verificarOtp, guardarPerfil, guardarHabilidades, cerrarSesion };
}

// ── FAVORES ───────────────────────────────────────────────────────────────

export function useFavores() {
  const crearFavor = async ({ categoriaId, descripcion, carreraFiltro, precioOferta, horaInicio, fechaLimite, horaLimite }) => {
    const user = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase.from('favores').insert({
      cliente_id: user.id,
      categoria_id: categoriaId,
      descripcion,
      carrera_filtro: carreraFiltro || null,
      precio_oferta: precioOferta,
      hora_inicio: horaInicio,
      fecha_limite: fechaLimite,
      hora_limite: horaLimite,
    }).select().single();
    if (error) throw error;
    return data;
  };

  // Optimistic lock: only succeeds if favor is still 'pendiente' (first-write-wins)
  const aceptarFavor = async (favorId, clienteId, prestadorId, precioFinal) => {
    const { data, error } = await supabase.from('favores').update({
      prestador_id: prestadorId,
      precio_final: precioFinal,
      estado: 'aceptado',
    })
    .eq('id', favorId)
    .eq('estado', 'pendiente')
    .select();
    if (error) throw error;
    if (!data || data.length === 0) throw new Error('Este favor ya fue tomado por otro prestador');
    await supabase.from('transacciones').insert({
      favor_id: favorId,
      pagador_id: clienteId,
      receptor_id: prestadorId,
      monto_total: precioFinal,
      comision_favo: Math.round(precioFinal * 0.1),
      monto_neto: Math.round(precioFinal * 0.9),
      estado: 'retenido',
    });
  };

  const hacerContraoferta = async (favorId, monto) => {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from('negociaciones').insert({
      favor_id: favorId,
      usuario_id: user.id,
      tipo: 'contraoferta',
      monto,
    });
    if (error) throw error;
  };

  const completarFavor = async (favorId) => {
    await supabase.from('favores').update({ estado: 'completado' }).eq('id', favorId);
    await supabase.from('transacciones').update({ estado: 'liberado' }).eq('favor_id', favorId);
  };

  const misFavoresComoCliente = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from('favores')
      .select('*, categorias(*), prestador:prestador_id(nombre, rating_prom)')
      .eq('cliente_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  const misFavoresComoPrestador = async () => {
    const user = (await supabase.auth.getUser()).data.user;
    const { data, error } = await supabase
      .from('favores')
      .select('*, categorias(*), cliente:cliente_id(nombre, rating_prom)')
      .eq('prestador_id', user.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  };

  const cargarFavores = async (userId) => {
    const [{ data: dCli }, { data: dPrest }] = await Promise.all([
      supabase.from('favores').select('*, categorias(*)').eq('cliente_id', userId).order('created_at', { ascending: false }),
      supabase.from('favores').select('*, categorias(*)').eq('prestador_id', userId).order('created_at', { ascending: false }),
    ]);
    const seen = new Set();
    const todos = [...(dCli || []), ...(dPrest || [])].filter(f => {
      if (seen.has(f.id)) return false;
      seen.add(f.id); return true;
    });
    return todos.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  };

  return { crearFavor, aceptarFavor, hacerContraoferta, completarFavor, cargarFavores };
}

// ── REALTIME FAVORES ──────────────────────────────────────────────────────────

export function useRealtimeFavores() {
  // Prestador: subscribe a nuevas solicitudes Y a notificaciones de favor ya tomado
  const suscribirSolicitudes = (onNuevo, onTomado, miCarrera) => {
    const chNew = supabase
      .channel('favo-solicitudes')
      .on('broadcast', { event: 'nueva-solicitud' }, ({ payload }) => {
        const filtro = payload.carrera_filtro;
        if (filtro && miCarrera) {
          const key = filtro.split(' ')[0].toLowerCase();
          if (!miCarrera.toLowerCase().includes(key)) return;
        }
        onNuevo(payload);
      })
      .subscribe();

    const chTaken = supabase
      .channel('favo-status')
      .on('broadcast', { event: 'favor-tomado' }, ({ payload }) => {
        if (onTomado) onTomado(payload.id);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(chNew);
      supabase.removeChannel(chTaken);
    };
  };

  // Cliente: broadcast al crear un favor para notificar a todos los prestadores
  const notificarFavor = (payload) =>
    new Promise(resolve => {
      const ch = supabase.channel('favo-solicitudes');
      ch.subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        ch.send({ type: 'broadcast', event: 'nueva-solicitud', payload })
          .finally(() => { supabase.removeChannel(ch); resolve(); });
      });
    });

  // Prestador: broadcast que el favor fue tomado → otros prestadores lo quitan de su vista
  const notificarTomado = (favorId) =>
    new Promise(resolve => {
      const ch = supabase.channel('favo-status');
      ch.subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        ch.send({ type: 'broadcast', event: 'favor-tomado', payload: { id: favorId } })
          .finally(() => { supabase.removeChannel(ch); resolve(); });
      });
    });

  // Cliente: escuchar actualizaciones de estado del favor activo (postgres_changes)
  const suscribirEstado = (favorId, callback) => {
    const ch = supabase
      .channel(`favo-estado-${favorId}`)
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'favores',
        filter: `id=eq.${favorId}`,
      }, ({ new: fav }) => callback(fav))
      .subscribe();
    return () => supabase.removeChannel(ch);
  };

  // Cliente: escuchar nuevas contraofertas en la tabla negociaciones
  const suscribirContraoferta = (favorId, callback) => {
    const ch = supabase
      .channel(`nego-${favorId}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'negociaciones',
        filter: `favor_id=eq.${favorId}`,
      }, async ({ new: neg }) => {
        if (neg.tipo !== 'contraoferta') return;
        const { data } = await supabase
          .from('usuarios')
          .select('nombre, carrera, rating_prom')
          .eq('id', neg.usuario_id)
          .single();
        callback({
          id: neg.id,
          favor_id: neg.favor_id,
          prestador_id: neg.usuario_id,
          prestador_nombre: data?.nombre || 'Prestador',
          prestador_carrera: data?.carrera || '',
          prestador_rating: Number(data?.rating_prom ?? 5).toFixed(1),
          monto: neg.monto,
        });
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  };

  // Notificar resultado de contraoferta al prestador vía broadcast
  const notificarResultado = (favorId, prestadorId, tipo, precio) =>
    new Promise(resolve => {
      const ch = supabase.channel('favo-resultados');
      ch.subscribe(status => {
        if (status !== 'SUBSCRIBED') return;
        ch.send({
          type: 'broadcast',
          event: 'resultado-contraoferta',
          payload: { favor_id: favorId, prestador_id: prestadorId, tipo, precio: precio || null },
        }).finally(() => { supabase.removeChannel(ch); resolve(); });
      });
    });

  // Prestador: subscribe a resultados de sus contraofertas
  const suscribirResultados = (miPrestadorId, callback) => {
    const ch = supabase
      .channel('favo-resultados')
      .on('broadcast', { event: 'resultado-contraoferta' }, ({ payload }) => {
        if (payload.prestador_id === miPrestadorId) callback(payload);
      })
      .subscribe();
    return () => supabase.removeChannel(ch);
  };

  return { suscribirSolicitudes, notificarFavor, notificarTomado, suscribirEstado, suscribirContraoferta, notificarResultado, suscribirResultados };
}

// ── USUARIOS CERCANOS ─────────────────────────────────────────────────────

export function useUsuariosCercanos() {
  const buscarCercanos = async (categoriaId, carreraFiltro) => {
    let query = supabase
      .from('usuarios')
      .select('*, ubicaciones!inner(lat, lng, activo)')
      .in('tipo', ['prestador', 'ambos'])
      .eq('ubicaciones.activo', true);

    if (carreraFiltro) query = query.ilike('carrera', `%${carreraFiltro}%`);

    const { data, error } = await query.limit(10);
    if (error) throw error;
    return data;
  };

  const actualizarUbicacion = async (lat, lng, activo) => {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from('ubicaciones').upsert({
      usuario_id: user.id, lat, lng, activo, updated_at: new Date().toISOString(),
    });
    if (error) throw error;
  };

  return { buscarCercanos, actualizarUbicacion };
}

// ── CHAT ──────────────────────────────────────────────────────────────────

export function useChat(favorId) {
  const [mensajes, setMensajes] = useState([]);

  useEffect(() => {
    if (!favorId) return;
    supabase.from('mensajes').select('*, remitente:remitente(nombre)')
      .eq('favor_id', favorId).order('created_at')
      .then(({ data }) => setMensajes(data || []));

    const channel = supabase
      .channel(`chat-${favorId}`)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'mensajes',
        filter: `favor_id=eq.${favorId}`,
      }, (payload) => {
        setMensajes(prev => [...prev, payload.new]);
      })
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, [favorId]);

  const enviarMensaje = async (contenido) => {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from('mensajes').insert({
      favor_id: favorId, remitente: user.id, contenido,
    });
    if (error) throw error;
  };

  return { mensajes, enviarMensaje };
}

// ── CALIFICACIONES ────────────────────────────────────────────────────────

export function useCalificaciones() {
  const calificar = async ({ favorId, calificadoId, estrellas, resena }) => {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from('calificaciones').insert({
      favor_id: favorId,
      calificador_id: user.id,
      calificado_id: calificadoId,
      estrellas,
      resena,
    });
    if (error) throw error;

    const { data } = await supabase
      .from('calificaciones').select('estrellas').eq('calificado_id', calificadoId);
    const prom = data.reduce((a, b) => a + b.estrellas, 0) / data.length;
    await supabase.from('usuarios').update({ rating_prom: prom.toFixed(2) }).eq('id', calificadoId);
  };

  return { calificar };
}

// ── OBJETOS EN PRÉSTAMO ───────────────────────────────────────────────────

export function useObjetos() {
  const [objetos, setObjetos] = useState([]);

  const cargarObjetos = async () => {
    const { data, error } = await supabase
      .from('objetos').select('*, dueno:dueno_id(nombre, rating_prom)')
      .eq('disponible', true);
    if (error) throw error;
    setObjetos(data || []);
  };

  const publicarObjeto = async ({ nombre, descripcion, fotoUrl, precioDia, deposito }) => {
    const user = (await supabase.auth.getUser()).data.user;
    const { error } = await supabase.from('objetos').insert({
      dueno_id: user.id, nombre, descripcion, foto_url: fotoUrl, precio_dia: precioDia, deposito,
    });
    if (error) throw error;
    await cargarObjetos();
  };

  useEffect(() => { cargarObjetos(); }, []);

  return { objetos, publicarObjeto, cargarObjetos };
}
