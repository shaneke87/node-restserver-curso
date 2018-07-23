require('./config/config');

const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

//Habilitar la aplicacion/json
app.use(express.static(path.resolve(__dirname, '../public')));
 
// parse application/json
app.use(bodyParser.json())
//configuracion global de rutas
app.use(require('./routes/index'));

mongoose.connect(process.env.URLDB, (err, resp) => {
	if (err) throw new err;
	console.log('Base de datos Online');
});
 
app.listen(process.env.PORT, () => {
	console.log('Escuchando puerto: ', process.env.PORT);
});