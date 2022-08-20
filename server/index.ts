const { environment } = require("../src/environments/environment")
let port:number = 3002;
let express = require('express')
let app= express()
let bodyParser = require("body-parser");
let cors = require("cors");
const { urlencoded } = require("body-parser");
let mysql = require("mysql");
let multer = require("multer");
let bcrypt = require("bcryptjs");
let jwt = require('jsonwebtoken');
const db= mysql.createPool({
    host: "localhost",
    user: "evercode",
    password: "7780558",
    database: "luck",
});

let storage = multer.diskStorage({
  destination: function (req:any, file:any, cb:any) {
      cb(null, '../src/db/')
    },
    filename: function (req:any, file:any, cb:any) {
      cb(null, Date.now() + '_luck_' + file.originalname)
    }
  });
  let upload = multer({ storage: storage });
  

app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const generateToken = (user:[]) =>{
    return jwt.sign(user,environment.S3CRET_K3Y0)
}
const validateToken = (req:any,res:any,next:any) =>{
    const token = req.headers['authorization'];
    if(!token){
        console.log('Access denied')
    }else{
      jwt.verify(token, environment.environment.S3CRET_K3Y0, (err:any,user:any)=>{
            if(err){
                console.log('Access denied, token expired or incorrect')
            }else{
               next(); 
            }
        })
    }
}

app.listen(port, ()=>{
  console.log(`Started at PORT: ${port}`)
})
app.post('/signup', async(req:any,res:any)=>{
  let email:string = req.body.email; 
  let fullName:string = req.body.fullName;
  let password:string = req.body.password;
  const salt:any = await bcrypt.genSalt(15);
  password = await bcrypt.hash(password, salt);
  let signup: string="INSERT INTO accounts(email, fullname, password) VALUES(?,?,?)"
  db.query(signup, [email,fullName,password], (err:[],result:any)=>{
    if(err){
      res.send({failed_signup:"Email already exists"})
    }else{
      res.send({success_signup:"Signup Successfully"})
      let id:number = result.insertId;
      let stats:string="INSERT INTO accounts_stats(id) VALUES(?)"
      db.query(stats, [id])
    }
  })
})

app.post('/login', async(req:any,res:any)=>{
  let email: string = req.body.email;
  let password:string = req.body.password;
  let signin_data:string = "SELECT * FROM accounts WHERE email=?" 
  db.query(signin_data, [email], async(err0:any,res0:any)=>{
    if(res0.length >= 1){
      let encryptedPassword = res0[0].password; 
      await bcrypt.compare(password,encryptedPassword, (err1:any,result1:any)=>{
         if(result1){
          let user:any = {
            id:res0[0].id,
            email:email,
            fullname:res0[0].fullname,
            pic:res0[0].pic,
            banner:res0[0].banner,
          }
          const token = generateToken(user)
          res.send({success_login:token}) 
         }else{
          res.send({error:'Account does not match'})
         }
      })
    }else if(res0.length === 0){
      res.send({error:'Account does not match'})
    }
  })
})
