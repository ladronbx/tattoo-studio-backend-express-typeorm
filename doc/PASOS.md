# PASO A PASO PARA INICIAR UN PROYECTO CON Node.js UTILIZANDO Express, TypeScript, TypeORM y MySQL

```tsx
**PERMISOS MAC  → sudo chown -R bienve /Users/bienve/Desktop/nombre_de_tu_ruta/**
```

### 1. **Comando `npm init`:**

- Inicia el proceso de creación de un nuevo proyecto de **Node.js** y genera un archivo "**`package.json`**".
- El archivo "`**package.json**`" es un archivo de configuración fundamental en un proyecto de Node.js. **Contiene información sobre el proyecto, sus dependencias, comandos personalizados y otras configuraciones importantes**.

---

### 2. **Comando `npm i`:**

- **Instala las dependencias necesarias**. NPM buscará el archivo package.json en el directorio actual y luego instalará todas las dependencias.

---

### **3. Comando `npm install express typescript nodemon ts-node @types/express @types/node typeorm reflect-metadata mysql2`:

- **Este comando instalará todos estos paquetes** y sus dependencias en el proyecto actual, permitiéndote desarrollar una aplicación Node.js que utiliza Express, TypeScript, TypeORM y MySQL.

---

### **4. Crear archivo "`.gitignore`" y escribir en el interior `/node_modules`:**

El propósito de este archivo es especificar a **Git** qué archivos y directorios debe **omitir** al realizar seguimiento y control de versiones. En este caso, "`/node_modules`" se refiere al directorio donde se instalan las dependencias de **Node.js**.

---

### **5. Crear carpeta "`./src`" y en el interior archivo "`index.ts`" en la raíz del proyecto y agregar lo siguiente:**

```tsx

typescript
import express from "express";

const app = express();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running ${PORT}`);
});
```

- En primer lugar, se importa el módulo "**express**" que se instaló previamente a través de **NPM**.
- `**const app = express();**`: Esta línea crea una instancia de la aplicación Express y la almacena en la constante "`app`".
La instancia de la aplicación es esencial para configurar rutas, manejar solicitudes HTTP y definir el comportamiento de la aplicación.
- `**app.listen(4000, () => { console.log('Server running'); })**`: Esta parte del código inicia el servidor Express y lo hace escuchar en el puerto 4000.
Cuando el servidor comienza a escuchar, se ejecuta la función de devolución de llamada que imprime "Server running" en la consola.
Esto indica que el servidor Express se ha iniciado y está listo para recibir solicitudes.

---

### 6. Comando `tsc --init`:

- Crea automáticamente el archivo "`tsconfig.json`".

---

### 7. En el archivo tsconfig.json:

- Descomentar línea 17, 18 y 58: "`experimentalDecorators": true,` / "`emitDecoratorMetadata": true,` /`"outDir": "./`",
- Cambiar la ruta de "`outDir": "./build`",

---

### 8. En el archivo "`package.json`" estos script quedan así:

```json
"scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "dev": "nodemon ./src/index.ts",
    "build": "tsc",
    "start": "node ./build/index.js"
}
```

---

### 9. Comando `nodemon ./src/index.ts`: => "dev":

- Este comando arranca el servidor en tiempo real, por lo que el estado del mismo se actualiza cada vez que realizamos un cambio en el código.

---

### 10. Comando `tsc` con el archivo "`tsconfig.ts`" cerrado: => `"build"`:

- El comando tsc transpila el archivo "`tsconfig.ts`" y al compilar creará la carpeta "`build`" y en su interior "`index.js`".

---

### 11. Comando `node ./build/index.js` => "start":

- Comprueba que el servidor web Express arranca en producción.
- Se cierra con `**Ctrl + C**`.

---

### 12. Comando `npm run dev`:

- La aplicación se ejecutará y estará en modo de desarrollo, lo que significa que cualquier cambio que realices en el código se reflejará automáticamente sin necesidad de reiniciar el servidor manualmente.

> Hasta aquí, has configurado inicialmente un proyecto con Node.js utilizando Express, TypeScript, TypeORM y MySQL. "Server running".
> 

> A continuación, separaremos las rutas y los controladores. Las rutas definen las ubicaciones y los verbos HTTP esperados, mientras que los controladores implementan la lógica para manejar las solicitudes en esas rutas. Esta separación de responsabilidades facilita la organización y el mantenimiento de aplicaciones web.
> 

---

