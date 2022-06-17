const Mutex = require('async-mutex').Mutex;
const mongoose = require('mongoose')
const schemas=require('./schemas')

url = "mongodb+srv://elroye77:1234@cluster0.es5bl.mongodb.net/WebDB?retryWrites=true&w=majority"

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
console.log("connected!")

const userSchema = new mongoose.Schema(schemas.user)
const projectSchema = new mongoose.Schema(schemas.project)


//note: collection name must not contain capital letters
//mongoose.model(<CollectionName>, <JSONSchema>)
const User = mongoose.model('users', userSchema)
const Project = mongoose.model('projects', projectSchema)


//example for creating a data row in the collection
//User.create({username:`hi`,password:`hi`});

 function findUserAndPassword(name,pass,response) {
     
     User.findOne({ username:`${name}`,password:`${pass}`},function(err,user)
    {
        if (err)
        {
            response.status(404).end()
            console.log("DB Error")
        }   
        else if(user !=null)
        {
            var userProjects = user.projectlists
            if(userProjects.length != 0)
            {
                console.log("Get project List")
                console.log(userProjects)
                Project.find({
                    _id: { $in:  userProjects}
                }, function(err,userProjectsJSON){
    
                    console.log('All done!');
                    console.log(userProjectsJSON);
                    // sends null if user is not premitted
                    userProjectsJSON = JSON.stringify(userProjectsJSON)
                    response.status(200)
                    response.json( { userName: `${name}`, userProjectsJSON: `${userProjectsJSON}`});
                    // console.log( { userName: `${name}`, userProjectsJSON: `${userProjectsJSON}`});
                    console.log("DB sign in respons sent")
                }) 
            }
            else
            {
                console.log('Empty');
                response.status(200)
                response.json( { userName: `${name}`, userProjectsJSON: [] });
            }
            
        } 
        else
        {
            //sends null if user is not premitted
            response.status(200)
            response.json(user);
            console.log("DB sign in respons sent")
        }  
    })
    
  }


  function addUser(username,password,list,response)
  {
    User.findOne({ username:`${username}`,password:`${password}`},function(err,user)
    {
      
        if (err)
        {
            response.status(404).end()
            console.log("DB Error")
        }   
        else if( user!=null)
        {
            response.status(200)
            response.json(null);
            console.log("user exists in Db")

        }
        else
        {
            let jsonlist= JSON.stringify(list)
            User({
                username,
                password,
                lists:jsonlist
              }).save()
              response.status(200)
              response.send("UserRegisted")
        }
    })
    
  }

  function addProject(userName,projectName,projectDesc,projectsList,response)
  {
    console.log("DB addProject")
    console.log(userName,projectName)
    //let jsonlist= JSON.stringify(list)
    var today = new Date();
    var yyyy = today.getFullYear();
    let mm = today.getMonth() + 1; // Months start at 0!
    let dd = today.getDate();

    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;

    today = dd + '/' + mm + '/' + yyyy;
    var myProject;
    Project({
        projectName,
        creator:userName,
        admin:[userName],
        projectDesc,
        members: [],
        time:today
      }).save((err,createdProject)=>{
        myProject = createdProject
        console.log("createdProject:")
        console.log(createdProject)

        User.findOneAndUpdate(
            { username: `${userName}`},
            { $push: { projectlists: `${createdProject._id}`} },
            function(err, result) {
                if (err) {
                    console.log(err);
                } else {
                    console.log(result);
                }
            }
            )

        response.status(200)
        response.json(JSON.stringify(myProject));  
      })
    
  }

  function addMember(userName,projectName,premission,id,response)
  {
      console.log("db.addMember")
      console.log(userName,projectName,premission,id)
      //first check if user exists
      User.findOne({ username:`${userName}`},function(err,user)
    {
        if (err)
        {
            response.status(404).end()
            console.log("DB Error")
        }   
        else
        {
            
            if(user == null)
            {
                console.log("user not found")
                response.status(200)
                response.json({passed: false, msg: "Username '"+String(userName)+"' does not exits"}); 
            }
            else
            {
                //search if such user is already a member
                Project.findOne({ _id: `${id}`, $or: [{admin: { $in: `${userName}`}} , {members: { $in: `${userName}`}}]} ,function(err,found)
                {
                    if (err) {
                        console.log(err);
                    } else {    
                        console.log(found)
                        if(found !== null)
                        {
                            response.status(200)
                            response.json({passed: false, msg: "Username: "+String(userName)+" is already a member"}); 
                        }
                        else
                        {
                            if(premission === "Admin")
                            {
                                console.log("add admin")
                                Project.findOneAndUpdate(
                                    { projectName: `${projectName}`},
                                    { $push: { admin: `${userName}`} },
                                    function(err, result) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(result);
                                            User.findOneAndUpdate(
                                                { username: `${userName}`},
                                                { $push: { projectlists: `${result._id}`} },
                                                function(err, result2) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        console.log(result2);
                                                    }
                                                }
                                                )
                                        }
                                    }
                                    )
                            }
                            else
                            {
                                console.log("add member")
                                Project.findOneAndUpdate(
                                    { projectName: `${projectName}`},
                                    { $push: { members: `${userName}`} },
                                    function(err, result) {
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(result);
                                            User.findOneAndUpdate(
                                                { username: `${userName}`},
                                                { $push: { projectlists: `${result._id}`} },
                                                function(err, result2) {
                                                    if (err) {
                                                        console.log(err);
                                                    } else {
                                                        console.log(result2);
                                                    }
                                                }
                                                )
                                        }
                                    }
                                    )
                            }
                            response.status(200)
                            response.json({passed: true, msg: "Username: "+String(userName)+" added successfully"});
                        }
                    }
                })          
            }      
        }
    })
  }

  function addIssue(projectID,issueID,desc,dueDate,assignedBy,assignedTo,status,response)
  {
    console.log("db add Issue") 
    Project.findOneAndUpdate(
        { _id: `${projectID}`},
        { $push: { issues: {id: issueID,
                            desc: desc, 
                            date: dueDate, 
                            assignedBy: assignedBy, 
                            assignedTo: assignedTo, 
                            status: status
                            }
                    }
        },
        function(err, result) {
            if (err) {
                console.log(err);
                response.json({msg: "Error while adding issue"})
            } else {
                console.log(result);
                response.status(200)
                response.json({id: issueID,
                    desc: desc, 
                    date: dueDate, 
                    assignedBy: assignedBy, 
                    assignedTo: assignedTo, 
                    status: status
                    });
            }
        }
        )
  }

  function updateIssue(projectID, issueID, finalStatus ,response)
  {
    console.log("db updateIssue") 
    console.log(projectID,issueID,finalStatus) 
    var issueJSON = JSON.stringify({issueID:issueID, finalStatus:finalStatus})
    Project.findOneAndUpdate(
        { $and: [{_id: `${projectID}`} , {'issues.id': issueID}]},
        {$set : {'issues.$.status': finalStatus}},
        function(err, result) {
            if (err) {
                console.log("found error");
                console.log(err);
                response.json({msg: "Error while updating issue status"})
            } else {
                console.log("result");
                response.status(200)
                response.json(
                        {issueID: issueID,
                        finalStatus: finalStatus
                        }
                );
            }
        }
        )
  }







  let clientLock = new Mutex()
    async function updateUser(username,password,lists,response){
        let release = await clientLock.acquire();
    User.findOneAndRemove({ username:`${username}`,password:`${password}`},function(err,user)
    {
        
        if (err)
        {
            response.status(404).end()
            console.log("DB Error or user dosent exist in DB")
            console.log(err)

        }   
        else
                 {
                    let jsonlist= JSON.stringify(lists)
                     User({
                        username:username,
                         password:password,
                         lists:jsonlist
                      }).save()
                       response.status(200)
                       response.send("UserUpdated")
                 }
        release()      
    })
   
 }



  module.exports={findUserAndPassword,addUser,updateUser,addProject,addMember,addIssue,updateIssue}