// function for signup
function signUp(event) {
    // prevents page reload
    event.preventDefault();

    // get spinner
    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    // get values from inputs
    const getName = document.getElementById("name").value;
    const getEmail = document.getElementById("email").value;
    const getPass = document.getElementById("password").value;
    const getConfirmPass = document.getElementById("confirmPassword").value;

    if (getName === "" || getEmail === "" || getPass === "" || getConfirmPass === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
        getSpin.style.display = "none";
    }

    if (getConfirmPass !== getPass) {
        Swal.fire({
            icon: 'info',
            text: 'Password do not match',
            confirmButtonColor: '#2D85DE'
        })
    } else {
        const signData = new FormData();
        signData.append("name", getName);
        signData.append("email", getEmail);
        signData.append("password", getPass);
        signData.append("password_confirmation", getConfirmPass);

        const signReq = {
            method: 'POST',
            body: signData
        }

        const url = "https://pluralcodesandbox.com/yorubalearning/api/register_admin";

        fetch(url, signReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })

                //If result success, redirect to index.html page
                setTimeout(() => {
                    location.href = "index.html"
                }, 3000)
            }
            else {
                Swal.fire({
                    Icon: 'info',
                    text: 'Registration Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}

function logIn(event){
    event.preventDefault();

    const getSpin = document.querySelector('.spin');
    getSpin.style.display = "inline-block";

    const getEmail = document.getElementById("email").value;
    const getPassword = document.getElementById("password").value;

    if (getEmail === "" || getPassword === ""){
        Swal.fire({
            icon: "info",
            text: 'All fields are required',
            confirmedButtonColor: '#2D85DE'
        })

        getSpin.style.display = "none";

    }else{
        const logForm = new FormData();
        logForm.append("email", getEmail);
        logForm.append("password", getPassword);

        const logReq = {
            method: 'Post',
            body: logForm
        }

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin_login";

        fetch(url, logReq)
        .then(response => response.json())
        .then(result => {
            // console.log(result)

            //if login is successful, save the result,login object in a local storage
            localStorage.setItem("admin", JSON.stringify(result));
            const getItem = localStorage.getItem("admin");
            const theItem = JSON.parse(getItem);

            if (theItem.hasOwnProperty("email")){
                location.href = "dashboard.html";
            }else{
                Swal.fire({
                    icon: 'warning',
                    text: 'Login unsuccessful',
                    confirmedButtonColor: '#2D85DE'
                })
            }
        })
        .catch(error => console.log('error', error));
    }
}

// function for dashboard apis

function dashboardApi(){
    const myPageModal = document.querySelector(".pagemodal");
    myPageModal.style.display = "block";

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;

    const dashHeader = new Headers();
    dashHeader.append("Authorization", `Bearer ${token}`);

    const dashReq = {
        method: 'GET',
        headers: dashHeader
    }
    // console.log(token)

    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/admin_dashboardapi";

    fetch(url, dashReq)
    .then(response => response.json())
    .then(result => {
        // console.log(result)

        const adminName = document.getElementById("adminId");
        const getCat = document.getElementById("category");
        const getLearn = document.getElementById("learnmat");
        const getSubCat = document.getElementById("subCat");
        const getQuiz = document.getElementById("quiz");
        const getStudent = document.getElementById("student");

        adminName.innerHTML = `${result.admin_name}`;
        getCat.innerHTML = `${result.total_number_of_categories}`;
        getLearn.innerHTML = `${result.total_number_of_learningmaterial}`;
        getSubCat.innerHTML = `${result.total_number_of_subcategories}`;    
        getQuiz.innerHTML = `${result.total_number_of_quize}`;
        getStudent.innerHTML = `${result.total_number_of_students}`;

        myPageModal.style.display = "none";
    })
    .catch(error => console.log('error', error));
}
dashboardApi();

function studentModal(){
    const myModal = document.querySelector(".mymodal2");
    myModal.style.display = "block";
    
    const myPageModal = document.querySelector(".pagemodal");
    myPageModal.style.display = "block";

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;
    // console.log(token);

    const topThreeStudents = new Headers();
    topThreeStudents.append("Authorization", `Bearer ${token}`);

    const req = {
        method: 'GET',
        headers: topThreeStudents
    }

    let dataItem = [];

    const url =  'https://pluralcodesandbox.com/yorubalearning/api/admin/top_three_students';

    fetch(url, req)
    .then(response => response.json())
    .then(result => {
        result.map((data)=>{
            if(dataItem.length >= 0){
                dataItem += `
                <div class="student-card">
                    <p><span class="clent">Name</span>: <span class="swichItem">${data.name}</span></p>
                    <p><span class="clent">Email</span>: <span class="swichItem">${data.email}</span></p>
                    <p><span class="clent">Phone</span>: <span class="swichItem">${data.phone_number}</span></p>
                    <p><span class="clent">Position</span>: <span class="swichItem">${data.position}</span></p>
                    <p><span class="clent">Score</span>: <span class="swichItem">${data.total_score}</span></p>
                </div>`

                const allStud = document.querySelector(".allstudent");
                allStud.innerHTML = dataItem;
            }else {
                Swal.fire({
                    icon: 'warning',
                    text: 'No record found',
                    confirmedButtonColor: '#2D85DE'
                })
            }

        })
        
        myPageModal.style.display = "none";
    })
    .catch(error => console.log('error', error));
}
// studentModal();

function closeDashModal(){
    const myModal = document.querySelector(".mymodal2");
    myModal.style.display = "none";
}

//Get all students
function getAllStudent(){
    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;
    // console.log(token);

    const allStudentHeaders = new Headers();
    allStudentHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: allStudentHeaders
      };

    const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/get_all_students";

      let dataItem = [];
      fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            result.map(data => {
                if (dataItem.length >= 0){
                    dataItem +=
                    `<tr>
                        <td>${data.name}</td>
                        <td>${data.email}</td>
                        <td>${data.phone_number}</td>
                        <td>${data.position}</td>
                        <td>${data.total_score}</td>
                    </tr>`
                    
                    const allStudents = document.getElementById("table-id");
                    allStudents.innerHTML = dataItem;
                }else {
                    Swal.fire({
                        icon: 'warning',
                        text: 'No record found',
                        confirmedButtonColor: '#2D85DE'
                    })
                }
            });
        })       
        .catch(error => console.log('error', error));
}
getAllStudent();

