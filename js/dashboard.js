// Initialize Firebase
var config = {
apiKey: "AIzaSyBKbAkZdzavKenQ9jwfbFNKeDCbGQMoYSg",
authDomain: "never-forgetter.firebaseapp.com",
databaseURL: "https://never-forgetter.firebaseio.com",
projectId: "never-forgetter",
storageBucket: "never-forgetter.appspot.com",
messagingSenderId: "1056019897192"
};
firebase.initializeApp(config);

//firebase variables
var projectRef;
var userId;

//Reference HTML Elements
const addProjectBtn = document.getElementById('addProjectBtn');
const createBtn = document.getElementById('createBtn');

// Redirect user if not signed in
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      // User is signed in
      userId = user.uid;
      projectRef = firebase.database().ref(userId);
      displayProjects();
    } else {
      // No user is signed in
      location.href="login.html";
    }
});

// Create New Project
addProjectBtn.addEventListener('click', ()=>{
    createNewProject();
});

var productArray=[];

// Function to create new project
function createNewProject(){
    productArray=[];
    document.getElementById('headerTxt').innerHTML = "Create A Project";
    document.getElementById('modalTxt').innerHTML = '<input type="text" id="titleTxt" class="form-control form-control-lg float-center mb-2" placeholder="Enter Title"><textarea type="text" id="descTxt" class="form-control form-control-lg float-center mb-2" placeholder="Enter Description (Optional)"></textarea><p class="text-secondary float-right fifty-right"><i class="fa fa-arrow-left"></i> Click X for no due date.</p><input type="date" class="fifty-left float-left mb-3 form-control" id="dateTxt"><input type="text" id="newProductTxt" class="form-control fifty-left" placeholder="Enter Product To Get"><button class="half-right mb-2 btn btn-md btn-primary" id="newProductBtn" onclick="newProduct()">Add</button><ul class="list-group mt-2 mb-3" id="productList"></ul><button id="createBtn" class="btn btn-lg btn-warning mb-3 float-left mt-3" onclick="createBtnAction()">Create!</button>';
    //Set Datepicker's date to today's date
    document.getElementById('dateTxt').valueAsDate = new Date();

    document.getElementById('modal-bg').style.display = 'block';
}

// Modal to input information for new project
var modal = document.getElementById('modal-bg');
var closeBtn = document.getElementById('closeBtn');

closeBtn.addEventListener('click', () => {
  closeModal();
}); 

window.addEventListener('click', (e) => {
  if (e.target == modal) {
    closeModal();
  }
});

var title;
var desc;
var date;
var products;

// Create Project
function createBtnAction(){
    title = document.getElementById('titleTxt').value;
    desc = document.getElementById('descTxt').value;
    date = document.getElementById('dateTxt').value;
    products = productArray;

    var newDate = dateConvert(date);
    date = newDate;

    if (desc == "undefined"){
      desc = "";
    }
    if (title != "") {
        createProject(title, desc, date, products);
    }
    
}

//close modal
function closeModal() {
    document.getElementById('modal-bg').style.display = 'none';
}

// Create Project Function
function createProject(title, desc, date, products){
    document.getElementById('titleTxt').value = "";
    document.getElementById('descTxt').value = "";
    document.getElementById('dateTxt').value = "";
    closeModal();
    var newProjectRef = projectRef.push();
    newProjectRef.set({
        title: title,
        desc: desc,
        date: date,
        products: products
    });
}

// Display Projects
function displayProjects(){
    projectRef.on('value', gotData, errData);
}

var k;
var keys;
var projectList;
var projects;

