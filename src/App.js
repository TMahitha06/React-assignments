import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [Home, setHome] = useState(true);
  const [Users, setUsers] = useState([]);
  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const savedUsers = localStorage.getItem('myUsersList');
    
    if (savedUsers) {
      const convertedUsers = JSON.parse(savedUsers);
      setUsers(convertedUsers);
    } else {
      const defaultUsers = [
        {
          id: 1,
          name: 'Sanketh',
          mobile: '9876543210',
          email: 'sanketh@gmail.com'
        },
        {
          id: 2,
          name: 'Manju',
          mobile: '9876543211',
          email: 'manju@gmail.com'
        }
      ];
      setUsers(defaultUsers);
      localStorage.setItem('myUsersList', JSON.stringify(defaultUsers));
    }
  }, []); 

  useEffect(() => {
    if (Users.length > 0) {
      localStorage.setItem('myUsersList', JSON.stringify(Users));
    }
  }, [Users]);

  function addNewUser(userData) {
    const newUserId = Date.now();
    const completeUser = {
      id: newUserId,
      name: userData.name,
      mobile: userData.mobile,
      email: userData.email
    };
    const updatedUserList = [...Users, completeUser];
    setUsers(updatedUserList);
  }
  function updateUser(updatedInfo) {
    const newUserList = [];
    for (let i = 0; i < Users.length; i++) {
      if (Users[i].id === updatedInfo.id) {
        newUserList.push(updatedInfo);
      } else {
        newUserList.push(Users[i]);
      }
    }
    setUsers(newUserList);
    setEditUser(null); 
  }

  function deleteUser(userIdToDelete) {
    const userConfirmed = window.confirm('Are you sure you want to delete this user?');
    if (userConfirmed) {
      const remainingUsers = [];
      for (let i = 0; i < Users.length; i++) {
        if (Users[i].id !== userIdToDelete) {
          remainingUsers.push(Users[i]);
        }
      }
      setUsers(remainingUsers);
    }
  }

  return (
    <div className="App">
      <h1>User Management System</h1>
      
      {/* Tab Buttons */}
      <div className="tabs">
        <button 
          className={Home ? 'activeTab' : 'normalTab'}
          onClick={() => setHome(true)}
        >
          Home
        </button>
        <button 
          className={!Home ? 'activeTab' : 'normalTab'}
          onClick={() => setHome(false)}
        >
          Create User
        </button>
      </div>

      {Home ? (
        <HomeScreen 
          usersList={Users} 
          editButtonClicked={setEditUser}
          deleteButtonClicked={deleteUser}
          switchToCreateTab={() => setHome(false)}
        />
      ) : (
        <CreateUserScreen 
          addUserFunction={addNewUser}
          updateUserFunction={updateUser}
          userBeingEdited={editUser}
          cancelEditFunction={() => setEditUser(null)}
        />
      )}
    </div>
  );
}

