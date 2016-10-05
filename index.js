'use strict';

const Hapi = require('hapi');
const Good = require('good');

const server = new Hapi.Server();
server.connection({ port: 3000 });

server.route({
    method: 'GET',
    path: '/',
    handler: function (request, reply) {
      reply.view('main');
    }
});

server.route({
    method: 'GET',
    path: '/{day}',
    handler: function (request, reply) {
      reply.view(request.params.day + '/index');
    }
});

server.register([
  {
    register: Good,
    options: {
        reporters: {
            console: [{
                module: 'good-squeeze',
                name: 'Squeeze',
                args: [{
                    response: '*',
                    log: '*'
                }]
            }, {
                module: 'good-console'
            }, 'stdout']
        }
    }
  },
  require('vision'),
  require('inert')
], (err) => {

    if (err) {
        throw err; // something bad happened loading the plugin
    }

    server.views({
        engines: {
            html: require('handlebars')
        },
        relativeTo: __dirname,
        path: 'days',
        layoutPath: 'days',
        partialsPath: 'days'
    });

    server.route({
        method: 'GET',
        path: '/static/{param*}',
        handler: {
            directory: {
                path: 'days'
            }
        }
    });

    server.start((err) => {
        if (err) {
            throw err;
        }
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
