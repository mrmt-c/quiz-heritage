// 📦 Googleスプレッドシートからクイズデータをとってくるよ
function getSheetUrl(courseName) {
  // コース名に応じてGoogleスプレッドシートのURLを切り替えるよ
  const sheetUrls = {
    basic: "https://docs.google.com/spreadsheets/d/1s2MpuwqZ75-Jo6bg7pdXGfcLWGudfRQb8TbS9ZIJ6lk/export?format=csv&gid=0",
    japan: "https://docs.google.com/spreadsheets/d/1TTXHc6l5FmNBiVNeJVuXmAm1tWXTsXlDrego6F-iKr0/export?format=csv&gid=0",
    world1: "https://docs.google.com/spreadsheets/d/1lkSH8G9eCVJLVs8nix3DPgyDXi3eLz-QdzNtU9ZChaM/export?format=csv&gid=0",
    world2: "https://docs.google.com/spreadsheets/d/1aLj9099i_zDOifH1HKkoUG4VUpipN9vbe3MDmieii24/export?format=csv&gid=0",
    world3: "https://docs.google.com/spreadsheets/d/1pn6WHaYKKG-9d5rzGztN6VSZasYCeJeR8MeMxmYqyfU/export?format=csv&gid=0",
    world4: "https://docs.google.com/spreadsheets/d/1m88xVix70g3VYLl0H2DlPtW0yMubz9kBuUx6HZ82gp8/export?format=csv&gid=0",
    world5: "https://docs.google.com/spreadsheets/d/1Bp-zXfhOxwceE19PTCfqC9QGzrx1yk2vTqj1xUHOcco/export?format=csv&gid=0"
  };
  return sheetUrls[courseName] || sheetUrls['basic']; // デフォルトは'basic'コース
};
//const sheetUrl = sheetUrls[courseName]; // ← ここで選ばれたコース名に応じたURLを取り出す！

// const sheetUrl = "https://docs.google.com/spreadsheets/d/1s2MpuwqZ75-Jo6bg7pdXGfcLWGudfRQb8TbS9ZIJ6lk/export?format=csv&gid=0";

// 🧩 HTMLのいろんな場所を見つけておくよ
const startScreen = document.getElementById("start-screen");      // スタート画面
const startButton = document.getElementById("start-button");      // スタートボタン　
const quizContainer = document.getElementById("quiz-container");  // クイズ表示エリア

let quizData = [];       // クイズデータをしまっておく箱
let correctCount = 0;  // 正解した数をかぞえるよ（はじめは0問！）★
let currentIndex = 0;    // 今の問題の番号（0が1問目だよ）

const courseButtons = document.querySelectorAll(".course-button");
let selectedCourse = ""; // 選ばれたコース名を保存しておくよ

courseButtons.forEach(button => {
  button.addEventListener("click", () => {
    selectedCourse = button.getAttribute("data-course");
    startScreen.classList.add("hidden");
    quizContainer.classList.remove("hidden");
    const url = getSheetUrl(selectedCourse); // ← URLを取り出す関数を呼ぶ
    loadQuiz(url); // コース名を渡してクイズを読み込むよ
  });
});

// 🚀 スタートボタンを押したらクイズを始めるよ -> コース選択にしたのでスタートボタンは使わない
// startButton.onclick = () => {
//   startScreen.classList.add("hidden");       // スタート画面を隠すよ
//   quizContainer.classList.remove("hidden");  // クイズ画面を出すよ
//  loadQuiz();                                 // クイズのデータをとってくるよ
// };

// 📥 クイズデータをとってくる関数だよ
function loadQuiz(sheetUrl) {
  quizData = []; // 前のデータを消す
  currentIndex = 0; // インデックスをリセット
  quizContainer.innerHTML = "<p>読み込み中...</p>"; // ローディング表示！
  fetch(sheetUrl)
    .then(response => response.text())
    .then(csv => {
      const lines = csv.trim().split("\n").slice(1); // 1行目はタイトルなので飛ばすよ
      quizData = lines.map(line => {
        const [question, opt1, opt2, opt3, opt4,answerIndex, explanation] = line.split(",");
        return {
          question: question,
          choices: [opt1, opt2, opt3, opt4],
          correct: parseInt(answerIndex) - 1,  // 正解の番号は0スタートにするよ
          explanation: explanation
        };
      });
      showQuestion(currentIndex); // 最初の問題を表示するよ！
    });
}

// 🖼️ 問題を1問ずつ画面に出す関数だよ
function showQuestion(index) {
  const data = quizData[index];  // 今の問題を取り出すよ

  quizContainer.innerHTML = `
    <h3>Q${index + 1}: ${data.question}</h3>
    <div class="choices">
    ${data.choices.map((choice, i) => `
      <button class="choice-btn" onclick="checkAnswer(${i})">${choice}</button>
    `).join("")}
    </div>
    <div id="feedback" style="margin-top:10px;"></div> <!-- 解説や次のボタンを出す場所 -->
  `;
}

// ✅ ユーザーが選んだ答えをチェックして、結果と解説を表示する関数だよ
window.checkAnswer = function(selectedIndex) {
  const current = quizData[currentIndex];    // 今の問題データ
  const feedback = document.getElementById("feedback"); // 解説を表示する場所
  let resultText = "";

  // 🎯 正解かどうか調べるよ
  if (selectedIndex === current.correct) {
    resultText = `<p style="color:green;">⭕ 正解！</p>`;
    correctCount++;  // 正解だったら1問ふやすよ！★
  } else {
    resultText = `<p style="color:red;">❌ ざんねん…</p>`;
  }

  // 📚 解説を表示するよ
  resultText += `<p>${current.explanation}</p>`;

  // 🛤️ 次の問題があるかどうか調べて、ボタンを変えるよ
  if (currentIndex < quizData.length - 1) {
    resultText += `
      <button onclick="goToNext()">次の問題へ</button>
      <button onclick="goToStart()">スタートへもどる</button>
    `;
  } else {
    resultText += `
    <p>　</p>
    <p>これで問題は終わりです</p>
    <p>全${quizData.length}問中、${correctCount}問正解でした！</p>
    <button onclick="goToStart()">スタートへもどる</button>`;
  }

  feedback.innerHTML = resultText;

  // 🚫 回答のボタンだけおせないようにするよ（次へやスタートはそのまま！）
  const choiceButtons = quizContainer.querySelectorAll(".choice-btn");
  choiceButtons.forEach(btn => btn.disabled = true);
};

// ⏭️ 次の問題に進む関数だよ
window.goToNext = function() {
  currentIndex++;              // 問題の番号をふやして…
  showQuestion(currentIndex);  // 次の問題を表示！
};

// 🔁 スタート画面にもどる関数だよ
window.goToStart = function() {
  currentIndex = 0;                  // 問題を最初にもどすよ
  correctCount = 0;  // また0問からスタートするよ！★
  startScreen.classList.remove("hidden"); // スタート画面を表示
  quizContainer.classList.add("hidden");  // クイズ画面をかくすよ
}
