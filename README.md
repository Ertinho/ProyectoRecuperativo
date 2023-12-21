# ProyectoRecuperativo


## IMPORTANTE
Debe tener previamente instalado composer y PHP >= 8.1.12 v para evitar futuros errores u problemas, una vez haya clonado el proyecto.


Una vez clonado el repositorio, crear una base de datos en mysql.
En la raíz del proyecto de Back-End ejecutar los siguientes comandos.

```bash
cd backend
```




## Instalación
Abrir el proyecto en el Visual Studio Code o su editor favorito. Abre una nueva consola.
Ejecuta el siguiente comando para poder instalar composer en el proyecto.
```bash
composer install
```
Debemos copiar el archivo .env para poder establecer la conexión con nuestra base de datos.
```bash
copy .env.example .env
```
Este comando establecerá la APP_KEY en nuestro archivo .env
```bash
php artisan key:generate
php artisan jwt:secret
```


Cambiamos los siguientes parámetros en el .env con las variables de entorno de la base de datos:
```bash
DB_PORT = Depende del puerto asignado por usted en la configuración de su base de datos(default: 3306)
DB_DATABASE = Aquí va el nombre de la base de datos creada en nuestro administrador de base de datos preferido.
DB_USERNAME = root
DB_PASSWORD = Es la contraseña que nosotros asignamos en la instalación, en caso de utilizar Xampp, Laragon, etc... Este campo se debe dejar vacío.
```

Este comando ejecutará las migraciones del proyecto y una vez creada las tablas en la base de datos, dará paso a ejecutar los seeders que forman parte del estado predeterminado del sistema.
```bash
php artisan migrate --seed
```

En caso de que no funcione la migración, actualiza el archivo .env con los siguientes comandos.
```bash
php artisan cache:clear
php artisan route:clear
php artisan view:clear
```
Ahora procederemos a ejecutar el Sistema Web con los siguientes comandos:
```bash
php artisan serve --host=0.0.0.0
```










# Frontend

>**Nota**: Asegúrate de que completaste la guía de instalación [React Native - Environment Setup](https://reactnative.dev/docs/environment-setup) hasta el apartado "Creating a new application", antes de proceder.

## Paso 1: Instalando  Node

En la raíz del proyecto del Front-End abre una nueva terminal y ejecuta los siguientes comandos. 

```bash
cd frontend
```

```bash
# using npm
npm install
```

## Paso 2: Inicia la aplicación 

Ejecuta los siguientes comandos para empezar tu aplicación _Android_ ó _iOS_ :

### Android

```bash
# using npm
npx react-native start
npx react-native run-android
```
### iOS

```bash
# using npm
npm run ios
```
```bash
# OR using Yarn
yarn ios
```


Verificar ip pública con ipconfig en cmd.
Cambiar ip pública en index.js de la carpeta de helpers.

Si todo esta _bien_ configurado, deberías ver tu aplicación ejecutándose en tu  _emulador android_ ó _emulador iOS_ .

También puedes ejecutar tu aplicación en un dispositivo físico siguiendo las instrucciones en su respectiva documentación. (https://reactnative.dev/docs/running-on-device)



