#! /bin/bash
cd frontend
npm run build

rm -rf ../backend/src/public
mkdir -p ../backend/src/public
cp -r dist/* ../backend/src/public

echo "Complete!"