import { initializeApp } from "https://www.gstatic.com/firebasejs/9.0.1/firebase-app.js";
import {doc, getFirestore, collection, addDoc, getDocs, setDoc, deleteDoc, onSnapshot} from "https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcF5OuDn_KArUfWVXXndHCoKWo_ZwRdlA",
  authDomain: "principal33-frontend-cms.firebaseapp.com",
  projectId: "principal33-frontend-cms",
  storageBucket: "principal33-frontend-cms.appspot.com",
  messagingSenderId: "150929172953",
  appId: "1:150929172953:web:2749b7d4e2133309d311c8",
  measurementId: "G-083WQ0SSV8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.onload = () =>{

    document.getElementById("add-employee-button").addEventListener("click", AddEmployee, false);
    document.getElementById("modalButton").addEventListener("click", openModal, false);

    document.querySelectorAll(".close-myModal").forEach(e =>{
        e.addEventListener("click", closeModal, false);
    });

    document.getElementById("picture").addEventListener("change", showMyImage, false);

    document.getElementById("search-employee").addEventListener("keyup", searchEmployee, false);

    getFromDb().then(currentEmployees => {
        currentEmployees.forEach(e => {
            AppendTable(e);
        });
    
        setDelete();
        setSort();
    });

}

async function getFromDb() {
    const querySnapshot = await getDocs(collection(db, "employeesFirebase"));
    var employees = [];
    querySnapshot.forEach( document => {
        var employee = document.data();
        employee.employeeId = document.id;
        employees.push(employee);
    });
    return Promise.resolve(employees);
}

//Put employee in table
function AppendTable(employee) {
    var tableContent = `<tr employee-id=${employee.employeeId}>
    <td><img src="${employee.picture}" class="picture"></td>
    <td>${employee.lastName}</td>
    <td>${employee.firstName}</td>
    <td>${employee.email}</td>
    <td>${employee.gender}</td>
    <td>${employee.birthDate}</td>
    <td class="stergere"><img src="/images/trash.svg"></td>
    </tr>`
    console.log(employee);
    document.getElementById("table-employees").innerHTML += tableContent;
}

//Get employee in local storage and populate the table
function AddEmployee() {
    var lastName = document.getElementById("last-name").value;
    var firstName = document.getElementById("first-name").value;
    var email = document.getElementById("email-input").value;
    var gender = document.getElementById("gender-input").value;
    var birthDate = document.getElementById("birthdate-input").value;
    var picture = document.getElementById("imgPreview").src;

    var validateForm = validate(lastName, firstName, email, gender, birthDate);

    if(validateForm) {

            saveToDb(lastName, firstName, email, gender, birthDate, picture).then((newEmployee) => {
            AppendTable(newEmployee);
            setDelete();
            closeModal();
            clearModal();
        });
    }
}

//Add function to Firebase
async function saveToDb(lastName, firstName, email, gender, birthDate, picture) {
    var employeeDoc= doc(collection(db, "employeesFirebase")).withConverter(employeeConverter);
    var newEmployee = new Employee(employeeDoc.id, lastName, firstName, email, gender, birthDate, picture);
    setDoc(employeeDoc, newEmployee);

    return Promise.resolve(newEmployee);
}

// Firestore data converter
const employeeConverter = {
    toFirestore: (employee) => {
        return {
                'employeeId' : employee.employeeId,
                'lastName' : employee.lastName,
                'firstName' : employee.firstName,
                'email' : employee.email,
                'birthDate' : employee.birthDate,
                'gender' : employee.gender,
                'picture' : employee.picture,
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new Employee(data.employeeId ,data.lastName, data.firstName, data.email, data.birthDate, data.gender, data.picture);
    }
};

//Employee constructor
function Employee(employeeId, lastName, firstName, email, gender, birthDate, picture) {
    this.employeeId = employeeId;
    this.lastName = lastName;
    this.firstName = firstName;
    this.email = email;
    this.birthDate = moment(birthDate).format('D MMMM YYYY');
    this.gender = gender;
    this.picture= picture;
}

 //Open modal function
function openModal() {
    document.getElementById('myModal').style = "display:block";
    document.getElementById('myModal').classList.add("show");
}

//Close modal function
function closeModal() {
    document.getElementById('myModal').style = "display:none";
    document.getElementById('myModal').classList.remove("show");
}

//Closing modal at outside click function
window.onclick = function(event) {
    if (event.target == document.getElementById('myModal')) {
      closeModal();
    }
}

//Delete event set on click
function setDelete() {
    document.querySelectorAll(".stergere").forEach(e => {
        e.addEventListener("click", deleteEmployeeRow, false);
    });
}

//Delete function from Firebase
async function deleteFromDb(documentId) {
    await deleteDoc(doc(db, "employeesFirebase", documentId));
}

//Delete employee function
function deleteEmployeeRow(htmlDeleteElement) {
    if (confirm('Are you sure to delete this employee ?')) {
        var rowToBeDeleted = htmlDeleteElement.target.closest("tr");
        var employeeToDeleteId = rowToBeDeleted.getAttribute("employee-id");

        deleteFromDb(employeeToDeleteId).then(() => {
            rowToBeDeleted.remove();
        })
    }
}

//Getting age and validation of 16+ from birthdate function
function getAge(birthDate) {
    var birth = new Date(birthDate);
    var diff = new Date(Date.now() - birth.getTime());
    var age = diff.getUTCFullYear() - 1970;

    return age >= 16;
}

//Validation function
function validate(lastName, firstName, email, sex, birthDate) {

    if (lastName == null || lastName == "") {
        alert('Last name is required.');
        return false;
    }

    if (firstName == null || firstName == "") {
        alert('First name is required.');
        return false;
    }

    if (email == null || email == "") {
        alert('Email is required.');
        return false;
    } else {

        const regex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,}$/g;
        if (!regex.test(email)) {
            alert('Email is invalid.');
            return false;
        }
    }

    if (sex == null || sex == "") {
        alert('Gender must be selected.');
        return false;
    }

    if (birthDate == null || birthDate == "") {
        alert('You must enter your birthdate.');
        return false;
    } else if (!getAge(birthDate)) {
        alert('You must have at least 16 years old.');
        return false;
    } 

    return true;
}

