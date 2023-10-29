Crear el package.json:
`npm init`

Instalación de dependencias:
`npm i express typescript nodemon ts-node @types/express @types/node mysql2 reflect-metadata typeorm bcrypt @types/bcrypt jsonwebtoken @types/jsonwebtoken`

Crear el tsconfig.json
`tsc --init`

Scripts:
    "dev": "nodemon ./src/index.ts",
    "build": "tsc",
    "start": "node ./build/index.js"

Poner los scripts a funcionar:
`npm run dev` => activa el servidor en tiempo real
`npm run build` => compila
`npm run start` => pone en marcha el servidor en producción

Crear una migración:
`npx typeorm migration:create ./src/migration/create-#nombretabla-table`

Crear la tabla en mySQL a partir de la migración:
`npx typeorm-ts-node-commonjs migration:run -d ./src/db.ts`

Borrar la tabla desde typescript:
`npx typeorm-ts-node-commonjs migration:revert -d ./src/db.ts`

Crear los models:
`npx typeorm entity:create ./src/models/#nombredelatabla`

Migraciones (tener en cuenta):
`isNullable: false`
`isUnique: true`
`default: "CURRENT_TIMESTAMP"`






