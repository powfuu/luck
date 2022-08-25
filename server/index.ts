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
      jwt.verify(token, environment.S3CRET_K3Y0, (err:any,user:any)=>{
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
            type:res0[0].type
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
app.post('/check-type', validateToken,(req:any,res:any)=>{
  let token = req.body.token;
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any,user:any)=>{
    if(user){
    if(user.type === null){
      res.send({type:null})
    }else if(user.type === "creator"){
      res.send({type:"creator"})
    }else if(user.type === "normal"){
      res.send({type:"normal"})
    }
    }
  })
})
app.post('/update-type' ,(req:any,res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any,user:any)=>{
    if(user){
     let type = req.body.type;
     let update = "UPDATE accounts SET type=? WHERE email=?" 
     db.query(update, [type, user.email], (err0: any, res0: any)=>{
       if(res0){
          let usr:any = {
            id:user.id,
            email:user.email,
            fullname:user.fullname,
            pic:user.pic,
            banner:user.banner,
            type:type
          }
          const token = generateToken(usr)
          res.send({type:type, token:token})
       }
     })
    }
    })
})
app.post('/change-password', async(req: any,res: any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, async(err:any,user:any)=>{
    if(user){
  let oldPassword = req.body.oldPassword;
  let get_hashed_password:string = "SELECT password FROM accounts WHERE id=?"
  db.query(get_hashed_password, [user.id], async(err0:any, res0:any)=>{
    if(res0.length>=1){
      await bcrypt.compare(oldPassword, res0[0].password, async(err1:any, res1:any)=>{
        if(res1){
          const salt = await bcrypt.genSalt(15);
          let newPasswordHashed = await bcrypt.hash(req.body.newPasswordField, salt);
          let update_password:string = "UPDATE accounts SET password=? WHERE id=?"
          db.query(update_password, [newPasswordHashed, user.id], (err2:any, res2:any)=>{
            if(res2){
              res.send({success:"Your password has been updated successfully"})
            }
          })
        }else{
          res.send({error:"Old password field does not match with your current password"})
        }
      })
    }
  })
    }
  })
})
app.post('/set-privacy', (req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
  let setVal = req.body.val;
  let getVal;
  if (setVal === "tr"){
    getVal = "hidden_total_raffles"
  }else if(setVal === "mtr"){
    getVal = "hidden_my_total_raffles"
  }else if(setVal === "accs"){
    getVal = "hidden_accs"
  }
  let valStatus = req.body.valStatus;
  let query: string = `UPDATE accounts_stats SET ${getVal}=? WHERE id=?`
  db.query(query, [valStatus, user.id], (err0:any, res0:any)=>{
    if(res0){
      res.send({ok:"ok status"})
    }else if(err0){
      res.send({err:"err status"})
    }
  })
    }
  })
})
app.post('/get-privacy', (req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err: any, user: any)=>{
    if(user){
    let query: string = "SELECT * FROM accounts_stats WHERE id=?"
    db.query(query, [user.id], (err0:any,res0:any)=>{
      if(res0.length >= 1){
        res.send({data:res0[0]})
      }
    })
    }
  })
})
app.post('/get-data', (req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
      let query: string = "SELECT * FROM accounts WHERE id=?"
      db.query(query, [user.id], (err0:any,res0:any)=>{
        if(res0.length >= 1){
          res.send({data:res0[0]})
        }
      })
    } 
  })
})
app.post('/update-fullname', (req:any,res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    res.send({data:"ok"})
  })
})
app.post('/update-description', (req:any,res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    res.send({data:"ok"})
  })
})
