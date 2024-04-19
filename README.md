This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Prueba técnica de Disruptive Studio

Para está prueba yo tuve que implementar el siguiente STACK:

- Next.JS 14
- Typescript
- MongoDB
- Tailwind
- Websockets, ws

El Back, esta implementado en el API Route del mismo Next con la siguiente estructura:

- user: ruta de la API para administrar usuarios
    - new
    - get
    - exists
    - recovery

- library: ruta de la API para el CRUD de las categorias
    - new
    - get
    - delete
    - update
    - category: ruta de la API para el CRUP del contenido para el usuario
        - new
        - get
        - delete
        - update

El Front, fue diseñado a partir de componentes con clases de estilo proporcionadas con TailwindCSS

- Se creo un Card para el sistema de logueo y se reutiliza para la creación de cuentas 
- En la sección inferior y a continuación del card para logueo estan los componentes para mostrar las categorías de la biblioteca
- En el card de presentación de cada categoría se tiene la imagen de portada, nombre, descripcion, botones para ver, editar y eliminar, por último está la parte del conteo de contenido Videos, Imagenes, Textos

La base de datos, en MongoDB esta estructurada de la siquiente forma, Database y Collection:

- library: base de datos central para el manejo de usuarios y CRUD de categorias
    - users: userName: string, email: string, password: string, isReader: boolean, isCreator: boolean, isAdmin: boolean
    - category: cover: base64, name: string, description: string, allowData: [number, number, number], allowUsers: number

- category: base de datos para el contenido generado por el usuario
    - [library.category.name]: userName: string, video?: string, image?: base64, plainText?: string

