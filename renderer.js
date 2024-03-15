document.getElementById('file-upload').addEventListener('change', (event) => {
  const file = event.target.files[0];
  const filePath = file.path;

  window.electronAPI.readFile(filePath, (fileContent) => {
    document.getElementById('document-content').innerHTML = fileContent;
  });
});

function processMCQs(text) {
  const lines = text.trim().split(/\r?\n/);
  const mcqs = [];
  let currentMCQ = null;
  let lineNumber = 1;

  for (const line of lines) {
    if (line.trim().match(/^\d+\)/)) {
      // New MCQ
      if (currentMCQ !== null) {
        mcqs.push(currentMCQ);
      }
      currentMCQ = {
        number: line.trim().match(/\d+/)[0],
        question: line.trim().substring(currentMCQ ? currentMCQ.number.length + 1 : line.trim().match(/\d+\)/)[0].length + 1),
        options: {},
        answer: null,
        explanation: null,
        topic: null,
        subTopic: null,
      };
    } else if (currentMCQ !== null && line.trim().match(/^\([A-Z]\)/)) {
      // MCQ option
      const optionMatch = line.trim().match(/^\(([A-Z])\)(.+)$/);
      currentMCQ.options[optionMatch[1]] = optionMatch[2];
    } else if (currentMCQ !== null && line.trim() === 'Answer:') {
      // MCQ answer
      currentMCQ.answer = lines[lineNumber].trim();
      lineNumber++;
    } else if (currentMCQ !== null && line.trim() === 'Explanation:') {
      // MCQ explanation
      let explanation = '';
      while (lineNumber < lines.length && lines[lineNumber].trim() !== 'Topic:') {
        explanation += lines[lineNumber].trim() + ' ';
        lineNumber++;
      }
      currentMCQ.explanation = explanation.trim();
      const topicAndSubtopic = currentMCQ.explanation.match(/Topic:\s*(.+?)\s+Sub\s+Topic:\s*(.+)/);
      if (topicAndSubtopic) {
        currentMCQ.topic = topicAndSubtopic[1];
        currentMCQ.subTopic = topicAndSubtopic[2];
        currentMCQ.explanation = currentMCQ.explanation.slice(0, -(topicAndSubtopic[0].length)).trim();
      }
    }

    lineNumber++;
  }

  if (currentMCQ !== null) {
    mcqs.push(currentMCQ);
  }

  console.log(mcqs);
  // Process the extracted MCQs further (e.g., display, store, etc.)
}


document.getElementById('process-btn').addEventListener('click', () => {
  const documentContent = document.getElementById('document-content').innerText;
  //processMCQs(documentContent);
  const sampleText = `1) A teacher in the class should keep the pitch of his voice:

(A) Intonated

(B) Low

(C) Moderate

(D) Sometimes low and sometimes high

Answer: A

Explanation:

A teacher can effectively modulate his voice by intonation patterns. the teacher should  modulate his voice according to what he wants to communicate to the students. that is to say,  a lecture is always more effective when the teacher lays proper stress on various words and  phrases.

Topic: Teaching Aptitude

Sub Topic: Xys

... (rest of the MCQs)`;
processMCQs(sampleText);

});
