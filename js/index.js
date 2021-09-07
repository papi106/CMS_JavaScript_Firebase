window.onload = () =>{

    document.getElementById("add-employee-button").addEventListener("click", AddEmployee, false);

    document.getElementById("modalButton").addEventListener("click", openModal, false);

    document.querySelectorAll(".close-myModal").forEach(e =>{
        e.addEventListener("click", closeModal, false);
    });

    currentEmployees = JSON.parse(localStorage.getItem('employees'));

    if (currentEmployees == undefined)
    {
        localStorage.setItem('employees', JSON.stringify([]));
        localStorage.setItem('employeeNextId', JSON.stringify(0));
    }
    else
    {
        currentEmployees.forEach(e => {
            AppendTable(e);
        });
    }

    setDelete();

    setSort();
}

//Put employee in table
function AppendTable(employee) {
    tableContent = `<tr employee-id=${employee.employeeId}>
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
    lastName = document.getElementById("last-name").value;
    firstName = document.getElementById("first-name").value;
    email = document.getElementById("email-input").value;
    gender = document.getElementById("gender-input").value;
    birthDate = document.getElementById("birthdate-input").value;
    picture = document.getElementById("imgPreview").src;

    validateForm = validate(lastName, firstName, email, gender, birthDate);

    if(validateForm) {
        employeeId = JSON.parse(localStorage.getItem('employeeNextId'));
        allEmployees =  JSON.parse(localStorage.getItem('employees'));
    
        newEmployee = new Employee(employeeId++, lastName, firstName, email, gender, birthDate, picture);
        allEmployees.push(newEmployee);
    
        localStorage.setItem('employeeNextId', JSON.stringify(employeeId));
        localStorage.setItem('employees', JSON.stringify(allEmployees));
    
        AppendTable(newEmployee);
        setDelete();
        closeModal();
        clearModal();
    }
}

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

//Delete employee function
function deleteEmployeeRow(htmlDeleteElement) {
    if (confirm('Are you sure to delete this employee ?')) {
        rowToBeDeleted = htmlDeleteElement.target.closest("tr");
        employeeToDeleteId = rowToBeDeleted.getAttribute("employee-id");

        rowToBeDeleted.remove();

        allEmployees = JSON.parse(localStorage.getItem('employees'));
        allEmployees = allEmployees.filter(e => e.employeeId != employeeToDeleteId);

        localStorage.setItem('employees', JSON.stringify(allEmployees));
    }
}

//Getting age and validation of 16+ from birthdate function
function getAge() {
    birthDate = new Date(birthDate);
    diff = new Date(Date.now() - birthDate.getTime());
    age = diff.getUTCFullYear() - 1970;

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
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search-employee");
    filter = input.value.toUpperCase();
    table = document.getElementById("table-employees");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[1];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
    }

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[2];
        if (td) {
          txtValue = td.textContent || td.innerText;
          if (txtValue.toUpperCase().indexOf(filter) > -1) {
            tr[i].style.display = "";
          } else {
            tr[i].style.display = "none";
          }
        }
    }
}

//Uploading the picture
function showMyImage(fileInput) {
    var imageFile = fileInput.files[0];
    var img = document.getElementById("imgPreview");
    var imageType = /image.*/;
    if (imageFile.type.match(imageType)) {
      img.file = imageFile;
  
      var reader = new FileReader();
      reader.onload = (function (img) {
        return function (e) {
          img.src = e.target.result;
        };
      })(img);
      reader.readAsDataURL(imageFile);
    }
  }

//Filter functionalities