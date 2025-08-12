//Utilizar express
const express = require('express');
const conectarDB = require('../modelos/conexion.js');
const upload = require('../middlewares/uploadimage');
const verificarSesion = require('../middlewares/verificarsesion');
const verificarRol = require('../middlewares/verificarRol');
const app = express();
const path = require('path');
const bcrypt = require('bcrypt');
const session = require('express-session')

conectarDB();

app.set('views', path.join(__dirname,'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','ejs');

//Configuración del bodyparser --> Esto es para almacenar la información que escribe el usuario en los formularios dentro del servidor

const bodyparser = require('body-parser');
app.use(bodyparser.json());//Formato tipo json
app.use(bodyparser.urlencoded({extended:true}));//Formato tipo url encoded


//Archivos estáticos --> Esto es para identificar que dentro de la carpeta public están los archivos que aportan forma a las views.
app.use(express.static(path.join(__dirname,'public')));
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));


//Encender el servidor
app.listen(3000,()=>{
    console.log("Se conecto el puerto");
})

//Configuracion de session
app.use(session({
  secret: 'claveSecreta',
  resave: false,
  saveUninitialized: false
}));


//***Rutas***

//Declarar modelos
const importTransportModel = require('../modelos/transporte.js')
const Business = require('../modelos/emprendimiento.js')
const User = require('../modelos/user.js');
const Publicacion = require('../modelos/publicaciones.js');

// views/General


app.get('/index', verificarSesion, verificarRol('ciudadano', 'emprendedor'), async (req, res) => {
  try {
    const emprendimientos = await Business.find({ aprobado: true }).limit(3);
    res.render('General/index', {
      usuario: req.session.usuario,
      emprendimientos
    });
  } catch (error) {
    console.error('Error al cargar emprendimientos:', error);
    res.status(500).send('Error al cargar la página');
  }
});



app.get('/',(req,res)=>{
    res.render('General/inicioSesion', { error: null });
})

app.get('/Registro',(req,res)=>{
    res.render("General/Registro");
})

//views/Administradores

app.get('/EmprendimientosAdmin', verificarSesion, verificarRol('admin'), async (req, res) => {
  try {
    const emprendimientosPendientes = await Business.find({ aprobado: false }).populate('usuario');
    res.render("Administradores/EmprendimientosAdmin", {
      emprendimientos: emprendimientosPendientes
    });
  } catch (error) {
    console.error("Error al cargar emprendimientos pendientes:", error);
    res.render("Administradores/EmprendimientosAdmin", {
      emprendimientos: []
    });
  }
});

app.get('/OfertasAdmin', verificarSesion, verificarRol('admin'),(req,res)=>{
    res.render("Administradores/OfertasAdmin.html");
})

app.get('/panelAdmin', verificarSesion, verificarRol('admin'), (req, res) => {
  res.render('Administradores/panelAdmin.html');
});


app.get('/PublicacionesAdmin', verificarSesion, verificarRol('admin'), async (req, res) => {
  try {
    const publicacionesPendientes = await Publicacion.find({ aprobado: false }).populate('usuario');

    res.render("Administradores/PublicacionesAdmin", {
      publicaciones: publicacionesPendientes
    });
  } catch (error) {
    console.error("Error al cargar publicaciones pendientes:", error);
    res.render("Administradores/PublicacionesAdmin", {
      publicaciones: []
    });
  }
});

app.get('/ReportesAdmin', verificarSesion, verificarRol('admin'), (req,res)=>{
    res.render("Administradores/ReportesAdmin.html");
})

app.get('/transporteadmin', verificarSesion, verificarRol('admin'), async (req, res) => {
  try {
    const rutasRegistradas = await importTransportModel.find();
    res.render('Administradores/transporteadmin', { rutas: rutasRegistradas });
  } catch (error) {
    console.log("Error al cargar rutas:", error);
    res.render('Administradores/transporteadmin', { rutas: [] });
  }
});

//views/Usuarios

app.get('/RegistroPublicacion', verificarSesion, verificarRol('ciudadano','emprendedor'), async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ aprobado: true }).populate('usuario', 'nombre');

    const exito = req.query.exito === 'true';

    res.render('Usuarios/RegistroPublicacion', {
      publicaciones,
      exito
    });

  } catch (error) {
    console.error("Error al cargar publicaciones:", error);
    res.render('Usuarios/RegistroPublicacion', {
      publicaciones: [],
      exito: false
    });
  }
});