# DERIVAR RESPONSABILIDAD DE RUTAS A OTRO ARCHIVO

### 13. Crear un archivo llamado "routesUsers.ts" en ./src:

- Primero importaremos de express `**Router**`, y este método lo almacenaremos en la constante `**router**`.
- Después definiremos las rutas para las operaciones **GET**, **POST**, **PUT** y **DELETE** en usuarios.

```tsx
import { Router } from "express";

const router = Router();

router.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    return res.send('GET USERS' + userId);
});

router.post('/users/:id', (req, res) => {
    const userId = req.params.id;
    return res.send('CREATE USERS' + userId);
});

router.put('/users/:id', (req, res) => {
    const userId = req.params.id;
    return res.send('UPDATE USERS' + userId);
});

router.delete('/users/:id', (req, res) => {
    const userId = req.params.id;
    return res.send('DELETE USERS' + userId);
});

export { router };

```

---

### 14. Derivar responsabilidad de las rutas. Modificar archivo "`index.ts`" agregando `import { router } from "./routes/routesUsers";`
y `app.use('/users', router);`

- Quedando de la siguiente forma:

```tsx
import express from "express";
import { router } from "../src/routes/routesUsers";

const app = express();

const PORT = process.env.PORT || 4000;

app.use('/users', router);

app.listen(PORT, () => {
console.log(`Server running on ${PORT}`);
});
```

- Importaremos el enrutador `router` que definimos en "`routesUsers.ts`" para usarlo en "`index.ts`".
- ¿Por qué importamos routes? Esto permite que las rutas relacionadas con los usuarios estén bajo el prefijo `'/users'`.

---

# CREAR Y DERIVAR RESPONSABILIDAD DE CONTROLADORES A OTRO ARCHIVO

> ¿Por qué separar los controladores? La separación de controladores en archivos separados permite que la lógica de manejo de las solicitudes esté organizada de manera clara y se pueda reutilizar en múltiples rutas. Esto mejora la modularidad y facilita el mantenimiento de tu aplicación. Aligera la responsabilidad de las rutas.
> 

### 15. Crear carpeta en ./src "controllers" y archivo "controllersUsers.ts". En este archivo importar Request y Response de express.

```tsx
import { Request, Response } from "express";

const getUsers = (req: Request, res: Response) => {
    const userId = req.params.id;
    return res.send('GET USERS' + userId);
};

const createUsers = (req: Request, res: Response) => {
    const userId = req.params.id;
    return res.send('CREATE USERS' + userId);
};

const updateUsers = (req: Request, res: Response) => {
    const userId = req.params.id;
    return res.send('UPDATE USERS' + userId);
};

const deleteUsers = (req: Request, res: Response) => {
    const userId = req.params.id;
    return res.send('DELETE USERS' + userId);
};

export { getUsers, createUsers, updateUsers, deleteUsers };

```

---

### 16. En "`index.ts`" agregamos el *middleware* `app.use(express.json())`, si queremos introducir información de entrada (req) por el body, debemos recordar que llegará almacenada en forma de cadena, para volver a objeto en formato JSON necesitamos un middleware.

```tsx
import express from "express";
import { router } from "../src/routes/routesUsers";

const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use('/users', router);
app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});

```

---

### 17. Usaremos el Thunder de VSC o Postman para ejecutar los endpoints.

- Damos click a new request para poder almacenar los endpoints una vez comprobados.
- Seleccionamos el tipo de endpoint (GET, PUT, POST, DELETE).
- Escribimos la URL relativa (localhost:4000/users).
- Utilizamos send para comprobar lo que nos devuelve.
- Si está correcto, creamos una colección y los almacenamos. Para ello, hacemos click en los tres puntos que aparecen en la actividad al poner el ratón sobre ellas y damos click en "Save to Collection".
- Asignaremos un nombre a esta nueva colección y le damos submit.

---

### 18. Creación de los endpoints (protocolos HTTP) dinámicos.

- En la URL añadimos `/:id`, que hace referencia a la ID que introduzcamos en el endpoint.
- Almacenamos dicha ID en `const favoritesId = req.params.id`.
- Devolvemos el valor de la ID y lo concatenamos.
1. Exportamos los endpoints del Thunder/Postman a una carpeta llamada "http" que está contenida en src.

---

### 19. Exportamos los endpoint del thunder/postman a una carpeta llamada "http" que esta contenida en src.

---

### 20. Creamos la base de datos con la que vamos a trabajar en MySQL.