// Create Categories
function createCategories(event){
    event.preventDefault();

    // Display Spinal
    const myPageModal = document.querySelector(".pagemodal");
    myPageModal.style.display = "block";

    //get values from input
    const getCat = document.getElementById("categories").value;
    const getCatImg = document.getElementById("cat-img").files[0];

    //check for empty fields
    if (getCat === "" || getCatImg === ""){
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: '#2D85DE'
        })
        // getSpin.style.display = "none";
    }else{
        
        const myToken = localStorage.getItem("admin");
        const theToken = JSON.parse(myToken);
        const token = theToken.token;
        
        const myHeaders = new Headers();
        myHeaders.append("Authorization", `Bearer ${token}`);

        const formdata = new FormData();
        formdata.append("name", getCat);
        formdata.append("image", getCatImg);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: formdata
        }

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/create_category"

        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result =>{
            console.log(result)
            if (result.status === "success"){
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                setTimeout(()=>{
                    location.reload()
                }, 3000)
            }else{
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful',
                    confirmButtonColor: '#2D85DE'
                })
            }
            myPageModal.style.display = "none";
            document.getElementById("formId").reset(); 
        })
        .catch(error => console.log('error', error));
        
    }
}

function displayCat(){
    const myPageModal = document.querySelector(".pagemodal");
    myPageModal.style.display = "block";

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: 'GET',
        headers: myHeaders
    }

    let dataItem = [];

    const url =  'https://pluralcodesandbox.com/yorubalearning/api/admin/category_list';
    
    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result => {
        // console.log(result);
        
        result.map((data)=>{
            // console.log(data);
            if(dataItem.length >= 0){
                dataItem += `
                <div class="student-card">
                    <div class="search-card">
                    <a href="details.html?id=${data.id}&name=${data.name}">  <img src="${data.image}"></a>
                    </div>
                    <p>${data.name}</p>
                    <div class="text-right"> 
                        <button class="update-button" onclick="displayCategoryForm(${data.id})">Update</button>
                        <button class="delete-button" onclick="deleteCategory(${data.id})">Delete</button>
                    </div>
                </div>
                `
                // <a href="details.html?id=${item.id}&name=${item.name}">  <img src="${item.image}"></a>

                const displayCategories = document.querySelector(".scroll-div");
                displayCategories.innerHTML = dataItem;
            }else {     
                Swal.fire({
                    icon: 'warning',
                    text: 'No record found',
                    confirmedButtonColor: '#2D85DE'
                })
            }
            myPageModal.style.display = "none";
        })
    })
    .catch(error => console.log('error', error));

}
displayCat();

// Function to update category
let uniqueId;
function displayCategoryForm(myId){

    //Save the uniqueId on local storage
    localStorage.setItem("un", myId);

     // Display modal
    const displayModal = document.querySelector(".mymodal");
    displayModal.style.display = "block";

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;
         
    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    uniqueId = myId;
       
        const requestOptions = {
            method: 'GET',
            headers: myHeaders,
        };

        const url =  `https://pluralcodesandbox.com/yorubalearning/api/admin/get_details?category_id=${uniqueId}`;
        
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            // console.log(result)

            const getUpName = document.getElementById("updateName");
            const getUpName2 = document.getElementById("updateNameImage");

            getUpName.setAttribute('value', `${result.name}`);
            getUpName2.setAttribute('value', `${result.image}`);
        })
        .catch(error => console.log('error', error));
}


