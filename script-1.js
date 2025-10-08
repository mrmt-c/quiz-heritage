// 📦 Googleスプレッドシートからクイズデータをとってくるよ
function getSheetUrl(courseName) {
  // コース名に応じてGoogleスプレッドシートのURLを切り替えるよ
  const sheetUrls = {
// ノーマルレベルのコース
    basicN: "https://docs.google.com/spreadsheets/d/1FrZmlShhwG4GanMQLjwY5wGJQ5NQrrYIE2nJOZA1B0A/export?format=csv&gid=0",
    japanN: "https://docs.google.com/spreadsheets/d/1ppAPyZx08pD_ktUV0WTxCD0Uf1yohdUZm86u3X75McE/export?format=csv&gid=0",
    world: "https://docs.google.com/spreadsheets/d/1Ups2ZBBIP5E7rpNYtb8ZZkPgGIlxbBNAz4-9q4fNoy0/export?format=csv&gid=0",
// チャレンジレベルのコース
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

// 🧩 HTMLのいろんな場所を見つけておくよ
const startScreen = document.getElementById("start-screen");      // スタート画面
//　const startButton = document.getElementById("start-button");      // スタートボタン　
const quizContainer = document.getElementById("quiz-container");  // クイズ表示エリア

let quizData = [];       // クイズデータをしまっておく箱
let correctCount = 0;  // 正解した数をかぞえるよ（はじめは0問！）★
let currentIndex = 0;    // 今の問題の番号（0が1問目だよ）

const courseButtons = document.querySelectorAll(".course-button");
let selectedCourse = ""; // 選ばれたコース名を保存しておくよ

// 🧭 レベル選択ボタンを見つけるよ（HTMLにある .level-button を全部取得！）
const levelButtons = document.querySelectorAll(".level-button");

// 🧭 コース選択画面とボタン表示エリアを見つけるよ
const courseScreen = document.getElementById("course-screen");
const courseButtonsContainer = document.getElementById("course-buttons");

// 🗂️ レベルごとに表示するコースをまとめておくよ
const courseGroups = {
  normal: [
    { name: "basicN", label: "基礎知識" },
    { name: "japanN", label: "日本の世界遺産" },
    { name: "world", label: "世界の世界遺産" }
  ],
  challenge: [
    { name: "basic", label: "基礎知識" },
    { name: "japan", label: "日本の世界遺産" },
    { name: "world1", label: "アジア" },
    { name: "world2", label: "アフリカ" },
    { name: "world3", label: "アメリカ" },
    { name: "world4", label: "ヨーロッパ" },
    { name: "world5", label: "オセアニア" }
  ]
};

// 🧩 レベルボタンを押したら、対応するコースボタンを表示するよ！
levelButtons.forEach(button => {
  button.addEventListener("click", () => {
    const selectedLevel = button.getAttribute("data-level"); // "normal" か "challenge"
    startScreen.classList.add("hidden");     // レベル選択画面を隠すよ
    courseScreen.classList.remove("hidden"); // コース選択画面を表示するよ
    courseButtonsContainer.innerHTML = "";   // 前のボタンを消しておくよ

    // レベルに応じたコースボタンを作って並べるよ
    courseGroups[selectedLevel].forEach(course => {
      const btn = document.createElement("button");
      btn.textContent = course.label;
      btn.classList.add("course-button");
      btn.setAttribute("data-course", course.name);
      courseButtonsContainer.appendChild(btn);

      // ✅ コースボタンを押したらクイズを読み込むよ（Googleスプレッドシートの読み込み！）
      btn.addEventListener("click", () => {
        selectedCourse = course.name;
        courseScreen.classList.add("hidden");
        quizContainer.classList.remove("hidden");
        const url = getSheetUrl(selectedCourse); // URLを取得するよ
        loadQuiz(url); // クイズを読み込むよ！
      });
    });
  });
});
// 🧭 「レベル選択にもどる」ボタンを見つけるよ
const backToLevelButton = document.getElementById("back-to-level");

backToLevelButton.addEventListener("click", () => {
  courseScreen.classList.add("hidden");     // コース選択画面を隠すよ
  startScreen.classList.remove("hidden");   // レベル選択画面を表示するよ
});

// レベル選択機能を追加したのでここはコメント　
// courseButtons.forEach(button => {
//   button.addEventListener("click", () => {
//     selectedCourse = button.getAttribute("data-course");
//     startScreen.classList.add("hidden");
//     quizContainer.classList.remove("hidden");
//     const url = getSheetUrl(selectedCourse); // ← URLを取り出す関数を呼ぶ
//     loadQuiz(url); // コース名を渡してクイズを読み込むよ
//   });
// });

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
    resultText = `<p style="color:green; font-size:1.4em;">⭕ 正解！</p>`;
    correctCount++;  // 正解だったら1問ふやすよ！★
  } else {
    resultText = `<p style="color:blue; font-size:1.4em;">❌ ざんねん…</p>`;
  }

  // 📚 解説を表示するよ
  resultText += `<p>${current.explanation}</p>`;

  // 🛤️ 次の問題があるかどうか調べて、ボタンを変えるよ
  if (currentIndex < quizData.length - 1) {
    resultText += `
      <button onclick="goToNext()">次の問題へ</button>
      <button onclick="goToCourseSelect()">コース選択へもどる</button>
    `;
  } else {
    resultText += `
    <p>　</p>
    <p>これで問題は終わりです</p>
    <p>全${quizData.length}問中、${correctCount}問正解でした！</p>
    <button onclick="goToCourseSelect()">コース選択へもどる</button>`;
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

// 🔁 コース選択画面にもどる関数だよ
window.goToCourseSelect = function() {
  currentIndex = 0;
  correctCount = 0;
  quizContainer.classList.add("hidden");     // クイズ画面をかくすよ
  courseScreen.classList.remove("hidden");   // コース選択画面を表示するよ
};
