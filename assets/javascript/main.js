
 var config = {
  apiKey: "AIzaSyAlXf59qnV4taQiZhzU1ZS7ds9zbv4DHws",
  authDomain: "train-052587.firebaseapp.com",
  databaseURL: "https://train-052587.firebaseio.com",
  projectId: "train-052587",
  storageBucket: "",
  messagingSenderId: "267321084639"
};
firebase.initializeApp(config);


var database = firebase.database();

var employeeDir = database.ref("/employees");
  
  
  $(".btn-secondary").on("click",function(e){
    console.log("clicked");
    e.preventDefault();
    
    var name = $("#train-name").val().trim();
    var destination = $("#destination-name").val().trim();
    var time = $("#time-name").val().trim(); 
    var frequency = $("#frequency-name").val().trim();

    
    console.log(name,destination,time,frequency);

    employeeDir.push({
      name: name,
      destination: destination,
      time: time,
      frequency: frequency,
    });

    $(".arrival-form").trigger("reset");

  });

  
  employeeDir.on("child_added", function(childSnapshot) {

    
    console.log(childSnapshot.val().name);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().time);
    console.log(childSnapshot.val().frequency);

    var name = childSnapshot.val().name;
    var destination = childSnapshot.val().destination;
    var time = childSnapshot.val().time;
    var frequency = childSnapshot.val().frequency;

    
    var newRow = $("<tr>");
    var nameDisplay = $("<td>");
    var destinationDisplay = $("<td>");
    var timeDisplay = $("<td>");
    var frequencyDisplay = $("<td>");
    var minutesDisplay = $("<td class='minutes-disp'>");
    var removeDisplay = $("<td>");
    var removeButton = $("<button>");
    var removeForm = $("<form>");
    console.log(time);

    nameDisplay.attr("scope","col");
    destinationDisplay.attr("scope","col");
    timeDisplay.attr("scope","col");
    frequencyDisplay.attr("scope","col");
    minutesDisplay.attr("scope","col");
    removeDisplay.attr("scope","col");

    
    var minutes = frequency - Math.floor(((moment().unix("X")-moment(time, "hh:mm").unix("X"))/60)%frequency);
    console.log("Delta time; " + (moment().unix("X")-moment(time, "hh:mm").unix("X"))/60);
    console.log("until next train: "+ ((moment().unix("X")-moment(time, "hh:mm").unix("X"))/60)%frequency)

    
    var timeNext = moment().add(minutes,'m').format('HH:mm');

    nameDisplay.html(name);
    destinationDisplay.html(destination);
    timeDisplay.html(timeNext);
    frequencyDisplay.html(frequency);
    minutesDisplay.html(minutes);
    removeButton.addClass("btn btn-danger");
    removeButton.text("Remove");
    removeForm.html(removeButton);
    removeDisplay.append(removeForm);

    newRow.append(nameDisplay,destinationDisplay,frequencyDisplay,timeDisplay,minutesDisplay,removeDisplay);
    $("tbody").append(newRow);
  },function(errorObject) {
    console.log("Errors handled: " + errorObject.code);
  });

  

  function rollingClock() {
    var clock = moment().format('HH:mm:ss');  
    $("#current-time").html(clock);
    setTimeout(rollingClock,1000);  
    
  }

  
  $(".table").on("click",".btn-danger",function(f){

    f.preventDefault(); 
    console.log("I detected a press!");
    var trainName = $(this).closest('tr').find("td:first-child").text();
    console.log(trainName);
    employeeDir.once('value').then(function(snapshot) {

      snapshot.forEach(function(snapshot1) {
          console.log(snapshot1.key);
          console.log(snapshot1.val().name);
          if (snapshot1.val().name == trainName) {  

            const key = snapshot1.key;
            console.log("key found: "+ key);

            
            employeeDir.child(key).remove();
          }
      });
    });
    $(this).closest('tr').remove();

  });

  
  rollingClock();
