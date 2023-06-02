#! /bin/bash
cd frontend
npm run build

rm -rf ../backend/dist/public
mkdir -p ../backend/dist/public/
cp -r build/* ../backend/dist/public

# mv ../backend/public/index.html ../backend/public/application/

echo "Complete!"