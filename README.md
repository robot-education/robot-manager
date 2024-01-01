# robot-manager
Code for performing automatic assembly operations in Onshape.

Based on sample code from Onshape's [app-gltf-viewer](https://github.com/onshape-public/app-gltf-viewer).

### Setup

1. Install the reccommended extensions.
2. Run `npm install`.
3. Run `npm run dev` to launch the development server.

Note the development server requires https. The server is configured to automatically use https using NextJS. 

In order to get https working properly with Onshape, it may be necessary to manually import and/or edit the trust of the cert created by the development server.

<!-- ## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default {
  // other rules...
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json', './tsconfig.node.json'],
    tsconfigRootDir: __dirname,
  },
}
```

- Replace `plugin:@typescript-eslint/recommended` to `plugin:@typescript-eslint/recommended-type-checked` or `plugin:@typescript-eslint/strict-type-checked`
- Optionally add `plugin:@typescript-eslint/stylistic-type-checked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and add `plugin:react/recommended` & `plugin:react/jsx-runtime` to the `extends` list -->
