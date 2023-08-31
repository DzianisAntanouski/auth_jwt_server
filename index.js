require('dotenv').config();
const oExpress = require('express');
const oCors = require('cors');
const oCookieParser = require('cookie-parser');
const oMongoose = require('mongoose');
const errorMiddleware = require('./middlewares/error-middleware.js')

const oRouter = require('./router/index.js')

const nPort = process.env.PORT || 5000;
const oApp = oExpress();

oApp.use(oExpress.json());
oApp.use(oCookieParser());
oApp.use(oCors());
oApp.use('/api', oRouter);
oApp.use(errorMiddleware) // must be last in middlewares chain

const fStart = async () => {
    try {
        await oMongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        oApp.listen(nPort, () => console.log(`Server started on port: ${nPort}`));
    } catch (oError) {
        console.log(oError);
    }
}

fStart();