const jwt = require('jsonwebtoken');
const RateLimit = require('express-rate-limit');

exports.isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {    // 로그인 중이면 req.isAuthenticated()는 true
        next();
    } else {
        res.status(403).send('로그인 필요');
    }
};

exports.isNotLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {   // 로그인 중이 아니면 false
        next();
    } else {
        res.redirect('/');
    }
};

exports.verifyToken = (req,res,next)=>{
    try{
        req.decoded = jwt.verify(req.headers.authorization, process.env.JWT_SECRET);
        return next();
    }catch(error){
        if(error.name === 'TokenExpiredError'){//유효기간 초과에러
            return res.status(419).json({
                code:419,
                message:'토큰이 만료되었습니다.',
            });
        }
        return res.status(401).json({
            code:401,
            message:'유효하지 않은 토큰입니다.',
        });
    }
};

exports.apiLimiter = new RateLimit({
    windowMs: 60*1000,//1분(기준시간)
    max: 1,//허용횟수
    delayMs:0,//호출 간격
    handler(req,res){//제한 초과시 호출 함수
        res.status(this.statusCode).json({
            code : this.statusCode,//기본 == 429
            message: '1분에 한 번만 요청할수 있습니다.',
        });
    },
});

exports.deprecated = (req,res)=>{//사용하면 안되는 라우터에 사용
    res.status(410).json({
        code:410,
        message: '새로운 버전이 나왔습니다. 새로운 버전을 사용하세요.',
    });
};