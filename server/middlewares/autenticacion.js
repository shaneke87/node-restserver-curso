const jwt = require('jsonwebtoken');


//======================
//verificar token
//======================

let verificaToken = (req,res,next) => {
	let token = req.get('token');

	console.log(token);

	jwt.verify(token, process.env.SEED , (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no valido'
				}
			});
		}
		req.usuario = decoded.usuario;
		next();
	});
	
};

//======================
//verifica admin rol
//======================

let verificaAdmin_rol = (req,res,next) => {

	let usuario = req.usuario;

	if (usuario.role === 'ADMIN_ROLE') {
		next();	
	} else {
		return res.json({
		ok: false,
		err: {
			message: 'El usuario no es administrador'
		}
	  })
	}

	
}

//======================
//verificar token para imagen
//======================

let verificaTokenImg = (req,res,next) => {
	let token = req.query.token;

	jwt.verify(token, process.env.SEED , (err, decoded) => {
		if (err) {
			return res.status(401).json({
				ok: false,
				err: {
					message: 'Token no valido'
				}
			});
		}
		req.usuario = decoded.usuario;
		next();
	});
}



module.exports = {
	verificaToken,
	verificaAdmin_rol,
	verificaTokenImg
}