// function updateCategory(catId){
//     // Get token from storage
//     const getToken = localStorage.getItem('admin');
//     const token = JSON.parse(getToken);
//     const myToken = token.token;

//     const myHeaders = new Headers();
//     myHeaders.append("Authorization", `Bearer ${myToken}`);

//     //get values from input
//     const getCat = document.getElementById("updateName").value;
//     const getCatImg = document.getElementById("updateNameImage").files[0];

//     const formdata = new FormData();
//     formdata.append("name", getCat);
//     formdata.append("image", getCatImg);
//     formdata.append("image", getCatImg2);
//     formdata.append("category_id", getId);

//     const requestOptions = {
//         method: 'GET',
//         headers: myHeaders,
//         body: formdata
//     };

//     const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/update_category/${catId}`;

//     fetch(url, requestOptions)
//     .then(response => response.json())
//     .then(result => console.log(result))
//     .catch(error => console.log('error', error));
// }
function updateCategory(event) {
    event.preventDefault();

    const getSpin = document.querySelector(".spin2");
    getSpin.style.display = "inline-block";

    const getUpname = document.getElementById("updateName").value;
    const getUimg1 = document.getElementById("updateNameImage").value;
    const getUimg2 = document.getElementById("updateImage").files[0];
    const getId = localStorage.getItem("un");
    if (getUpname === "") {
        Swal.fire({
            icon: 'info',
            text: 'the name field is required!',
            confirmButtonColor: "#2D85DE"
        })
        getSpin.style.display = "none";
    }
    else {
        const getToken = localStorage.getItem('admin');
        const token = JSON.parse(getToken);
        const myToken = token.token;

        const listHeaders = new Headers();
            listHeaders.append("Authorization", `Bearer ${myToken}`);

        const upFormData = new FormData();
            upFormData.append("name", getUpname);
            upFormData.append("image", getUimg1);
            upFormData.append("image", getUimg2);
            upFormData.append("category_id", getId);

        const upReq = {
            method: 'POST',
            headers: listHeaders,
            body: upFormData
        };
        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/update_category";
        fetch(url, upReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                setTimeout(() => {
                    location.reload();
                }, 3000)
            }
            else{
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}

function getNameDetails() {
    const myParams = new URLSearchParams(window.location.search);
    let catName = myParams.get('name');
    const displayCatName = document.querySelector(".det");
    displayCatName.innerHTML = catName;
}

// function to create subcategory
function createSubCategory(event){
    event.preventDefault();

    const params = new URLSearchParams(window.location.search);
    let catId = params.get('id');

    const getSpin = document.querySelector(".spin3");
    getSpin.style.display = "inline-block";

    const catSubName = document.getElementById("subCatName").value;
    const catSubImage = document.getElementById("subCatImg").files[0];
    if (catSubName === "" || catSubImage === ""){
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: "#2D85DE"
        })
        getSpin.style.display = "none";
    }else{
        const getToken = localStorage.getItem('admin');
        const token = JSON.parse(getToken);
        const myToken = token.token;

        const listHeaders = new Headers();
            listHeaders.append("Authorization", `Bearer ${myToken}`);

        const upFormData = new FormData();
            upFormData.append("name", catSubName);
            upFormData.append("image", catSubImage);
            upFormData.append("category_id", catId);

        const upReq = {
            method: 'POST',
            headers: listHeaders,
            body: upFormData
        };
        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/create_subcategory";
        fetch(url, upReq)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                setTimeout(() => {
                    location.reload();
                }, 3000)
            }
            else{
                Swal.fire({
                    icon: 'info',
                    text: 'Unable to create record. Pls try again!',
                    confirmButtonColor: '#2D85DE'
                })
            }
            getSpin.style.display = "none";
        })
        .catch(error => console.log('error', error));
    }
}