---

### 21. Creamos el archivo `db.ts` y en este pegamos el siguiente bloque de código:

```tsx
import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "test",
    migrations: [],
    entities: [],
    synchronize: false,
    logging: false,
});

```

---

### 22. Modificamos las credenciales ya que estas nos sirven para apuntar hacia la base de datos a la que nos queremos conectar (host, port, username, password, database).

- Recordar que "database" hace referencia al nombre de la base de datos que hemos creado previamente en MySQL.

---

### 23. Nos conectaremos a la base de datos introduciendo en el `index.ts` lo siguiente:

```tsx
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
    })
    .catch(error => {
        console.log(error);
    });

```

---

### 24. Ahora introduciremos el arranque del servidor dentro del `initialize`, de forma que se vuelva asíncrono, quedaría de la siguiente forma:

```tsx
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected');
        // Encendido del servidor
        app.listen(PORT, () => {
            console.log(`Server running on ${PORT}`);
        });
    })
    .catch(error => {
        console.log(error);
    });

```

---

### 25. Realizaremos una migración para poder crear una tabla con el siguiente comando: `npx typeorm migration:create ./src/migration/usersMigrations`

- **"usersMigrations"** es el nombre que yo quiera darle al archivo que se crea en formato TypeScript.

---

### 26. Este archivo se ha creado con el siguiente esqueleto:

```tsx
import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CarsMigration1697973635912 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }
}

```

---

### 27. Tenemos que dejarlo de la siguiente forma:

```tsx
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: "increment",
                    },
                    {
                        name: "username",
                        type: "varchar",
                        length: "50"
                    },
                    {
                        name: "email",
                        type: "varchar",
                        length: "100"
                    },
                    {
                        name: "password",
                        type: "varchar",
                        length: "200"
                    },
                    {
                        name: "is_active",
                        type: "boolean",
                        default: true
                    },
                    {
                        name: "role",
                        type: "enum",
                        enum: ["user", "admin", "super_admin"],
                        default: "user"
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",                        
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                        onUpdate: "CURRENT_TIMESTAMP"                 
                    },
                ],
            }),
            true
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
}

```

---

### 28. Ahora que ya tenemos el archivo de la migración como toca, tenemos que introducir el nombre de su Class en el archivo db.ts, concretamente dentro del array migrations → `**migrations: [CarsMigration1697973635912],**`

---

### 29. Como ya tenemos la estructura de la tabla, mediante el siguiente comando, la creamos en la base de datos (ya es visible en el mySQL) → `npx typeorm-ts-node-commonjs migration:run -d ./src/db.ts`

---

### 30. Si queremos eliminar la tabla aprovechando lo que tenemos en el down, introduciremos el siguiente comando →`npx typeorm-ts-node-commonjs migration:revert -d ./src/db.ts`

---

### 31. Si finalmente todo esta correcto, crearemos nuestro model con el comando → npx typeorm entity:create ./src/models/#nombredelatabla

* Recordar que el nombre del archivo es el mismo que el de su class, por lo que la primera letra sera en mayúscula.

---

### 32. Sus funciones serán, por una lado, establecer una relación directa entre el nombre de nuestra tabla, y la clase con la que trabajaremos en typescript (que a su vez heredara los métodos del typeorm), y por otro, le asignaremos a las columnas sus características tales como el tipo de dato o su desempeño como primary key o columna, sin más.

- Ejemplo:

```tsx
import { Entity, PrimaryGeneratedColumn, Column, BaseEntity} from "typeorm"

@Entity("users")
class Users extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column()
    age!: number;
}

export {Users}
```

---

### 33. Introduciremos el nombre de la class en su array de db.ts →  `entities: [Users],`

---

### 34. Ha llegado el momento de implementar la lógica de los controladores, haciendo uso de:

- los parámetros introducidos por la ruta.
- el body introducido en el endpoint.
- los métodos heredados en la class.

Para ello, recordar que `req` es la entrada y `res` es la salida.

- Ejemplo:

