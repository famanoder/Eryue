import jwt from 'jsonwebtoken';
import config from '../conf';

async function JWT(cx,next){
	let {support,secret,expire} = config.JWT;
	if (support) {
		cx.jwt={
			sign(data,opts){
				let token = null;
				try {
					token = jwt.sign(data,secret,Object.assign({
						expiresIn:expire
					},opts));
				} catch(e) {
					console.log(e);
					return cx.response.body={
						success:false,
						result:e.message
					}
				}
				return token;
			},
			verify(token){
				let decode = null;
				try{
					let token = cx.request.query.auth||cx.request.body.auth||cx.headers['auth']||token;
					decode = jwt.verify(token,secret);
				}catch(e){
					console.log(e);
					return cx.response.body={
						success:false,
						result:e.message
					}
				}
				return decode;
			}
		}
	};
	next();
}

export default JWT;