// function to list sub-categories
function subCategoryList() {
    const params = new URLSearchParams(window.location.search);
    let getId = params.get('id');
    console.log(getId);

    const myToken = localStorage.getItem("admin");
    const theToken = JSON.parse(myToken);
    const token = theToken.token;

    const myHeaders = new Headers();
    myHeaders.append("Authorization", `Bearer ${token}`);

    const requestOptions = {
        method: "GET",
        headers: myHeaders
    }

    let subCatList = [];

    const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/category_details/${getId}`;

    fetch(url, requestOptions)
    .then(response => response.json())
    .then(result =>{
        console.log(result);
        result.map(item =>{
            if(subCatList.length >= 0){
                subCatList += `
                    <div class="col mb-4">
                    <div class="card">
                        <img src="${item.image}" class="card-img-top" alt="...">
                        <div class="card-body">
                        <p class="card-title text-right">${item.name}</p>
                        </div>
                    </div>
                    </div>
                `
            }else{
                Swal.fire({
                    icon: 'warning',
                    text: 'No record found',
                    confirmedButtonColor: '#2D85DE'
                })
            }
        })
        const subItems = document.querySelector(".subItems");
        subItems.innerHTML = subCatList;
    })
    .catch(error => console.log('error', error));
}

// function to delete category
function deleteCategory(myid) {
    const getToken = localStorage.getItem('admin');
    const token = JSON.parse(getToken);
    const myToken = token.token;
    const listHeaders = new Headers();
    listHeaders.append("Authorization", `Bearer ${myToken}`);
    const delReq = {
        method: 'GET',
        headers: listHeaders
    }
    const url = `https://pluralcodesandbox.com/yorubalearning/api/admin/delete_category/${myid}`;
    fetch(url, delReq)
    .then(response => response.json())
    .then(result => {
        console.log(result)
        if (result.status === "success") {
            Swal.fire({
                icon: 'success',
                text: `${result.message}`,
                confirmButtonColor: "#2D85DE"
            })
            setTimeout(() => {
                location.reload();
            }, 3000);
        }
        else {
            Swal.fire({
                icon: 'info',
                text: 'Unsuccessful',
                confirmButtonColor: "#2D85DE"
            })
        }
    })
    .catch(error => console.log('error', error));
}

function closeModal3(){
    const displayModal = document.querySelector(".mymodal");
    displayModal.style.display = "none";
}

// function to update admin profile
function upDateAdmin(event){
    event.preventDefault();

    const getSpin = document.querySelector(".spin");
    getSpin.style.display = "inline-block";

    const getName = document.getElementById("updateName").value;
    const getEmail = document.getElementById("updateEmail").value;
   
    if (getName === "" || getEmail === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields is required!',
            confirmButtonColor: "#2D85DE"
        })
        getSpin.style.display = "none";
    }
    else {
        const getToken = localStorage.getItem('admin');
        const token = JSON.parse(getToken);
        const myToken = token.token;

        const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${myToken}`);

        const adminFormData = new FormData();
            adminFormData.append("name", getName);
            adminFormData.append("email", getEmail);

        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: adminFormData
        };

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/admin_update_profile";
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                // setTimeout(() => {
                //     location.reload();
                // }, 3000)
                getSpin.style.display = "none";
            }
            else{
                Swal.fire({
                    icon: 'info',
                    text: 'Unsuccessful!',
                    confirmButtonColor: '#2D85DE'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}

function upDatePassword(event){
    event.preventDefault();

    const getSpin = document.querySelector(".spinx");
    getSpin.style.display = "inline-block";

    const getEmail = document.getElementById("updatePassEmail").value;
    const getPassword = document.getElementById("updatePassword").value;
    const getConfirmPassword = document.getElementById("confirmPassword").value;
   
    if (getEmail === "" || getPassword === "" || getConfirmPassword === "") {
        Swal.fire({
            icon: 'info',
            text: 'All fields are required!',
            confirmButtonColor: "#2D85DE"
        })
        getSpin.style.display = "none";
    }
    else {
        const getToken = localStorage.getItem('admin');
        const token = JSON.parse(getToken);
        const myToken = token.token;

        const myHeaders = new Headers();
            myHeaders.append("Authorization", `Bearer ${myToken}`);

        const adminFormData = new FormData();
            adminFormData.append("email", getEmail);
            adminFormData.append("password", getPassword);
            adminFormData.append("password_confirmation", getConfirmPassword);
            
        const requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: adminFormData
        };

        const url = "https://pluralcodesandbox.com/yorubalearning/api/admin/admin_update_password";
        fetch(url, requestOptions)
        .then(response => response.json())
        .then(result => {
            console.log(result)
            if (result.status === "success") {
                Swal.fire({
                    icon: 'success',
                    text: `${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                // setTimeout(() => {
                //     location.reload();
                // }, 3000)
                getSpin.style.display = "none";
            }
            else{
                Swal.fire({
                    icon: 'info',
                    text: `Unsuccessful, ${result.message}`,
                    confirmButtonColor: '#2D85DE'
                })
                getSpin.style.display = "none";
            }
        })
        .catch(error => console.log('error', error));
    }
}


function logout() {
    // clear your localstorage
    Swal.fire({
        icon: "success",
        text: "Logout Successful",
        confirmButtonColor: "#2D85DE"
    })

    setTimeout(()=> {
        localStorage.clear();
        location.href = "index.html"
    }, 3000)
}