//Display projects
function gotData(data) {
    projects = data.val();
    keys = Object.keys(projects);
    projectList = document.getElementById('projectList');  
    if (keys.length > 0){
      projectList.innerHTML = "";
      for (var i=0; i<keys.length; i++){
        k = keys[i];
        var title = projects[k].title;
        var desc = projects[k].desc;
        var date = projects[k].date;
        var products = projects[k].products;
        if (date != "mm/dd/yyyy" && date != ""&& date != "//"){
          projectList.innerHTML += "<a href='#' id='"+keys[i]+"' onclick='viewProject(this)' class='list-group-item list-group-item-project'><strong>"+title.slice(0,15)+"</strong>  <span class='ml-2 badge badge-light'> Due: "+date+"</span><br/><span class='float-right text-left text-secondary float-left'>"+desc.slice(0,100)+"</span></a>";        
        } else{
          projectList.innerHTML += "<a href='#' id='"+keys[i]+"' onclick='viewProject(this)' class='list-group-item list-group-item-project'><strong>"+title.slice(0,24)+"</strong>  <br/><span class='float-left text-left text-secondary'>"+desc.slice(0,100)+"</span></a>";
        }
      }
    } else {
      projectList.innerHTML = "";
    }
  }
  
  function errData(err) {
    console.log('Error!');
    console.log(err);
  }

  // Display project in modal
function viewProject(elmnt){
    var title = projects[elmnt.id].title;
    var desc = projects[elmnt.id].desc;
    var date = projects[elmnt.id].date;
    var products = projects[elmnt.id].products;
    displayModal(title, desc, date, elmnt.id);
}

  // Display modal with new data
function displayModal(title, desc, date, id){
    var headerTxt = document.getElementById('headerTxt');
    var modalTxt = document.getElementById('modalTxt');

    headerTxt.innerHTML = title;
    if(date != "" && date != "//"){
      modalTxt.innerHTML = "<h4 class='mb-3'>"+desc+"</p><h6 class='mb-3 text-secondary'>Due: "+date+"</h6><button class='btn btn-danger btn-md float-left mb-3' id='"+id+"' onclick='edit(this)'>Edit</button><button class='btn btn-md btn-primary float-right' id='"+id+"' onclick='complete(this)'>Complete</button>";
    } else {
      modalTxt.innerHTML = "<h4 class='mb-3'>"+desc+"</p><button class='btn btn-danger btn-md float-left mb-3' id='"+id+"' onclick='edit(this)'>Edit</button><button class='btn btn-md btn-primary float-right' id='"+id+"' onclick='complete(this)'>Complete</button>";      
    }
    document.getElementById('modal-bg').style.display = 'block';
}

// Complete a project
function complete(elmnt){
  id = elmnt.id;
  firebase.database().ref(userId+'/'+id).remove();
  location.reload();
  closeModal();
}

// edit the project
function edit(elmnt){
  var headerTxt = document.getElementById('headerTxt');
  var modalTxt = document.getElementById('modalTxt');

  var title = projects[elmnt.id].title;
  var desc = projects[elmnt.id].desc;
  var date = projects[elmnt.id].date;

  headerTxt.innerHTML = "<h3 id='headerTxt'>Create A Project</h3>";
  modalTxt.innerHTML = '<input type="text" id="newTitle" class="form-control mb-2" value="'+title+'"><textarea id="newDesc" class="form-control mb-2">'+desc+'</textarea><input type="date" id="newDate" class="form-control mb-3" value="'+unConvertDate(date)+'"><button class="btn btn-primary btn-lg" id="'+elmnt.id+'" onclick="save(this)">Save</button>';
}

// save the new version
function save(elmnt) {
  var newTitle = document.getElementById('newTitle');
  var newDesc = document.getElementById('newDesc');
  var newDate = document.getElementById('newDate');

  var newNewDate = dateConvert(newDate.value);
  
  //Make the new version
  var newProjectRef = projectRef.push();
  newProjectRef.set({
      title: newTitle.value,
      desc: newDesc.value,
      date: newNewDate
  });
  closeModal();
  // Delete the old version
  firebase.database().ref(userId+'/'+elmnt.id).remove();
}

// Format Date

function dateConvert(date) {
  var year = date.substr(0,4)
  var month = date.substr(5,2);
  var day = date.substr(8,2);
  return month+'/'+day+'/'+year;
}

// Un format Date
function unConvertDate(date){
  var year = date.substr(6,4);
  var month = date.substr(0,2);
  var day = date.substr(3,2);
  return year+'-'+month+'-'+day;
}

function newProduct() {
  var newProductTxt = document.getElementById('newProductTxt');
  var productList = document.getElementById('productList');
  productArray.push(newProductTxt.value);
  productList.innerHTML += '<li class="list-group-item">'+newProductTxt.value+'</li>';
  newProductTxt.value = "";
}