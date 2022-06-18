//const Testing=require('./extras')
//Testing.add2Users()

const db=require("./db")
const express = require('express')
const cors = require('cors');
const server = express()

server.use(express.json())
server.use(cors());
//server.use(bodyParser.urlencoded({ extended: true }));
let port = process.env.PORT;
if (port == null || port === "") {
    port = 3030;
}

server.get('/', (req, res) => {
    res.send('This is the server!')
  })

server.get('/api/login/:userName/:password', (req, response) => {
//example http://localhost:3001/api/login/:jonny/:1234
    const username=(req.params.userName).replace(':', '')
    const password=(req.params.password).replace(':', '')
    console.log(username,password)
    db.findUserAndPassword(username,password,response)
  })

  server.post('/api/register/:userName/:password', (req, response) => {
        const username=(req.params.userName).replace(':', '')
        const password=(req.params.password).replace(':', '')
        console.log(username,password)
        db.addUser(username,password,{},response)
      }) 


  server.post('/api/getUserProjects/:userName', (req, response) => {
    const username=(req.params.userName).replace(':', '')
    console.log(username,password)
    db.getUserProjects(username,response)
  }) 

  server.post('/api/addProject/:userName/:projectName/:projectDesc/:projectsList', (req, response) => {
    const username=(req.params.userName).replace(':', '')
    const projectName=(req.params.projectName).replace(':', '')
    const projectDesc=(req.params.projectDesc).replace(':', '')
    const projectsList=(req.params.projectsList).replace(':', '')
    console.log(username,projectName)
    db.addProject(username,projectName,projectDesc,projectsList,response)
  })

  
  server.post('/api/getProjectJson/:projectID', (req, response) => {
    console.log("index getProjectJson")
    const projectID=(req.params.projectID).replace(':', '')
    db.getProjectJson(projectID,response)
  })

  server.post('/api/addMember/:userName/:projectName/:premission/:id', (req, response) => {
    console.log("index addMember")
    const username=(req.params.userName).replace(':', '')
    const projectName=(req.params.projectName).replace(':', '')
    const premission=(req.params.premission).replace(':', '')
    const id=(req.params.id).replace(':', '')
    db.addMember(username,projectName,premission,id,response)
  })

  server.post('/api/addIssue/:projectID/:issueID/:desc/:dueDate/:assignedBy/:assignedTo/:status', (req, response) => {
    console.log("index addIssue")
    const projectID=(req.params.projectID).replace(':', '')
    const issueID=(req.params.issueID).replace(':', '')
    const desc=(req.params.desc).replace(':', '')
    const dueDate=(req.params.dueDate).replace(':', '')
    const assignedBy=(req.params.assignedBy).replace(':', '')
    const assignedTo=(req.params.assignedTo).replace(':', '')
    const status=(req.params.status).replace(':', '')
    db.addIssue(projectID,issueID,desc,dueDate,assignedBy,assignedTo,status, response)
  })

  server.post('/api/updateIssueStatus/:projectID/:issueID/:finalStatus', (req, response) => {
    console.log("index updateIssue")
    const projectID=(req.params.projectID).replace(':', '')
    const issueID=(req.params.issueID).replace(':', '')
    const finalStatus=(req.params.finalStatus).replace(':', '')
    db.updateIssue(projectID, issueID, finalStatus, response)
  })




server.listen(port, () => {
        console.log(` server listening at http://localhost:${port}`)
      })