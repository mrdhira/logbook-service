const fs = require('fs');
const path = require('path');
const expt = [];

fs.readdirSync(__dirname + '/routes')
  .map((src) => path.join(__dirname + '/routes/' + src))
  .filter((src) => fs.lstatSync(src).isDirectory())
  .map((filePath) => {
    const version = filePath.split('/').pop();
    return fs.readdirSync(filePath).forEach((file) => {
      if (file == 'home.js') {
        const fileName = file.replace('.js', '');
        const endpoints = require(`${filePath}/${file}`);
        const routes = endpoints.routes;
        expt.push(
          Object.assign({
            short: 'API',
            name: `API/${version}`,
            path: `${version}`,
          }, {
            register: (server, options) => {
              routes
                .forEach((route) => {
                  server.route(route);
                });
            },
          }, ),
        );
      } else {
        const fileName = file.replace('.js', '');
        const endpoints = require(`${filePath}/${file}`);
        const routes = endpoints.routes;
        expt.push(
          Object.assign(
            {
              short: endpoints.name,
              name: `${version}-${endpoints.name}`,
              version,
              path: `${version}/${fileName}`,
            },
            {
              register: (server, options) => {
                routes
                  .forEach((route) => {
                    server.route(route);
                  });
              },
            },
          ),
        );
      }
    });
  });

module.exports = expt;
