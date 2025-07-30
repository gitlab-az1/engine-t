set -eux

yarn tsc --emitDeclarationOnly && \
  yarn babel src --extensions ".js,.ts" --out-dir dist --copy-files --no-copy-ignored && \
  NODE_ENV=production node ./post-build.js

cd ./dist/
npm publish --access public

cd ..
rm -rf ./dist/

cd ./tmp/test-playground/
yarn add engine-t@latest
