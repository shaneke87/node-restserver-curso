

//=============
//puerto
//=============
process.env.PORT = process.env.PORT || 3000;

//===================
// ENTORNO
//===================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//===================
// Base de Datos
//===================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
	urlDB = 'mongodb://localhost:27017/cafe';
}
else {
	urlDB = 'mongodb://cafe-user:Admin1234@ds241875.mlab.com:41875/cafe-node';
}

process.env.URLDB = urlDB;

