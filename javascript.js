function createQuizz() {
    document.querySelector(".quizz-creation").classList.remove("display-none")
}

function getAllQuizzes() {
    const promisse = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");
    promisse.then(putQuizzes);
}

function putQuizzes(answer) {
    const quizzes = answer.data
    for (let i = 0; i < quizzes.length; i++) {
        document.querySelector(".all-quizzes").innerHTML +=
            `
        <div class="quizz" onclick="openQuizz()">
        <div class="background">
                    
        </div>
            <img src="${quizzes[i].image}">
            <div class="title">
                <p>${quizzes[i].title}</p>
            </div>
        </div>
        `
    }

}




function basicInformationsQuizz() {
    const quizzTitle = document.getElementById("quizzTitle").value
    const urlImgQuizz = document.getElementById("urlImgQuizz").value
    const numberOfQuestions = document.getElementById("numberOfQuestions").value
    const numberOfLevel = document.getElementById("numberOfLevel").value


    if (quizzTitle.length <= 65 && quizzTitle.length >= 20 && numberOfQuestions >= 3 && numberOfLevel >= 2 && urlImgQuizz.indexOf("https://") == 0) {
        document.querySelector(".basic-information-quizz").classList.add("display-none")
        createQuestions(numberOfQuestions, numberOfLevel)
    } else {
        document.querySelector(".informations-input").classList.add("validate")
        if (!(quizzTitle.length <= 65 && quizzTitle.length >= 20)) {
            document.getElementById("titleError").classList.remove("display-none")

        } else {
            document.getElementById("titleError").classList.add("display-none")
        }
        if (!(urlImgQuizz.indexOf("https://") == 0)) {
            document.getElementById("urlError").classList.remove("display-none")
        } else {
            document.getElementById("urlError").classList.add("display-none")
        }
        if (numberOfQuestions < 3) {
            document.getElementById("quizzNumberError").classList.remove("display-none")
        } else {
            document.getElementById("quizzNumberError").classList.add("display-none")
        }
        if (numberOfLevel < 2) {
            document.getElementById("levelNumberError").classList.remove("display-none")
        } else {
            document.getElementById("levelNumberError").classList.add("display-none")
        }

    }
}

function createQuestions(numberOfQuestions, numberOfLevel) {

}
getAllQuizzes()