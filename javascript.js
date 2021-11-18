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

getAllQuizzes()