# robot-manager
Code for performing automatic assembly operations in Onshape.

Based on sample code from Onshape"s app-gltf-viewer.

### Setup

1. Install the reccommended extensions.
2. Run `npm install`.
3. Run `npm run dev` to launch the development server.

Note the development server requires https. The server is configured to automatically use https using NextJS. 

In order to get https working properly with Onshape, it may be necessary to manually import and/or edit the trust of the cert created by the development server.