function HomeScreen({ usersList, editButtonClicked, deleteButtonClicked, switchToCreateTab }) {
  return (
    <div>
      <h2>User List</h2>
      
      {usersList.length === 0 ? (
        <p>No users found. Please add some users.</p>
      ) : (
        <table className="userTable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {usersList.map((oneUser) => {
              return (
                <tr key={oneUser.id}>
                  <td>{oneUser.name}</td>
                  <td>{oneUser.mobile}</td>
                  <td>{oneUser.email}</td>
                  <td>
                    <button 
                      className="editButton"
                      onClick={() => {
                        editButtonClicked(oneUser);     
                        switchToCreateTab();             
                      }}
                    >
                      Edit
                    </button>
                    <button 
                      className="deleteButton"
                      onClick={() => deleteButtonClicked(oneUser.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}


function CreateUserScreen({ addUserFunction, updateUserFunction, userBeingEdited, cancelEditFunction }) {
  const [enteredName, setEnteredName] = useState('');
  const [enteredMobile, setEnteredMobile] = useState('');
  const [enteredEmail, setEnteredEmail] = useState('');
  
  const [nameErrorMsg, setNameErrorMsg] = useState('');
  const [mobileErrorMsg, setMobileErrorMsg] = useState('');
  const [emailErrorMsg, setEmailErrorMsg] = useState('');


  React.useEffect(() => {
    if (userBeingEdited) {
      setEnteredName(userBeingEdited.name);
      setEnteredMobile(userBeingEdited.mobile);
      setEnteredEmail(userBeingEdited.email);
    } else {
      setEnteredName('');
      setEnteredMobile('');
      setEnteredEmail('');
    }
  }, [userBeingEdited]);

  function checkFormValidation() {
    let isFormOk = true;
    
    if (enteredName.trim() === '') {
      setNameErrorMsg('Name is required');
      isFormOk = false;
    } else {
      setNameErrorMsg('');
    }
   
    if (enteredMobile.trim() === '') {
      setMobileErrorMsg('Mobile number is required');
      isFormOk = false;
    } else if (enteredMobile.length !== 10) {
      setMobileErrorMsg('Mobile number must be exactly 10 digits');
      isFormOk = false;
    } else {
      let isAllNumbers = true;
      for (let i = 0; i < enteredMobile.length; i++) {
        if (enteredMobile[i] < '0' || enteredMobile[i] > '9') {
          isAllNumbers = false;
        }
      }
      if (!isAllNumbers) {
        setMobileErrorMsg('Mobile number must contain only digits');
        isFormOk = false;
      } else {
        setMobileErrorMsg('');
      }
    }
    
    if (enteredEmail.trim() === '') {
      setEmailErrorMsg('Email is required');
      isFormOk = false;
    } else if (!enteredEmail.includes('@')) {
      setEmailErrorMsg('Email must contain @ symbol');
      isFormOk = false;
    } else if (!enteredEmail.includes('.')) {
      setEmailErrorMsg('Email must contain a dot (.)');
      isFormOk = false;
    } else {
      setEmailErrorMsg('');
    }
    
    return isFormOk;
  }

  function onFormSubmit(event) {
    event.preventDefault(); 
    
    if (checkFormValidation()) {
     
      const newUserData = {
        name: enteredName,
        mobile: enteredMobile,
        email: enteredEmail
      };
      
      if (userBeingEdited) {
    
        const updatedUserInfo = {
          ...newUserData,
          id: userBeingEdited.id
        };
        updateUserFunction(updatedUserInfo);
      } else {
      
        addUserFunction(newUserData);
      }
      
      setEnteredName('');
      setEnteredMobile('');
      setEnteredEmail('');
    }
  }

  return (
    <div>
      <h2>{userBeingEdited ? 'Edit User' : 'Create New User'}</h2>
      
      <form onSubmit={onFormSubmit} className="userForm">
        <div className="formField">
          <label>Name: *</label>
          <input
            type="text"
            value={enteredName}
            onChange={(e) => setEnteredName(e.target.value)}
            placeholder="Enter full name"
          />
          {nameErrorMsg && <span className="errorText">{nameErrorMsg}</span>}
        </div>

        <div className="formField">
          <label>Mobile Number: *</label>
          <input
            type="text"
            value={enteredMobile}
            onChange={(e) => setEnteredMobile(e.target.value)}
            placeholder="10 digit mobile number"
          />
          {mobileErrorMsg && <span className="errorText">{mobileErrorMsg}</span>}
        </div>

        <div className="formField">
          <label>Email: *</label>
          <input
            type="email"
            value={enteredEmail}
            onChange={(e) => setEnteredEmail(e.target.value)}
            placeholder="example@email.com"
          />
          {emailErrorMsg && <span className="errorText">{emailErrorMsg}</span>}
        </div>

        <div className="formButtons">
          <button type="submit" className="submitButton">
            {userBeingEdited ? 'Update User' : 'Add User'}
          </button>
          
          {userBeingEdited && (
            <button type="button" className="cancelButton" onClick={cancelEditFunction}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default App;