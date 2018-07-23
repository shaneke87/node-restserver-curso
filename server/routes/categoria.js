const express = require('express');

const { verificaToken, verificaAdmin_rol } = require('../middlewares/autenticacion');

let app = express();

let Categoria = require('../models/categoria');

//===========================
//Mostrar todas la categorias
//===========================
app.get('/categoria', verificaToken, (req, res) => {
	Categoria.find({})
			 .sort('descripcion')
			 .populate('usuario', 'nombre email')
			 .exec((err, categorias) => {
			 	 if (err) {
					return res.status(500).json({
						ok: false,
						err
					});
				}
				res.json({
					ok: true,
					categorias
				});
			 })
  
});

//===========================
//Mostrar una catagoria por id
//===========================
app.get('/categoria/:id', verificaToken, (req, res) => {

	let id = req.params.id;

	//Categoria.findById();
	Categoria.findById(id, (err, categoriaBD) => {
		 if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}
		if (!categoriaBD) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'El ID no es correcto'
				}
			});
		}
		res.json({
			ok: true,
			Categoria: categoriaBD
		})
	})
	
	
});

//===========================
//Crear nueva categoria
//===========================
app.post('/categoria', verificaToken, (req, res) => {
	//regresa la nueva categoria
	// req.usuario._id

	let body = req.body;
	let categoria = new Categoria({
		descripcion: body.descripcion,
		usuario: req.usuario._id
	});

	categoria.save((err, categoriaBD) => {

		 if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		 if (!categoriaBD) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			Categoria: categoriaBD
		});
	});
});

//===========================
//Actualiza la categoria
//===========================
app.put('/categoria/:id', verificaToken, (req, res) => {
	let id = req.params.id;
	let body = req.body;

	let descCategoria = {
		descripcion: body.descripcion
	}

	Categoria.findByIdAndUpdate(id, descCategoria, {new: true, runValidators: true}, (err, categoriaBD) =>{
		 if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		 if (!categoriaBD) {
			return res.status(400).json({
				ok: false,
				err
			});
		}

		res.json({
			ok: true,
			Categoria: categoriaBD
		});
	});

});

//===========================
//Elimina una categoria
//===========================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_rol], (req, res) => {
	//Solo un adminidtrador puede borrar categorias
	//Categoria.findByIdAndRemove

	let id = req.params.id;
	Categoria.findByIdAndRemove(id, (err, categoriaBD) => {
		 if (err) {
			return res.status(500).json({
				ok: false,
				err
			});
		}

		 if (!categoriaBD) {
			return res.status(400).json({
				ok: false,
				err: {
					message: 'el Id no existe'
				}
			});
		}
		res.json({
			ok: true,
			message: 'Categoria borrada'
		})
	});

});




module.exports = app;