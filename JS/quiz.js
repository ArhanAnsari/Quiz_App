const startbtn = document.querySelector(".start_btn")
const infoBox = document.querySelector(".info_box")
const quizBox = document.querySelector(".quiz_box")
const continuebtn = document.querySelector(".continue_btn")
const exitbtn = document.querySelector(".quit_btn")
const questext = document.querySelector(".que_text")
const nextbtn = document.querySelector(".next_btn")
const optionList = document.querySelector('.option_list')
const totalQues = document.querySelector(".total_que")
const timeCount = document.querySelector(".timer_sec")
const resultBox = document.querySelector(".result_box")
const restartbtn = document.querySelector(".result_buttons .restart")
const quitbtn = document.querySelector(".result_buttons .quit")
const scoreText = document.querySelector(".score_text")
const scoreIcon = document.querySelector(".icon")

let timecount;
let timeValue = 15;
let questionCount = 0;
let questionNumber = 1;
let userScore = 0;

// start button event
startbtn.addEventListener("click", function () {
    infoBox.classList.add("Info_active");
})

// exit button event
exitbtn.addEventListener("click", function () {
    infoBox.classList.remove("Info_active");
})

// quit button event
quitbtn.addEventListener("click",function(){
    window.location.reload();
})

// timer 
function startTime(time) {
    timecount = setInterval(timer, 1000);
    function timer() {
	timeCount.innerHTML = time
	time--;
	if (time < 0) {
	    clearInterval(timecount);
	}
	let min = Math.floor(time / 60);
	let sec = Math.floor(time % 60);

	if (min < 10) {
	    min = "0" + min
	}
	if (sec < 10) {
	    sec = "0" + sec
	}
	if (time == 0) {
	    clearInterval(timecount);
	    nextquestion();
	}
	timeCount.innerText = `${min}:${sec}`
    }
}

// continue button event
continuebtn.addEventListener("click", function () {
    infoBox.classList.remove("Info_active");
    quizBox.classList.add("Quiz_active");
    showQuestion(0);
    startTime(15);
    questionCounter(questionNumber);

})

// restart button event
restartbtn.addEventListener("click", function(){
    questionCount = 0;
    questionNumber = 1;
    userScore = 0;
    // Hide result box
    resultBox.classList.remove("result_active");
    // Show quiz box
    quizBox.classList.add("Quiz_active");
    // Display the first question
    showQuestion(questionCount);
    // Start the timer
    startTime(timeValue);
    questionCounter(questionNumber);
    // Hide next button
    nextbtn.style.display = "none";
})

//next button event
nextbtn.addEventListener("click", function () {
    nextquestion()
})
function nextquestion(){
    if (questionCount < quizquestions.length - 1) {
	questionCount++;
	showQuestion(questionCount);
	questionNumber++
	questionCounter(questionNumber);
	clearInterval(timecount);
	startTime(timeValue);
	nextbtn.style.display="none";
    }
    else {
	console.log('completed');
	showresultBox()
    }
}

// result box
function showresultBox(){
    infoBox.classList.remove("Info_active");
    quizBox.classList.remove("Quiz_active");
    resultBox.classList.add("result_active");

    if(userScore > 4){
	let scoreTag = `<p> and Congrats, You got ${userScore} out of ${quizquestions.length} </p>`
	scoreText.innerHTML = scoreTag
    }
    else if(userScore > 2){
	let scoreTag = `<p> Nice, You got ${userScore} out of ${quizquestions.length} </p>`
	scoreIcon.innerHTML = `<i class="far fa-thumbs-up"></i>`;
	scoreText.innerHTML = scoreTag
    }
    else if(userScore > 0){
	let scoreTag = `<p> Try again, You got ${userScore} out of ${quizquestions.length} </p>`
	scoreIcon.innerHTML = `<i class="far fa-sad-cry"></i>`;
	scoreText.innerHTML = scoreTag
    }
    else{
	let scoreTag = `<p> Sorry, You got ${userScore} out of ${quizquestions.length} </p>`
	scoreIcon.innerHTML = `<i class="far fa-sad-cry"></i>`;
	scoreText.innerHTML = scoreTag
    }
}

// showing questions
function showQuestion(index) {
    questext.innerHTML =
	`<div class="question">

    <span>${quizquestions[index].id}. ${quizquestions[index].question}</span>
    </div>`
    let optiontag = `
    <div class="option">
    <div class="option_number">
    <span> A </span>
    </div>
    <span class="options">${quizquestions[index].Options[0]}</span>
    </div>

    <div class="option">
    <div class="option_number">
    <span> B </span>
    </div>
    <span class="options">${quizquestions[index].Options[1]}</span>
    </div>

    <div class="option">
    <div class="option_number">
    <span> C </span>
    </div>
    <span class="options">${quizquestions[index].Options[2]}</span>
    </div>

    <div class="option">
    <div class="option_number">
    <span> D </span>
    </div>
    <span class="options">${quizquestions[index].Options[3]}</span>
    </div>`

    optionList.innerHTML = optiontag
    const option = optionList.querySelectorAll(".option")
    for (let i = 0; i < option.length; i++) {
	option[i].setAttribute("onclick", "optionSelected(this)")
    }

}

let tickIconTag = '<div class="icon tick"><i class="fas fa-check"></i></div>';
let crossIconTag = '<div class="icon cross"><i class="fas fa-times"></i></div>';

// Option selected
function optionSelected(answer) {
    clearInterval(timecount);
    // Get the selected answer and the correct answer
    let selectedOption = answer.querySelector(".options").textContent.trim().toLowerCase();
    let correctAnswer = quizquestions[questionCount].answer.toLowerCase();

    // Add tick or cross icon based on the selected answer
    if (selectedOption === correctAnswer) {
	userScore += 1;
	answer.classList.add("correct");
	answer.insertAdjacentHTML("beforeend", tickIconTag);
    } else {
	answer.classList.add("incorrect");
	answer.insertAdjacentHTML("beforeend", crossIconTag);

	// select the correct answer and apply the correct style
	for (let option of optionList.children) {
	    let optionText = option.querySelector(".options").textContent.trim().toLowerCase();
	    if (optionText === correctAnswer) {
		option.classList.add("correct");
		option.insertAdjacentHTML("beforeend", tickIconTag);
	    }
	}
    }
    // Disable all options
    for (let option of optionList.children) {
	option.classList.add("disabled");
    }
    // Display the next button
    nextbtn.style.display = "block";
}

// question counter
function questionCounter(index) {
    totalQues.innerHTML = `${index} of ${quizquestions.length} Questions`;
}

// Get questions
let quizquestions = [];
const quizurl = 'quiz.json'
async function getquestion() {
    const data = await fetch(`${quizurl}`)
	.then(data => {
	    return data.json()
	})
	.catch(err => console.log(err))
    quizquestions = data;
    console.log(quizquestions);
}
getquestion();