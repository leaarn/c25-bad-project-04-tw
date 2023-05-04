# c25-bad-project-04-tw

## NPM setup
```
npm init --y

npm pkg set scripts.dev="ts-node-dev app.ts"

npm pkg set scripts.start="node index.js"

npm install express express-session ts-node typescript dotenv pg formidable winston -save-dev --save-exact prettier xlsx uuid express-validator

npm install -D @types/express-session @types/express @types/pg @types/node ts-node-dev @types/formidable @types/uuid
```
```
echo '{
    "compilerOptions": {
    "strict": true,
    "module": "commonjs",
    "target": "es5",
    "lib": ["es6", "dom"],
    "sourceMap": true,
    "allowJs": true,
    "jsx": "react",
    "esModuleInterop": true,
    "moduleResolution": "node",
    "noImplicitReturns": true,
    "noImplicitThis": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "suppressImplicitAnyIndexErrors": true,
    "noUnusedLocals": true
  },
  "exclude": ["node_modules", "build", "scripts", "index.js"]
}' > tsconfig.json
```

```
echo `
    SESSION_SECRET=
    DB_NAME=
    DB_USERNAME=
    DB_PASSWORD=
    ` > .env
```

```
echo 'node_modules .env .DS_Store' > .gitignore
```

```
echo '
    require("ts-node/register");
    require("./app.ts");
    ' > index.js
```

## Folder setup

- [ ] utils
    - [ ] logger.ts
    - [ ] hash.ts

- [ ] routers
    - [ ] personalAuthRoutes.ts
    - [ ] driverAuthRoutes.ts
    - [ ] tbc...

- [ ] db
    - [ ] any csv / xlsx file to store the data

- [ ] public 
     - [ ] assets
     - [ ] js
        - [ ] index.js
     - [ ] css
        - [ ] index.css
     - [ ] index.html
     - [ ] 404.html

## Yarn setup
```
yarn init -y
yarn add --dev jest
yarn add --dev typescript ts-jest @types/jest @types/node ts-node ts-node-dev
yarn ts-jest config:init
yarn add knex pg @types/pg
yarn knex init -x ts
yarn add --dev playwright
```

## Migration
- Create
```
yarn knex migrate:make {create any tables}
```
- Running migration
```
yarn knex migrate:latest
```
- Roll back
```
yarn knex migrate:rollback
```

## Seed
- Generate
```
yarn knex seed:make init-db
```
- Running
```
yarn knex seed:run
```

## Python setup
- Apple
```
pyenv local miniforge3
conda install -c apple tensorflow-deps
python -m pip install tensorflow-macos
python -m pip install tensorflow-metal
python -m venv .venv --system-site-packages
source .venv/bin/activate
pip install --upgrade pip
pip install ipykernel
pip install scikit-learn
```
- Windows
```
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install --upgrade pip
pip install scikit-learn
pip install --upgrade tensorflow
```