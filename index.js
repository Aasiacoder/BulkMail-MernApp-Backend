import express from 'express';//"type":"module" code write in package.json
import cors from 'cors';
import nodemailer from 'nodemailer';//1 Install Nodemailer
import mongoose from 'mongoose'

const app = express();

const PORT = 5000;

//MiddleWare functions
app.use(express.json());
app.use(cors());

// (mongodb version/database name)
// mongodb://127.0.0.1:27017/passkey (this mongodb connaction link for mongodb local it only work from my laptop only not others laptop. so i change to mongodb Atlas cloud it will give mongodb connection link and it will work to all of thems laptop or system)
// connect mongoose                   username:password                                        databaseName  
mongoose.connect("mongodb+srv://aasiabulkmail:aasiaBulkmailPasskey@cluster0.1sfxc.mongodb.net/passkey?retryWrites=true&w=majority&appName=Cluster0").then(function () {
    console.log("Connected to Database");
}).catch(function () {
    console.log("Failed to connect");
})

//create model for to get a data from bulkmail collection {}-schema is not use here coz i didn't add any values here so i didn't give 
const credential = mongoose.model("credentialmodel", {}, 'bulkmail')

app.post("/sendemail", (req, res) => { //when /sendemail req is send then the mail is res

    let msg = req.body.msg
    let emailList = req.body.emailList
    console.log(msg); // see your msg in BE terminal
    console.log(emailList); // see your emailList in BE terminal

    credential.find().then(function (data) {

        // console.log(data[0].toJSON()); //toJSON() now it will be convert to json format for read & use data(prop)

        //mail code begins  //1st it take object{} and take function()
        const transporter = nodemailer.createTransport({
            //2 service:"here i use gmail service",
            service: "gmail",
            auth: { //my user mail id and password was stored in mongodb for security purpose
                user: data[0].toJSON().user, // to give your mail id here
                pass: data[0].toJSON().pass, // to create app password from your google acc, don't put your original mail pwd 
            },
        });

        // if i click "Send" btn it will suddenly shows Alert msg 'Email sent Successfully' but still it not sent.so, i use "promise" function to solve this problem
        new Promise(async function (resolve, reject) {
            try {
                for (let i = 0; i < emailList.length; i++)// inside the for loop function i get length of the emailList
                {
                    await transporter.sendMail(
                        {
                            from: "aasia3017@gmail.com",
                            to: emailList[i], // 3 who's you want to send mail give there mail id here
                            subject: "A message from BulkMail App",
                            text: msg,// what msg you want to write type here
                        },
                    )
                    console.log("Email sent to:" + emailList[i])
                }
                resolve("Success")
            }
            catch (error) {
                reject("Failed")
            }
        }).then(function () {
            res.send(true)
        }).catch(function () {
            res.send(false)
        })

    }).catch(function (error) {
        console.log(error)
    })

}); //credential close here

app.listen(PORT, () => {
    console.log(`Server Begins at port: ${PORT}`);
});