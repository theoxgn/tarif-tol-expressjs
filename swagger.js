const swaggerAutogen = require('swagger-autogen')();
const outputFile = './swagger_output.json';
const endpointsFiles = ['./routes/v1/index.js']; // root file dimana router dijalankan.
const doc = {
    info: {
        title: 'API Pegawai',
        description: 'Ini adalah Endpoint dari BackEnd',
    },
    host: 'localhost:3000',
    basePath: "/v1",
    schemes: ['http'],
    definitions: {
        UserRequestFormat: {
            $Name: '',
            $Phone: '',
            $Email: '',
            $Password: ''
        },
        LoginRequestFormat: {
            $identity: '',
            $password: ''
        },
        UserGetFormat: {
            
        },
    }
};
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
    require('./index.js'); // Your project's root file
})