app.get('/ofertas', verificarSesion, verificarRol('ciudadano','emprendedor'),(req,res)=>{
    res.render("Usuarios/ofertas.html");
})

app.get('/perfil', async (req, res) => {
  try {
    if (!req.session.usuario || !req.session.usuario.id) {
      return res.redirect('/');
    }

    const usuario = await User.findById(req.session.usuario.id);
    if (!usuario) {
      return res.status(404).send('Usuario no encontrado');
    }

    const passwordActualizada = req.query.passwordActualizada === 'true';

    res.render('Usuarios/perfil', {
      usuario,
      passwordActualizada,
      sesion: req.session.usuario
    });
  } catch (error) {
    console.error('Error al cargar perfil:', error);
    res.status(500).send('Error interno al cargar perfil');
  }
});
app.get('/publicaciones', verificarSesion, verificarRol('ciudadano', 'emprendedor'), async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ aprobado: true }).populate('usuario', 'nombre');// Ajustá el modelo si tiene otro nombre
    res.render('Usuarios/publicaciones', {
      usuario: req.session.usuario,
      publicaciones
    });
  } catch (error) {
    console.error('Error al cargar publicaciones:', error);
    res.status(500).send('Error al cargar la página');
  }
});
app.get('/tablaPublicacionesAprobadas', verificarSesion, verificarRol('ciudadano', 'emprendedor'), async (req, res) => {
  try {
    const publicaciones = await Publicacion.find({ aprobado: true });
    res.render('Usuarios/tablaPublicacionesAprobadas', {
      usuario: req.session.usuario,
      publicaciones
    });
  } catch (error) {
    console.error('Error al cargar publicaciones aprobadas:', error);
    res.status(500).send('Error al cargar la tabla');
  }
});

app.get('/detallePublicacion/:id', verificarSesion, verificarRol('ciudadano', 'emprendedor'), async (req, res) => {
  try {
    const publicacion = await Publicacion.findById(req.params.id).populate('usuario');
    if (!publicacion || !publicacion.aprobado) {
      return res.status(404).send('Publicación no encontrada o no aprobada');
    }

    res.render('Usuarios/detallePublicacion', {
      usuario: req.session.usuario,
      publicacion
    });
  } catch (error) {
    console.error('Error al cargar detalle de la publicación:', error);
    res.status(500).send('Error al cargar el detalle');
  }
});



app.get('/transporte', verificarSesion, verificarRol('ciudadano','emprendedor'), async (req, res) => {
  try {
    const rutasRegistradas = await importTransportModel.find();
    res.render("Usuarios/transporte", { rutas: rutasRegistradas });
  } catch (error) {
    console.log("Error al cargar rutas:", error);
    res.render("Usuarios/transporte", { rutas: [] });
  }
});





//views/Emprendedores
app.get('/RegistroEmprendimiento', verificarSesion, verificarRol ('ciudadano','emprendedor'), async (req, res) => {
  try {
    const emprendimientos = await Business.find({ aprobado: true });

    // Capturar el parámetro de éxito si existe
    const exito = req.query.exito === 'true';

    // Pasar ambos datos a la vista
    res.render('Emprendedores/RegistroEmprendimiento', {
      emprendimientos,
      exito
    });

  } catch (error) {
    console.error("Error al cargar emprendimientos:", error);
    res.render('Emprendedores/RegistroEmprendimiento', {
      emprendimientos: [],
      exito: false
    });
  }
});

app.get('/tablaEmprendimientosAprobados', verificarSesion, verificarRol('ciudadano', 'emprendedor'), async (req, res) => {
  try {
    const emprendimientos = await Business.find({ aprobado: true });
    res.render('Emprendedores/tablaEmprendimientosAprobados', {
      usuario: req.session.usuario,
      emprendimientos
    });
  } catch (error) {
    console.error('Error al cargar emprendimientos aprobados:', error);
    res.status(500).send('Error al cargar la tabla');
  }
});

app.get('/detalleEmprendimiento/:id', verificarSesion, verificarRol('ciudadano', 'emprendedor'), async (req, res) => {
  try {
    const emprendimiento = await Business.findById(req.params.id).populate('usuario');

    if (!emprendimiento || !emprendimiento.aprobado) {
      return res.status(404).send('Emprendimiento no disponible');
    }

    res.render('Emprendedores/detalleEmprendimiento', {
      emprendimiento,
      usuario: req.session.usuario
    });
  } catch (error) {
    console.error('Error al cargar detalle de emprendimiento:', error);
    res.status(500).send('Error interno del servidor');
  }
});