//Clear modal after adding new employee
function clearModal() {
    document.getElementById("last-name").value = '';
    document.getElementById("first-name").value = '';
    document.getElementById("email-input").value = '';
    document.getElementById("gender-input").value = '';
    document.getElementById("birthdate-input").value = '';
    document.getElementById("picture").value = '';
}

//Sorting functionality

//Set the sorting function
function setSort() {
    document.getElementById("sortButton").addEventListener("click", sortTable, false);
}

//Sort by name ascendent function
function sortNameAscending(a, b) {
    if ((a.lastName + a.firstName) < (b.lastName + b.firstName)){
        return -1;
      }
      if ((a.lastName + a.firstName) > (b.lastName + b.firstName)){
        return 1;
      }
    return 0;
}

//Sort by name descendent function
function sortNameDescending(a, b) {
    if ((a.lastName + a.firstName) < (b.lastName + b.firstName)){
        return 1;
      }
      if ((a.lastName + a.firstName) > (b.lastName + b.firstName)){
        return -1;
      }
    return 0;
}

//Sort by age ascendent function
function sortAgeAscending(a, b) {
    ageA = parseInt(moment(a.birthDate).fromNow().split(' ')[0]);
    ageB = parseInt(moment(b.birthDate).fromNow().split(' ')[0]);
    
    if (ageA < ageB){
        return -1;
      }
      if (ageA > ageB){
        return 1;
      }
    return 0;
}

//Sort by age descendent function
function sortAgeDescending(a, b) {
    ageA = parseInt(moment(a.birthDate).fromNow().split(' ')[0]);
    ageB = parseInt(moment(b.birthDate).fromNow().split(' ')[0]);
    
    if (ageA < ageB){
        return 1;
      }
      if (ageA > ageB){
        return -1;
      }
    return 0;
}

//This function uses a switch to call the functions and show the sort result
function sortTable() {
    allEmployees = JSON.parse(localStorage.getItem('employees'));

    sortBy = document.getElementById('sortBy').value;

    switch (sortBy) {
        case '1':
            allEmployees.sort(sortNameAscending);
            break;
        case '2':
            allEmployees.sort(sortNameDescending);
            break;
        case '3':
            allEmployees.sort(sortAgeAscending);
            break;
        case '4':
            allEmployees.sort(sortAgeDescending);
            break;
    }
    document.getElementById("table-employees").innerHTML = '';

    allEmployees.forEach(e => {
        AppendTable(e);
    });
}

//Search employee by string (search bar)
function searchEmployee() {
    var input, filter, table, tr, td, i;
      input = document.getElementById("search-employee");
      filter = input.value.toUpperCase();
      table = document.getElementById("table-employees");
      tr = table.getElementsByTagName("tr");

      for (i = 0; i < tr.length; i++) {
        var td = tr[i].getElementsByTagName("td")[1]; // for column one
        var td1 = tr[i].getElementsByTagName("td")[2]; // for column two

        if (td) {
          if ( (td.innerHTML.toUpperCase().indexOf(filter) > -1) || (td1.innerHTML.toUpperCase().indexOf(filter) > -1) )  {            
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
    }
} 

//Uploading the picture
function showMyImage(e) {
    var imageFile = e.target.files[0];
    var img = document.getElementById("imgPreview");
    var imageType = /image.*/;

    if (imageFile.type.match(imageType)) {
      img.file = imageFile;
  
      var reader = new FileReader();
      reader.onload = (function (img) {
        return function (ee) {
          img.src = ee.target.result;
        };
      })(img);
      reader.readAsDataURL(imageFile);
    }
}

//Filter functionalities - Am dat 2 meciuri de LoL