```tsx
import { Request, Response } from "express";
import { Cars } from "../models/Cars";

const getCars = async (req: Request, res: Response) => {

    try {
        const getAllCars = await Cars.find();
        return res.json(getAllCars);
    } catch (error) {
        return res.json(error);
    }
}

const createCars = async (req: Request, res: Response) => {

    try {
        const CarBody = req.body;
        await Cars.create({
            model: CarBody.model,
            kilometers: CarBody.kilometers,
            userId: CarBody.userId
        }).save();
        return res.json(`El coche con modelo ${CarBody.model} ha sido creado con éxito`);
    } catch (error) {
        return res.json(error);
    }
}

const updateCars = async (req: Request, res: Response) => {
    const updateById = parseInt(req.params.id);
    const updateByBody = req.body;
    const updateCar = await Cars.update({
        id: updateById
    }, {
        model: updateByBody.model,
        kilometers: updateByBody.kilometers
    });

    return res.json(`El coche con modelo ${updateByBody.model} ha sido actualizado con éxito`);
}

const deleteCars = async (req: Request, res: Response) => {

    const deleteCarId = parseInt(req.params.id);
    await Cars.delete({
        id: deleteCarId
    });
    return res.json(`El coche con id ${deleteCarId} ha sido borrado con éxito`);
}

export { getCars, createCars, updateCars, deleteCars };

```

---

### 35. Verificaremos el correcto funcionamiento de la lógica mediante los endpoints almacenados previamente, introduciéndoles datos por el body o el params, según necesidad.

---

# Relaciones entre tablas

### 36. Ahora, siguiendo toda la lógica anterior, podemos crear una nueva tabla y teniendo en cuenta las relaciones entre ellas, introducirles foreign keys, ya sea para un 1:n, un 1:1 (usando UNIQUE), o n:n, en cuyo caso tendremos que crear una tabla intermedia.

---

### 37. ****Introducir una Clave Externa (Foreign Key):****

Para introducir una foreign key a una tabla, una relación entre dos tablas, debes introducir una clave externa (foreign key) en una de las tablas que se referirá a la clave primaria de la otra tabla. La clave externa conecta registros en una tabla con registros en otra, lo que permite que los datos se relacionen de manera significativa.

En la migración de TypeORM, puedes agregar una clave externa de la siguiente manera.

Tendremos que ir a su archivo de migración y, en la parte inferior de las columnas, insertar el siguiente código:

```tsx
foreignKeys: [
    {
        columnNames: ["userId"],                // Nombre de la columna que será una clave externa.
        referencedTableName: "users",           // Nombre de la tabla a la que se hace referencia.
        referencedColumnNames: ["id"],          // Nombre de la columna de la tabla de referencia.
        onDelete: "CASCADE",                    // Opción para el comportamiento en caso de eliminación.
    }
],

```

Con esto, lo que le decimos es que la columna `userId` es una foreign key, por lo tanto, previamente tendremos que crear dicha columna.

- `columnNames: ["userId"]`: es el nombre de la columna que queremos transformar en foreign key.
- `referencedTableName`: es el nombre de la tabla fuerte.
- `referencedColumnNames`: es el nombre de la columna de la tabla fuerte.
- `onDelete: "CASCADE"`: provoca un comportamiento en cascada de la tabla fuerte a la débil, de forma que si eliminamos un registro que influya en la débil, se borrarán ambos.

---

### 38. ****Actualización del Modelo con la Nueva Columna****

Como hemos creado una nueva columna para hacer la foreign key, debemos ir al archivo introducido en models y agregarle esa nueva columna, dándole los atributos pertinentes, por ejemplo:

```tsx
@Column()
userId!: number
```

---

### **39. Eliminar las Tablas**

Dado que has realizado cambios en la estructura de la base de datos, debes revertir las migraciones existentes para eliminar las tablas actuales y luego recrearlas con las modificaciones.

```tsx
sudo npx typeorm-ts-node-commonjs migration:revert -d ./src/db.ts
```

---

### 40. **Crear las Tablas con las Modificaciones**

Nuevamente creamos las tablas, con sus modificaciones actuales con el comando → `npx typeorm-ts-node-commonjs migration:run -d ./src/db.ts`

---

### 41. ****Verificar las Relaciones en MySQL****

Desde MySQL, haciendo una ingeniería inversa, comprobamos que la relación entre las tablas sea la correcta.

---

### 42. ****Comprobar la Relación Utilizando "CASCADE"****

Para comprobar que la relación funciona según lo previsto, puedes crear registros desde los endpoints de tu aplicación que estén relacionados a través de la clave externa (**`userId`**). Luego, intenta eliminar un registro en la tabla de referencia (**`users`** en este caso). Si la opción "CASCADE" está configurada correctamente, deberías observar que los registros relacionados en tu tabla actual también se eliminan automáticamente.