//Cerrar sesión
app.get('/logout', (req,res)=>{
    req.session.destroy(err=>{
        if(err) {
            console.error("error al destruir sesión", err);
            return res.status(500).send('error al cerrar sesion');
        }
        //Borra la cookie
        res.clearCookie('connect.sid');
        res.redirect('/')
    })
})

//***Metodo POST***
//Transporte


app.post('/addRoutesInformation', verificarSesion, verificarRol('admin'),(req,res)=>{
    //Obtener la información que escribe el usuario
    let transportData = new importTransportModel({
        routeName: req.body.routeName,
        transportTime: req.body.transportTime,
        transportDestination: req.body.transportDestination,
        transportFrecuency: req.body.transportFrecuency,
        transportFee: req.body.transportFee,
        tripDuration: req.body.tripDuration
    })
    //Almacenar los datos
    transportData.save()
    .then(()=>{
        console.log("Ruta configurada")
    })
    .catch((err)=>{
        console.log("Error al configurar la ruta", err)
    })
    //Renderizar
    res.redirect('/transporteadmin')
})
//Ruta post para actualizar rutas
app.post('/updateRoute/:id',verificarSesion,verificarRol('admin'), async (req, res) => {
  try {
    await importTransportModel.findByIdAndUpdate(req.params.id, {
      routeName: req.body.routeName,
      transportTime: req.body.transportTime,
      transportDestination: req.body.transportDestination,
      transportFrecuency: req.body.transportFrecuency,
      transportFee: req.body.transportFee,
      tripDuration: req.body.tripDuration
    });
    console.log("Ruta actualizada:", req.params.id);
  } catch (err) {
    console.log("Error al actualizar ruta:", err);
  }
  res.redirect('/transporteadmin');
});
//Para eliminar rutas
app.post('/deleteRoute/:id',verificarSesion,verificarRol('admin'), async (req, res) => {
  try {
    await importTransportModel.findByIdAndDelete(req.params.id);
    console.log("Ruta eliminada:", req.params.id);
  } catch (err) {
    console.log("Error al eliminar ruta:", err);
  }
  res.redirect('/transporteadmin');
});

//Registro


app.post('/registroUsuario', async (req, res) => {
  try {
    const {
      usuario,
      Identification,
      nombre,
      telefono,
      Fecha,
      email,
      password,
      confirmPassword,
      rol // opcional: puede venir del formulario o asignarse por defecto
    } = req.body;

    // Validación básica
    if (!usuario || !email || !password || !confirmPassword) {
      return res.status(400).send('Faltan campos obligatorios');
    }

    if (password !== confirmPassword) {
      return res.status(400).send('Las contraseñas no coinciden');
    }

    // Verificar si el email ya existe
    const usuarioExistente = await User.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).send('El correo ya está registrado');
    }

    // Encriptar contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const fechaConvertida = new Date(Fecha); //// Convertir string a objeto Date para guardar correctamente


    // Crear nuevo usuario
    const nuevoUsuario = new User({
      usuario,
      Identification,
      nombre,
      telefono,
      Fecha: fechaConvertida,
      email,
      password: hashedPassword,
      rol: rol || 'ciudadano' // si no viene rol, se asigna ciudadano
    });

    await nuevoUsuario.save();

    // Redirigir al login o página de bienvenida
    res.redirect('/');
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    res.status(500).send('Error interno al registrar usuario');
  }
});

