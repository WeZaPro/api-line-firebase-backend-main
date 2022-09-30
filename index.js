
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref, get, update, remove } from "firebase/database";
import express  from 'express'
import bodyParser  from "body-parser";
import cors from "cors";


const port = process.env.PORT || 3001;

const app = express();

app.use(cors());
app.use((req,res,next)=>{
    res.header('Access-Control-Allow-Headers, *, Access-Control-Allow-Origin', 'Origin, X-Requested-with, Content_Type,Accept,Authorization','http://localhost:4200');
    if(req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods','PUT,POST,PATCH,DELETE,GET');
        return res.status(200).json({});
    }
    next();
});




app.use(express.json());
app.use(bodyParser.json());

const firebaseConfig = {
    databaseURL: "https://shoppingproject-19325-default-rtdb.firebaseio.com/"
}
const app_fb = initializeApp(firebaseConfig)
const db = getDatabase(app_fb)


app.listen(port, () => console.log('App is listening on url http://localhost:' + port));

app.get('/', (req, res) => {
    res.send('Hello World!')
  })

  //get
app.get('/api/get', (req, res) => {
    try {
        get(ref(db, 'users'))
        .then((snapshot) => {
            console.log(snapshot.val())
            if( snapshot.exists() ) {
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'good',
                    Result: snapshot.val()
                })
            }
            else {
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'good',
                    Result: 'not found data'
                })
            }
        })
        .catch((err2) => {
            console.log(err2)
            return res.status(500).json({
                RespCode: 500,
                RespMessage: err2.message
            })
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            RespCode: 500,
            RespMessage: err.message
        })
    }
})

//create
app.post('/api/create', (req,res) => {
    var _userId = req.body.userId;
    // var _diaplayName = req.body.diaplayName;
    // var _pictureUrl = req.body.pictureUrl;
    // var _email = req.body.email;

    try {
        console.log('>>>> userId', _userId)
        // console.log('>>>> userId', _diaplayName)
        // console.log('>>>> _pictureUrl', _pictureUrl)
        console.log('path', 'users/' + _userId)
        set(ref(db, 'users/' + _userId), {
            UserId: _userId,
            // DisplayName: _diaplayName,
            // PictureUrl: _pictureUrl,
            // Email: _email,
            balance: 100,
            mil: new Date().getTime(),
            date: new Date() + ''
        })
        return res.status(200).json({
            RespCode: 200,
            RespMessage: 'good'
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            RespCode: 500,
            RespMessage: err.message
        })
    }
})

//get by user
app.post('/api/getbyuser', (req, res) => {
    var fullname = req.body.fullname

    try {
        get(ref(db, 'users/' + fullname))
        .then((snapshot) => {
            console.log(snapshot.val())
            if( snapshot.exists() ) {
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'good',
                    Result: snapshot.val()
                })
            }
            else {
                return res.status(200).json({
                    RespCode: 200,
                    RespMessage: 'good',
                    Result: 'not found data'
                })
            }
        })
        .catch((err2) => {
            console.log(err2)
            return res.status(500).json({
                RespCode: 500,
                RespMessage: err2.message
            })
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            RespCode: 500,
            RespMessage: err.message
        })
    }
})

//update
app.put('/api/update', (req, res) => {
    var fullname = req.body.fullname
    var balance = req.body.balance

    try {
        var updates = {};
        updates[`users/${fullname}/balance`] = balance;
        updates[`users/${fullname}/date`] = new Date() + '';
        updates[`users/${fullname}/mil`] = new Date().getTime();

        update(ref(db), updates)
        .then(() => {
            return res.status(200).json({
                RespCode: 200,
                RespMessage: 'good'
            })
        })
        .catch((err2) => {
            return res.status(500).json({
                RespCode: 500,
                RespMessage: 'bad ' + err2.message
            })
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            RespCode: 500,
            RespMessage: err.message
        })
    }
})

//delete
app.delete('/api/delete', (req, res) => {
    var fullname = req.body.fullname

    try {
        remove(ref(db, "users/"+fullname))
        .then(() => {
            return res.status(200).json({
                RespCode: 200,
                RespMessage: 'good'
            })
        })
        .catch((err2) => {
            return res.status(500).json({
                RespCode: 500,
                RespMessage: 'bad ' + err2.message
            })
        })
    }
    catch(err) {
        console.log(err)
        return res.status(500).json({
            RespCode: 500,
            RespMessage: err.message
        })
    }
})