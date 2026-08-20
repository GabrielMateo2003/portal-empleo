# Portal de empleo

Formulario de postulación con carga de hoja de vida y base de datos SQL Server. El panel administrativo se protege con usuario y contraseña.

## Ejecutarlo en VS Code

Configura un proyecto de Supabase con las tablas del portal y un bucket privado llamado `curriculums`. Abre esta carpeta en VS Code y, en la terminal integrada de PowerShell, ejecuta:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload
```

Abre `http://127.0.0.1:8000`. Para el panel, abre `http://127.0.0.1:8000/admin`; el navegador pedirá las credenciales definidas en `.env`.

## Datos que se guardan

Edita `.env` con `DATABASE_URL`, `SUPABASE_URL` y `SUPABASE_SERVICE_ROLE_KEY` siguiendo `.env.example`. Para Vercel usa la cadena **Transaction pooler** de Supabase. Los CV se guardan en el bucket privado `curriculums`; no subas claves a GitHub.

## Aviso por correo (opcional)

El proyecto puede enviar cada postulación y el CV al correo de RR. HH. Completa `GMAIL_USER`, `GMAIL_APP_PASSWORD` y `CORREO_DESTINO` en `.env`. Gmail exige una [contraseña de aplicación](https://support.google.com/accounts/answer/185833); no uses tu contraseña normal. Si dejas esos valores vacíos, la postulación seguirá guardándose en la base de datos sin enviar correo.

## Inicio de sesión con Google y Apple

El portal ya incluye las rutas de acceso seguro. Completa las variables de `.env` con las credenciales de aplicaciones OAuth propias de la organización y reinicia el servidor:

```text
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
APPLE_CLIENT_ID=
APPLE_CLIENT_SECRET=
```

En Google Cloud crea un cliente OAuth de tipo Web y registra exactamente esta URI de redirección para pruebas locales:

```text
http://127.0.0.1:8000/autorizacion/google
```

Para Apple necesitas una cuenta Apple Developer, un Services ID y un client secret firmado. Apple no admite `localhost` ni una IP para la URL de retorno, por lo que debes publicar el sitio con HTTPS y registrar una URL como esta:

```text
https://empleo.tudominio.com/autorizacion/apple
```

Al publicar, ajusta también `COOKIE_SECURE=true` y usa una clave aleatoria larga para `SESSION_SECRET`.

Las contraseñas se guardan exclusivamente como hashes seguros. Los tokens de acceso y actualización de Google o Apple no se guardan. La tabla `usuarios` registra únicamente la identidad autorizada del proveedor, nombre, correo cuando esté disponible, fecha de creación y último acceso. Cada postulación queda vinculada mediante `usuario_id`.

## Acceso educativo local

Para usar el proyecto sin configurar Google ni Apple, la portada incluye dos opciones propias: **Cuenta educativa** y **Acceso de demostración**. La primera permite crear una cuenta local y guarda únicamente un hash seguro de la contraseña en `cuentas_educativas`; la segunda crea una sesión de prueba sin requerir datos.

## Publicarlo

Para recibir postulaciones reales desde internet necesitas un servidor HTTPS y una política de privacidad adecuada a tu país. Realiza copias de seguridad periódicas de SQL Server y de la carpeta `uploads`.
