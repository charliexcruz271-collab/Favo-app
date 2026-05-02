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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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

  // Registro paso 1: enviar OTP al correo
  const enviarOTP = async (email) => {
    if (!email.endsWith('@uniandes.edu.co')) throw new Error('Solo correos @uniandes.edu.co');
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) throw error;
  };

  // Registro paso 2: verificar OTP
  const verificarOTP = async (email, token) => {
    const { error } = await supabase.auth.verifyOtp({ email, token, type: 'email' });
    if (error) throw error;
  };

  // Registro paso 3: guardar perfil
  const guardarPerfil = async (perfil) => {
    const user = (await supabase.auth.getUser()).data.user;
    // Verificar que el código estudiantil no esté duplicado
    const { data: existe } = await supabase
      .from('usuarios').select('id').eq('codigo', perfil.codigo).single();
    if (existe) throw new Error('Este código estudiantil ya está registrado');

    const { error } = await supabase.from('usuarios').insert({
      id: user.id,
      email: user.email,
      ...perfil,
    });
    if (error) throw error;
    await fetchUsuario(user.id);
  };

  // Guardar habilidades del prestador
  const guardarHabilidades = async (habilidades, otras) => {
    const user = (await supabase.auth.getUser()).data.user;
    const rows = Object.entries(habilidades).map(([categoria, detalle]) => ({
      usuario_id: user.id, categoria, detalle,
    }));
    if (otras) rows.push({ usuario_id: user.id, categoria: 'otras', detalle: otras });
    const { error } = await supabase.from('habilidades').insert(rows);
    if (error) throw error;
  };

  const cerrarSesion = () => supabase.auth.signOut();

  return { session, usuario, loading, enviarOTP, verificarOTP, guardarPerfil, guardarHabilidades, cerrarSesion };
}

// ── FAVORES ───────────────────────────────────────────────────────────────

export function useFavores() {
  // Crear una nueva solicitud de favor
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

  // Aceptar un favor (prestador)
  const aceptarFavor = async (favorId, prestadorId, precioFinal) => {
    const { error } = await supabase.from('favores').update({
      prestador_id: prestadorId,
      precio_final: precioFinal,
      estado: 'aceptado',
    }).eq('id', favorId);
    if (error) throw error;
    // Crear transacción retenida
    await supabase.from('transacciones').insert({
      favor_id: favorId,
      pagador_id: (await supabase.auth.getUser()).data.user.id,
      receptor_id: prestadorId,
      monto_total: precioFinal,
      comision_favo: Math.round(precioFinal * 0.1), // 10% de comisión
      monto_neto: Math.round(precioFinal * 0.9),
      estado: 'retenido',
    });
  };

  // Hacer contraoferta (prestador)
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

  // Completar favor y liberar pago
  const completarFavor = async (favorId) => {
    await supabase.from('favores').update({ estado: 'completado' }).eq('id', favorId);
    await supabase.from('transacciones').update({ estado: 'liberado' }).eq('favor_id', favorId);
  };

  // Mis favores como cliente
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

  // Mis favores como prestador
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

  return { crearFavor, aceptarFavor, hacerContraoferta, completarFavor, misFavoresComoCliente, misFavoresComoPrestador };
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
    // Cargar mensajes existentes
    supabase.from('mensajes').select('*, remitente:remitente(nombre)')
      .eq('favor_id', favorId).order('created_at')
      .then(({ data }) => setMensajes(data || []));

    // Suscribirse a mensajes en tiempo real
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

    // Actualizar rating promedio del calificado
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
