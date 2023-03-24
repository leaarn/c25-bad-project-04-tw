# -c25-wsp-project-02-tw

## NPM setup

- [ ] npm init --y

- [ ] npm pkg set scripts.dev="ts-node-dev app.ts"

- [ ] npm pkg set scripts.start="node index.js"

- [ ] npm install express express-session ts-node typescript dotenv pg formidable winston -save-dev --save-exact prettier

- [ ] npm install -D @types/express-session @types/express @types/pg @types/node ts-node-dev @types/formidable

- [ ] echo '{
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

- [ ] echo `
    SESSION_SECRET=
    DB_NAME=
    DB_USERNAME=
    DB_PASSWORD=
    ` > .env

- [ ] echo 'node_modules .env .DS_Store' > .gitignore

- [ ] echo '
    require("ts-node/register");
    require("./app.ts");
    ' > index.js

    ()