app.post('/LoginSite', async (req, res) => {
  const { usuario, email, password } = req.body;

  try {
    const user = await User.findOne({ 
      $or: [
        {usuario:usuario},
        {email:email}
      ]
      
    });

    if (!user) {
      return res.render('General/inicioSesion', { error: 'Email no registrado' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.render('General/inicioSesion', { error: 'Contraseña incorrecta' });
    }

    req.session.usuario = {
      id: user._id,
      nombre: user.nombre,
      rol: user.rol
    };

    switch (user.rol) {
      case 'admin':
        return res.redirect('/panelAdmin');
      case 'emprendedor':
        return res.redirect('/RegistroEmprendimiento');
      case 'ciudadano':
        return res.redirect('/index');
      default:
        return res.redirect('/');
    }

  } catch (error) {
    console.error('Error en login:', error);
    res.render('General/inicioSesion', { error: 'Error interno. Intenta más tarde.' });
  }
});




//Publicaciones

app.post('/addPublicacion', upload.single('image'), async (req, res) => {
  try {
    const {
      reportTitle,
      reportDescription,
      category,
      communityLocation
    } = req.body;

    const loginDate = new Date();
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newPublicacion = new Publicacion({
      reportTitle,
      reportDescription,
      category,
      communityLocation,
      loginDate,
      imagePath,
      aprobado: false,
      usuario: req.session.usuario.id
    });

    await newPublicacion.save();

    // Redirigir al formulario con mensaje de éxito
    res.redirect('/RegistroPublicacion?exito=true');

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar la publicación');
  }
});




// Ruta POST para registrar emprendimiento
app.post('/addBusiness', upload.single('image'), async (req, res) => {
  try {
    const {
      businessName,
      businessDescription,
      businessTelephone,
      email,
      businessLocation,
      category
    } = req.body;

    const loginDate = new Date();
    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const newBusiness = new Business({
      businessName,
      businessDescription,
      businessTelephone,
      email,
      businessLocation,
      category,
      loginDate,
      imagePath,
      aprobado:false,
      usuario: req.session.usuario.id
    });

    await newBusiness.save();


    // Redirigir al formulario con mensaje de éxito
    res.redirect('/RegistroEmprendimiento?exito=true');
  

  } catch (error) {
    console.error(error);
    res.status(500).send('Error al registrar el emprendimiento');
  }
});

//Rutas POST ADMIN

app.post('/aprobarEmprendimiento/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const emprendimiento = await Business.findById(id);
    if (!emprendimiento || emprendimiento.aprobado === true) {
      return res.status(400).send('Emprendimiento no válido o ya aprobado');
    }

    // Aprobar el emprendimiento
    emprendimiento.aprobado = true;
    await emprendimiento.save();

    // Actualizar rol del usuario asociado
    const usuario = await User.findById(emprendimiento.usuario);
    if (usuario && usuario.rol !== 'admin') {
      usuario.rol = 'emprendedor';
      await usuario.save();

      // Si el usuario está logueado, actualizar la sesión
      if (req.session.usuario && req.session.usuario.id === usuario._id.toString()) {
        req.session.usuario.rol = usuario.rol;
      }
    }

    res.redirect('/panelAdmin');
  } catch (error) {
    console.error('Error al aprobar emprendimiento:', error);
    res.status(500).send('Error interno');
  }
});



app.post('/aprobarPublicacion/:id', async (req, res) => {
  const id = req.params.id;

  try {
    const publicacion = await Publicacion.findById(id);
    if (!publicacion || publicacion.aprobado === true) {
      return res.status(400).send('Publicación no válida o ya aprobada');
    }

    // Aprobar la publicación
    publicacion.aprobado = true;
    await publicacion.save();

    res.redirect('/PublicacionesAdmin');
  } catch (error) {
    console.error('Error al aprobar publicación:', error);
    res.status(500).send('Error interno');
  }
});



app.post('/actualizarPerfil', async (req, res) => {
  try {
    const userId = req.session.usuario?.id;
    if (!userId) return res.status(401).send('Sesión no activa');

    const {
      usuario,
      identificacion,
      nombre,
      telefono,
      fechaNacimiento,
      email
    } = req.body;

    // Actualización directa, sin cambiar rol ni password
    await User.findByIdAndUpdate(userId, {
      usuario,
      Identification: identificacion,
      nombre,
      telefono,
      Fecha: new Date(fechaNacimiento),
      email
    });

    res.redirect('/perfil');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar perfil');
  }
});



app.post('/perfil/cambiar-clave', async (req, res) => {
  try {
    const userId = req.session.usuario?.id;
    if (!userId) return res.status(401).send('Sesión no activa');

    const { claveActual, claveNueva, confirmarClave } = req.body;

    if (claveNueva !== confirmarClave) {
      return res.status(400).send('Las claves no coinciden');
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).send('Usuario no encontrado');

    const match = await bcrypt.compare(claveActual, user.password);
    if (!match) return res.status(400).send('Clave actual incorrecta');

    const hashed = await bcrypt.hash(claveNueva, 10);
    user.password = hashed;
    await user.save();

    res.redirect('/perfil?passwordActualizada=true');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cambiar la clave');
  }
});


