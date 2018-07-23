const express = require('express');
const _ = require('underscore');

const {verificaToken} = require('../middlewares/autenticacion');

let app = express();
let Producto = require('../models/producto');


//========================
//Obtener productos
//========================
app.get('/producto',verificaToken, (req, res) => {
	//trae todos los productos
	//populate: usuario categoria
	//paguinado

  let desde = req.query.desde || 0;
  desde = Number(desde);

  let limite = req.query.limite || 5;

  limite = Number(limite);

  Producto.find({disponible: true}, 'nombre precioUni descripcion disponible categoria usuario')
  		 .skip(desde)
  		 .limit(limite)
  		 .populate('usuario')
  		 .populate('categoria', 'nombre')
  		 .exec((err, usuarios) => {
  		 if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		Producto.count({disponible: true}, (err, conteo) => {
				res.json({
				ok: true,
				usuarios,
				cuantos: conteo
			});
		});
		
  	 })
});


//========================
//Obtener un producto por ID
//========================
app.get('/producto/:id', verificaToken,(req, res) => {
	//populate: usuario categoria
	let id = req.params.id;

	Producto.findById(id, (err, productoDB) => {
		 if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}
		if (!productoDB) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El ID no es correcto'
				}
			});
		}
		res.json({
			ok: true,
			Producto: productoDB
		})
	})
	.populate('usuario')
	.populate('categoria')
	
	
});

//========================
//Buscar un producto
//========================
app.get('/producto/buscar/:termino',verificaToken,(req, res) => {
	let termino = req.params.termino;
	let regex = new RegExp(termino, 'i');
	Producto.find({nombre: regex})
	.populate('categoria', 'nombre')
	.exec((err, productos) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}
		res.json({
			ok: true,
			productos
		})
	})
})

//========================
//Crear un producto
//========================
app.post('/producto/',verificaToken, (req, res) => {
	//grabar usuario
	//grabar categoria del listado
	let body = req.body;

	let producto = new Producto({
		nombre: body.nombre,
		precioUni: body.precioUni,
		descripcion: body.descripcion,
		categoria: body.categoria,
		usuario: req.usuario._id
	});

	producto.save((err, productoDB) => {
		if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}
			//usuarioDB.password = null;

			res.status(201).json({
			ok: true,
			producto: productoDB
		});
	});
});

//========================
//Actualizar un producto
//========================
app.put('/producto/:id',verificaToken, (req, res) => {
	let id = req.params.id;
	let body = _.pick(req.body,['nombre','precioUni', 'descripcion', 'categoria', 'disponible']);

	Producto.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, productoDB) => {

		if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
  			ok: true,
  			producto: productoDB
  		});
	})
	.populate('categoria')
	.populate('usuario')
	
});

//========================
//Borrar un producto
//========================
app.delete('/producto/:id',verificaToken, (req, res) => {
	 let id = req.params.id;
  let cambiarDisponible = {disponible: false};

  Producto.findByIdAndUpdate(id, cambiarDisponible, {new: true}, (err, productoBorrado) => {
  	if (err) {
			return res.status(400).json({
				ok: false,
				err
			});
		};
	if (productoBorrado === null) {
		return res.status(400).json({
			ok: false,
			err: {
				message: 'Producto no encontrado'
			}
		});
	}
	res.json({
		ok: true,
		Producto: productoBorrado
	})
  })
});

module.exports = app;