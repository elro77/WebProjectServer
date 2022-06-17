
const user = {
    username: {
      type: String,
      required: [true, 'Username is required']
    },
    password: {
      type: String,
      required: [true, 'Created date is required']
    },
    projectlists:
    {
      type: Array
    }
}

const project = {
  projectName: {
    type: String
  },
  creator: {
    type: String
  },
  admin: {
    type: Array
  },
  projectDesc:{
    type: String
  },
  members:{
    type: Array
  },
  time:{
    type: String
  },
  issues:
  {
    type: Array
  }
}

/*issue
id,
desc,
dueDate,
assigendBy,
assignedTo,
status
*/





module.exports={user,project}
