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
      cb(null, '../src/assets/db/')
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
            type:res0[0].type,
            desc:res0[0].description
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
            type:type,
            desc:user.description
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
    if(user){
    let query: string = "UPDATE accounts SET fullname=? WHERE id=?"
    db.query(query, [req.body.fullname, user.id], (err0:any,res0:any)=>{
      if(res0){
          let usr:any = {
            id:user.id,
            email:user.email,
            fullname:req.body.fullname,
            pic:user.pic,
            banner:user.banner,
            type:user.type,
            desc:user.desc
          }
          const token = generateToken(usr)
          res.send({fullname:req.body.fullname, token:token})
      }
    })
    }
  })
})
app.post('/update-description', (req:any,res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
    let query: string = "UPDATE accounts SET description=? WHERE id=?"
    db.query(query, [req.body.description, user.id], (err0:any,res0:any)=>{
      if(res0){
          let usr:any = {
            id:user.id,
            email:user.email,
            fullname:user.fullname,
            pic:user.pic,
            banner:user.banner,
            type:user.type,
            desc:req.body.description
          }
          const token = generateToken(usr)
          res.send({description:req.body.description, token:token})
      }
    })
    }
  })
})
app.post('/update-banner',upload.single("banner"),(req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0,(err:any, user:any)=>{
    if(user){
      let banner = req.file.filename;
      let query: string = "UPDATE accounts SET banner=? where id=?"
      db.query(query, [banner, user.id], (err0: any, res0:any)=>{
        if(res0){
          let usr:any = {
            id:user.id,
            email:user.email,
            fullname:user.fullname,
            pic:user.pic,
            banner:banner,
            type:user.type,
            desc:user.desc
          }
          let token = generateToken(usr)
          res.send({token:token, banner:banner})
        }
      })
    }
  })
})
app.post('/update-pic',upload.single("pic"),(req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0,(err:any, user:any)=>{
    if(user){
      let pic= req.file.filename;
      let query: string = "UPDATE accounts SET pic=? where id=?"
      db.query(query, [pic, user.id], (err0: any, res0:any)=>{
        if(res0){
          let usr:any = {
            id:user.id,
            email:user.email,
            fullname:user.fullname,
            pic:pic,
            banner:user.banner,
            type:user.type,
            desc:user.desc
          }
          let token = generateToken(usr)
          res.send({token:token, pic:pic})
        }
      })
    }
  })
})
app.post("/publish-raffle", (req:any,res:any)=>{
  if(req.body.raffleMaxPField >= 2){
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
      let code = `${user.fullname.replace(' ','-')}/${Math.floor(Math.random() * 117981169) + 11798116}` 
      let main_pic;
      if(req.body.f0.length >=2){
        main_pic = req.body.f0;
      }else{
        main_pic = "profilebanner.png"; 
      }
      let title = req.body.raffleTitleField;
      let pic1 = req.body.f1;
      let pic2 = req.body.f2;
      let pic3 = req.body.f3;
      let description = req.body.raffleDescriptionField;
      let max_participants = req.body.raffleMaxPField;
      let prizeIsMoney = req.body.isMoney;
      let max_winners = req.body.raffleMaxWField;
      let creatorId= user.id;
      let prize = req.body.rafflePrize;
      let insr = "INSERT INTO rafflep(userId, code) VALUES(?,?)"
      db.query(insr, [user.id, code])
      let query = "INSERT INTO raffles(code,main_pic,title,pic1,pic2,pic3,description,max_participants,prizeIsMoney,max_winners,prize, creatorId) VALUES(?,?,?,?,?,?,?,?,?,?,?,?)"
      db.query(query, [code, main_pic, title, pic1, pic2, pic3, description, max_participants, prizeIsMoney, max_winners, prize, creatorId], (err0:any,res0:any)=>{
        if(res0){
          res.send({status_ok: res0})
        }else if(err0){
          res.send({status_failed: "Error while publishing raffle, please check if all fields and images are correct"})
        }
      }) 
    }
  })
  }else{
    res.send({status_failed: "Maximum Participants needs to be bigger than 1"})
  }
})
app.post("/upfr0", upload.single("pic0"), (req:any, res:any)=>{
  res.send({file: req.file.filename})
})
app.post("/upfr1", upload.single("pic1"), (req:any, res:any)=>{
  res.send({file: req.file.filename})
})
app.post("/upfr2", upload.single("pic2"), (req:any, res:any)=>{
  res.send({file: req.file.filename})
})
app.post("/upfr3", upload.single("pic3"), (req:any, res:any)=>{
  res.send({file: req.file.filename})
})
app.post("/join-into-raffle", (req:any,res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
      let getCode = "SELECT code FROM raffles WHERE code=?"
      db.query(getCode, [req.body.code], (err0:any, res0:any)=>{
        if(res0.length >=1){
          let getjoin = "SELECT * FROM rafflep WHERE userId=? AND code=?"
          db.query(getjoin, [user.id, req.body.code], (err2:any, res2:any)=>{
            if(res2.length>=1){
              res.send({failed:"You are already participating in this raffle"})
            }else if(res2.length === 0){
          let join = "INSERT INTO rafflep(userId,code) VALUES(?,?)"
          db.query(join, [user.id, req.body.code], (err1:any, res1:any)=>{
            if(res1){
              res.send({success:res2})
            }
          })
            }
          })
            }else if(res0.length === 0){
          res.send({failed:`Raffle with code: ${req.body.code} does not exist.`})
        }
      })
    }
  })
})
app.post("/get-statistics", (req:any,res:any)=>{
  //use knoweldge of select from multiples tables in once query and create variables like % chance to win = calculate wins and participantions
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
      let getRafflesData = "SELECT * FROM raffles WHERE first_winner=? OR second_winner=? OR third_winner=? OR creatorId=?"
      db.query(getRafflesData, [user.id,user.id,user.id,user.id], (err0:any,res0:any)=>{
        let getRPData = "SELECT * FROM rafflep WHERE userId=?"
        db.query(getRPData, [user.id], (err1:any,res1:any)=>{
          if(res1.length >= 1){
          let firstWinnersArr = res0.filter((prop:any)=> prop.first_winner === user.id)
          let secondWinnersArr = res0.filter((prop:any)=> prop.third_winner === user.id)
          let thirdWinnersArr = res0.filter((prop:any)=> prop.second_winner === user.id)
          let creatorIdArr = res0.filter((prop:any)=> prop.creatorId === user.id)
          let wins: number = firstWinnersArr.length + secondWinnersArr.length + thirdWinnersArr.length
          let createdRaffles: number = creatorIdArr.length
          let participations: number = res1.length-creatorIdArr.length
          let winrate: number = wins / participations * 100
          //porcentaje de victorias = partidas ganadas / partidas jugadas * 100
          let Arr = {
            wins: wins,
            createdRaffles: createdRaffles,
            participations: participations,
            winrate: winrate >=1 ? winrate : 0
          }
          res.send({statistics: Arr})
          }else if(res0.length === 0){
          let Arr = {
            wins: 0,
            createdRaffles: 0,
            participations: 0,
            winrate:0
          }
          res.send({statistics: Arr})
          }
        })
      })
     }
  })
})
app.post("/get-ai-dashboard-raffles", (req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
      let getActiveRaffles = "SELECT ac.fullname,ac.pic,rs.raffleIsActive,rs.description,rs.title,rs.main_pic,rs.pic1,rs.pic2,rs.pic3,rs.code FROM raffles rs JOIN rafflep rp JOIN accounts ac WHERE ac.id = rs.creatorId AND rs.code=rp.code AND rp.userId=? GROUP BY rs.id ORDER BY rs.id DESC"
      db.query(getActiveRaffles, [user.id], (err0:any, res0:any)=>{
        if(res0.length >=1){
          res.send({raffles:res0})
        }else if(res0.length === 0){
          res.send({emptyRaffles:"Empty"})
        }
      })
    }
  })
})
app.post("/check-code", (req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any,user:any)=>{
    if(user){
      let code = req.body.code;
      let id = user.id;
      let check = "SELECT code FROM rafflep WHERE userId=? AND code=?"
      db.query(check, [id, code], (err0:any,res0:any)=>{
        if(res0.length == 0){
          res.send({failed:"user is not in this raffle"})
        }else if(res0.length >= 1){
          res.send({success:"user checked"})
        }
      })
    }
  })
})
app.post('/get-raff-data', (req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
      let get_data = "SELECT * FROM raffles rs WHERE rs.code=?"
      db.query(get_data, [req.body.code], (err0:any,res0:any)=>{
        if(res0.length >=1 ){
          res.send({data:res0})
        }
      })
    }
  })
})
app.post('/get-creator-data', (req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
      let get_data = "SELECT * FROM accounts acc WHERE acc.id=?"
      db.query(get_data, [req.body.code], (err0:any,res0:any)=>{
        if(res0.length >=1 ){
          res.send({data:res0})
        }
      })
    }
  })
})
app.post('/end-raffle', (req:any,res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
        let nanwin = req.body.nanWin;
        let getList = 'SELECT * FROM rafflep rp WHERE rp.code=?'
        db.query(getList, [req.body.code], (err1:any, res1:any)=>{
            if(res1.length >= 1){
                let arr = res1.slice(1)
                let nan1: any, nan2:any, nan3:any; 
                  if(nanwin >= 1){
                    do{
                      nan1=Math.floor(Math.random() * arr.length) 
                    }while(nan1 === nan2 || nan1 === nan3)
                  }
                  if(nanwin >= 2){
                    do{
                      nan2=Math.floor(Math.random() * arr.length) 
                    }while(nan2 === nan1 || nan1 === nan3)
                  }
                  if(nanwin === 3){
                    do{
                      nan3=Math.floor(Math.random() * arr.length) 
                    }while(nan3 === nan1 || nan3 === nan2)
                  }
              let query = ''
              setTimeout(() => {
              if(nanwin == 1){
                        query='UPDATE raffles rs SET rs.first_winner=? WHERE rs.code=?'
                        db.query(query, [arr[nan1].userId,req.body.code])
                        console.log("nanwin1 query executing, nan1 = "+nan1+" with account id = "+arr[nan1].userId)
              }
              if(nanwin == 2){
                        console.log("nanwin1 query executing, nan1 = "+nan1+" with account id = "+arr[nan1].userId+" and nanwin2 query, nan2 = "+nan2+" with account id = "+arr[nan2].userId)
                        query='UPDATE raffles rs SET rs.first_winner=?, rs.second_winner=? WHERE rs.code=?'
                        db.query(query, [arr[nan1].userId,arr[nan2].userId,req.body.code])
              }
              if(nanwin == 3){
                        query='UPDATE raffles rs SET rs.first_winner=?, rs.second_winner=?, rs.third_winner=? WHERE rs.code=?'
                        db.query(query, [arr[nan1].userId,arr[nan2].userId,arr[nan3].userId,req.body.code])
              }
              }, 200);
        let end_query = 'UPDATE raffles SET raffleIsActive=? WHERE code=?'
        db.query(end_query, [false, req.body.code], (err0:any, res0:any)=>{
            if(res0.length >=1){
                res.send({ok:"rmved"})
            }
        })
            }
        })
    }
  })
})
app.post('/get-raffle-participants-list', (req:any,res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
        let query_get = "SELECT * FROM rafflep rp,accounts acc, raffles rs where rp.code=? AND rp.userId=acc.id AND rs.code=? AND rs.creatorId!=acc.id"
        db.query(query_get, [req.body.code, req.body.code], (err0:any,res0:any)=>{
            if(res0.length >= 1){
                res.send({data:res0})
            }else if(res0.length === 0){
                res.send({empty:"empty"})
            }
        })
    }
  })
})
app.post('/get-userId', (req:any, res:any)=>{
  jwt.verify(req.headers['authorization'], environment.S3CRET_K3Y0, (err:any, user:any)=>{
    if(user){
        res.send({id:user.id})
    }
  })
})
